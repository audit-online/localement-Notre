module.exports = {
  // Configuration du plugin Users & Permissions
  'users-permissions': {
    config: {
      // Configuration JWT
      jwt: {
        expiresIn: '7d',
      },
      // Configuration des rôles personnalisés
      roles: {
        // Role Super Admin
        'super-admin': {
          name: 'Super Admin',
          description: 'Accès complet à toute la plateforme',
          type: 'super-admin'
        },
        // Role Commercial 
        'commercial': {
          name: 'Commercial',
          description: 'Accès aux fonctionnalités de vente et onboarding',
          type: 'commercial'
        },
        // Role Merchant (Commerçant/Artisan)
        'merchant': {
          name: 'Merchant',
          description: 'Propriétaire d\'une boutique sur la marketplace',
          type: 'merchant'
        },
        // Role Customer (Client)
        'customer': {
          name: 'Customer', 
          description: 'Client de la marketplace',
          type: 'customer'
        }
      },
      // Configuration des providers d'authentification
      providers: {
        local: {
          enabled: true,
        },
        google: {
          enabled: false,
        },
        facebook: {
          enabled: false,
        },
        github: {
          enabled: false,
        }
      },
      // Configuration de la sécurité
      security: {
        rateLimit: {
          enabled: true,
          max: 5, // 5 tentatives
          window: 900000, // 15 minutes
        },
        passwordPolicy: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSymbols: false,
        }
      }
    }
  },

  // Configuration du plugin Email
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: process.env.SMTP_HOST || 'localhost',
        port: process.env.SMTP_PORT || 587,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      settings: {
        defaultFrom: process.env.SMTP_FROM || 'noreply@localement-votre.fr',
        defaultReplyTo: process.env.SMTP_REPLY_TO || 'support@localement-votre.fr',
      },
    },
  },

  // Configuration du plugin Upload
  upload: {
    config: {
      sizeLimit: 250 * 1024 * 1024, // 250mb
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64
      },
    },
  },

  // Configuration du plugin Transformer
  transformer: {
    enabled: true,
    config: {
      responseTransforms: {
        removeAttributesKey: true,
        removeDataKey: true,
      }
    }
  },

  // Configuration du plugin Populate Deep
  'populate-deep': {
    config: {
      defaultDepth: 5, // Profondeur par défaut
    }
  }
};
