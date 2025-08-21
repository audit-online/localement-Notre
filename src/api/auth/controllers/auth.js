const { createCoreController } = require('@strapi/strapi').factories;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = createCoreController('plugin::users-permissions.user', ({ strapi }) => ({

  /**
   * Connexion avec gestion des rôles
   */
  async login(ctx) {
    try {
      const { identifier, password } = ctx.request.body;

      if (!identifier || !password) {
        return ctx.badRequest('Email et mot de passe requis');
      }

      // Trouver l'utilisateur
      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: {
          $or: [
            { email: identifier.toLowerCase() },
            { username: identifier },
          ],
        },
        populate: {
          role: true,
          merchant: true,
          customer: true
        }
      });

      if (!user) {
        return ctx.badRequest('Identifiants incorrects');
      }

      // Vérifier le mot de passe
      const validPassword = await bcrypt.compare(password, user.password);
      
      if (!validPassword) {
        return ctx.badRequest('Identifiants incorrects');
      }

      // Vérifier que le compte est confirmé
      if (!user.confirmed) {
        return ctx.badRequest('Votre compte n\'est pas encore activé');
      }

      // Vérifier que le compte n'est pas bloqué
      if (user.blocked) {
        return ctx.badRequest('Votre compte est temporairement suspendu');
      }

      // Générer le token JWT
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || strapi.config.get('plugin.users-permissions.jwtSecret'),
        { expiresIn: '7d' }
      );

      // Nettoyer les données utilisateur (retirer le mot de passe)
      const { password: _, ...userWithoutPassword } = user;

      // Déterminer l'URL de redirection selon le rôle
      let redirectUrl = '/marketplace/';
      const userRole = user.role?.type;

      switch (userRole) {
        case 'super-admin':
          redirectUrl = '/marketplace/platform-admin.html';
          break;
        case 'commercial':
          redirectUrl = '/marketplace/commercial-dashboard.html';
          break;
        case 'merchant':
          redirectUrl = '/marketplace/merchant-dashboard.html';
          break;
        case 'customer':
          redirectUrl = '/marketplace/customer-dashboard.html';
          break;
        default:
          redirectUrl = '/marketplace/';
      }

      // Log de connexion
      console.log(`[LOGIN] ${userRole} ${user.email} connecté`);

      ctx.send({
        jwt: token,
        user: userWithoutPassword,
        redirectUrl,
        role: userRole
      });

    } catch (error) {
      console.error('Erreur de connexion:', error);
      ctx.badRequest('Erreur lors de la connexion');
    }
  },

  /**
   * Inscription avec attribution automatique de rôle
   */
  async register(ctx) {
    try {
      const { username, email, password, userType = 'customer' } = ctx.request.body;

      if (!username || !email || !password) {
        return ctx.badRequest('Username, email et mot de passe requis');
      }

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await strapi.query('plugin::users-permissions.user').findOne({
        where: {
          $or: [
            { email: email.toLowerCase() },
            { username },
          ],
        },
      });

      if (existingUser) {
        return ctx.badRequest('Un utilisateur avec cet email ou username existe déjà');
      }

      // Récupérer le rôle approprié
      const role = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: userType }
      });

      if (!role) {
        return ctx.badRequest('Type d\'utilisateur invalide');
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 12);

      // Créer l'utilisateur
      const newUser = await strapi.entityService.create('plugin::users-permissions.user', {
        data: {
          username,
          email: email.toLowerCase(),
          password: hashedPassword,
          confirmed: true, // Auto-confirmer pour la démo
          blocked: false,
          role: role.id,
          provider: 'local'
        },
        populate: {
          role: true
        }
      });

      // Si c'est un merchant, créer aussi l'entrée merchant
      if (userType === 'merchant') {
        await strapi.entityService.create('api::merchant.merchant', {
          data: {
            businessName: `Boutique de ${username}`,
            contactEmail: email,
            user: newUser.id,
            isActive: true
          }
        });
      }

      // Si c'est un customer, créer aussi l'entrée customer  
      if (userType === 'customer') {
        await strapi.entityService.create('api::customer.customer', {
          data: {
            email: email,
            firstName: username,
            user: newUser.id
          }
        });
      }

      // Générer le token
      const token = jwt.sign(
        { id: newUser.id },
        process.env.JWT_SECRET || strapi.config.get('plugin.users-permissions.jwtSecret'),
        { expiresIn: '7d' }
      );

      // Nettoyer les données
      const { password: _, ...userWithoutPassword } = newUser;

      console.log(`[REGISTER] Nouvel utilisateur ${userType}: ${email}`);

      ctx.send({
        jwt: token,
        user: userWithoutPassword,
        message: 'Inscription réussie'
      });

    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      ctx.badRequest('Erreur lors de l\'inscription');
    }
  },

  /**
   * Obtenir le profil utilisateur actuel
   */
  async me(ctx) {
    try {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('Non authentifié');
      }

      // Récupérer les données complètes de l'utilisateur
      const fullUser = await strapi.entityService.findOne('plugin::users-permissions.user', user.id, {
        populate: {
          role: true,
          merchant: {
            populate: {
              subscription: {
                populate: {
                  plan: true
                }
              },
              backend: true
            }
          },
          customer: {
            populate: {
              orders: true
            }
          }
        }
      });

      const { password, ...userWithoutPassword } = fullUser;

      ctx.send({
        user: userWithoutPassword
      });

    } catch (error) {
      console.error('Erreur récupération profil:', error);
      ctx.badRequest('Erreur lors de la récupération du profil');
    }
  },

  /**
   * Mise à jour du profil utilisateur
   */
  async updateProfile(ctx) {
    try {
      const user = ctx.state.user;
      const { firstName, lastName, phone, address } = ctx.request.body;

      if (!user) {
        return ctx.unauthorized('Non authentifié');
      }

      // Mettre à jour l'utilisateur
      const updatedUser = await strapi.entityService.update('plugin::users-permissions.user', user.id, {
        data: {
          firstName,
          lastName,
          phone
        },
        populate: {
          role: true,
          merchant: true,
          customer: true
        }
      });

      // Si c'est un merchant, mettre à jour les infos merchant
      if (user.role?.type === 'merchant' && user.merchant) {
        await strapi.entityService.update('api::merchant.merchant', user.merchant.id, {
          data: {
            phone,
            address
          }
        });
      }

      // Si c'est un customer, mettre à jour les infos customer
      if (user.role?.type === 'customer' && user.customer) {
        await strapi.entityService.update('api::customer.customer', user.customer.id, {
          data: {
            firstName,
            lastName,
            phone,
            address
          }
        });
      }

      const { password, ...userWithoutPassword } = updatedUser;

      ctx.send({
        user: userWithoutPassword,
        message: 'Profil mis à jour avec succès'
      });

    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      ctx.badRequest('Erreur lors de la mise à jour du profil');
    }
  },

  /**
   * Déconnexion
   */
  async logout(ctx) {
    try {
      const user = ctx.state.user;
      
      if (user) {
        console.log(`[LOGOUT] ${user.role?.type} ${user.email} déconnecté`);
      }

      ctx.send({
        message: 'Déconnexion réussie'
      });

    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      ctx.badRequest('Erreur lors de la déconnexion');
    }
  }

}));
