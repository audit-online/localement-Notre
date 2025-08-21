const bcrypt = require('bcryptjs');

async function main() {
  console.log('🚀 Initialisation du système d\'authentification...');
  
  const Strapi = require('@strapi/strapi');
  
  try {
    console.log('🔄 Démarrage de Strapi...');
    
    const appContext = await Strapi().load();
    const app = appContext.strapi || appContext;
    
    console.log('✅ Strapi démarré avec succès');
    
    // Créer les rôles par défaut
    console.log('📋 Création des rôles par défaut...');
    
    const defaultRoles = [
      { name: 'Super Admin', description: 'Accès complet à toute la plateforme', type: 'super-admin' },
      { name: 'Commercial', description: 'Accès aux fonctionnalités de vente', type: 'commercial' },
      { name: 'Merchant', description: 'Propriétaire d\'une boutique', type: 'merchant' },
      { name: 'Customer', description: 'Client de la marketplace', type: 'customer' }
    ];

    for (const roleData of defaultRoles) {
      const existingRole = await app.query('plugin::users-permissions.role').findOne({
        where: { type: roleData.type }
      });

      if (!existingRole) {
        await app.query('plugin::users-permissions.role').create({
          data: roleData
        });
        console.log(`✅ Rôle créé: ${roleData.name}`);
      } else {
        console.log(`ℹ️  Rôle existant: ${roleData.name}`);
      }
    }
    
    // Créer les utilisateurs par défaut
    console.log('👥 Création des utilisateurs par défaut...');
    
    const defaultUsers = [
      {
        username: 'superadmin',
        email: 'admin@localement-votre.fr',
        password: 'Admin123!',
        firstName: 'Super',
        lastName: 'Admin',
        roleType: 'super-admin'
      },
      {
        username: 'commercial1',
        email: 'commercial@localement-votre.fr',
        password: 'Commercial123!',
        firstName: 'Jean',
        lastName: 'Commercial',
        roleType: 'commercial'
      },
      {
        username: 'testmerchant',
        email: 'merchant@test.fr',
        password: 'Merchant123!',
        firstName: 'Marie',
        lastName: 'Dupont',
        roleType: 'merchant'
      },
      {
        username: 'testcustomer',
        email: 'customer@test.fr',
        password: 'Customer123!',
        firstName: 'Pierre',
        lastName: 'Martin',
        roleType: 'customer'
      }
    ];

    for (const userData of defaultUsers) {
      const existingUser = await app.query('plugin::users-permissions.user').findOne({
        where: { email: userData.email }
      });

      if (!existingUser) {
        const role = await app.query('plugin::users-permissions.role').findOne({
          where: { type: userData.roleType }
        });

        if (role) {
          const hashedPassword = await bcrypt.hash(userData.password, 12);

          await app.query('plugin::users-permissions.user').create({
            data: {
              username: userData.username,
              email: userData.email,
              password: hashedPassword,
              firstName: userData.firstName,
              lastName: userData.lastName,
              confirmed: true,
              blocked: false,
              role: role.id,
              provider: 'local'
            }
          });

          console.log(`✅ Utilisateur créé: ${userData.email} (${userData.roleType})`);
        } else {
          console.error(`❌ Rôle ${userData.roleType} introuvable`);
        }
      } else {
        console.log(`ℹ️  Utilisateur existant: ${userData.email}`);
      }
    }
    
    console.log('✅ Système d\'authentification initialisé avec succès !');
    console.log('📋 Identifiants de test:');
    console.log('   🔑 Super Admin: admin@localement-votre.fr / Admin123!');
    console.log('   🔑 Commercial: commercial@localement-votre.fr / Commercial123!');
    console.log('   🔑 Commerçant: merchant@test.fr / Merchant123!');
    console.log('   🔑 Client: customer@test.fr / Customer123!');
    console.log('🎉 Initialisation terminée !');
    
    await app.destroy();
    
  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}