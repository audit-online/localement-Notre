const jwt = require('jsonwebtoken');

/**
 * Middleware d'authentification multi-niveaux
 * Vérifie les tokens JWT et détermine les permissions utilisateur
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const token = ctx.request.header.authorization?.replace('Bearer ', '');

    // Si pas de token, autoriser l'accès aux routes publiques
    if (!token) {
      // Routes publiques autorisées sans authentification
      const publicRoutes = [
        '/api/auth/local',
        '/api/auth/local/register', 
        '/api/subscription-plans',
        '/api/products',
        '/api/categories',
        '/marketplace/',
        '/admin',
        '/uploads'
      ];

      const isPublicRoute = publicRoutes.some(route => 
        ctx.request.url.startsWith(route)
      );

      if (isPublicRoute || ctx.request.method === 'GET') {
        return await next();
      } else {
        return ctx.unauthorized('Token manquant');
      }
    }

    try {
      // Vérifier le token JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET || strapi.config.get('plugin.users-permissions.jwtSecret'));
      
      // Récupérer l'utilisateur complet avec son rôle
      const user = await strapi.entityService.findOne('plugin::users-permissions.user', decoded.id, {
        populate: {
          role: true,
          merchant: true, // Si l'utilisateur est lié à un merchant
          customer: true  // Si l'utilisateur est lié à un customer
        }
      });

      if (!user) {
        return ctx.unauthorized('Utilisateur introuvable');
      }

      // Ajouter l'utilisateur au contexte
      ctx.state.user = user;

      // Définir les permissions selon le rôle
      const userRole = user.role?.type || 'public';
      ctx.state.userRole = userRole;

      // Vérifications de permissions selon les routes
      const url = ctx.request.url;
      const method = ctx.request.method;

      // Routes Super Admin uniquement
      if (url.includes('/platform/') && !url.includes('/platform/merchant/')) {
        if (userRole !== 'super-admin') {
          return ctx.forbidden('Accès réservé aux super administrateurs');
        }
      }

      // Routes Commercial + Super Admin
      if (url.includes('/commercial/') || url.includes('/onboard-merchant')) {
        if (!['super-admin', 'commercial'].includes(userRole)) {
          return ctx.forbidden('Accès réservé aux commerciaux et administrateurs');
        }
      }

      // Routes Merchant - vérifier l'appartenance
      if (url.includes('/merchant-backends') || url.includes('/subscriptions')) {
        if (userRole === 'merchant') {
          // Vérifier que le merchant ne peut accéder qu'à ses propres données
          const merchantId = ctx.request.params?.id;
          if (merchantId && user.merchant?.id !== parseInt(merchantId)) {
            return ctx.forbidden('Accès refusé à ces données');
          }
        } else if (!['super-admin', 'commercial'].includes(userRole)) {
          return ctx.forbidden('Accès réservé aux commerçants et administrateurs');
        }
      }

      // Routes Customer
      if (url.includes('/orders') || url.includes('/cart')) {
        if (userRole === 'customer') {
          // Vérifier que le customer ne peut accéder qu'à ses propres données
          const customerId = ctx.request.params?.id;
          if (customerId && user.customer?.id !== parseInt(customerId)) {
            return ctx.forbidden('Accès refusé à ces données');
          }
        }
      }

      // Log de l'accès pour audit
      if (userRole !== 'customer') {
        console.log(`[AUTH] ${userRole} ${user.email} - ${method} ${url}`);
      }

      await next();

    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      return ctx.unauthorized('Token invalide');
    }
  };
};
