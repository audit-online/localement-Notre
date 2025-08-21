'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::merchant-backend.merchant-backend', ({ strapi }) => ({
  
  // Créer un backend pour un commerçant
  async create(ctx) {
    try {
      const { data } = ctx.request.body;
      const { merchantId, templateId, subdomain } = data;
      
      // Vérifier que le subdomain est disponible
      const existingBackend = await strapi.entityService.findMany('api::merchant-backend.merchant-backend', {
        filters: { subdomain }
      });
      
      if (existingBackend.length > 0) {
        return ctx.badRequest('Ce sous-domaine est déjà utilisé');
      }
      
      // Vérifier que le merchant existe et n'a pas déjà un backend
      const merchant = await strapi.entityService.findOne('api::merchant.merchant', merchantId, {
        populate: ['backend']
      });
      
      if (!merchant) {
        return ctx.badRequest('Commerçant introuvable');
      }
      
      if (merchant.backend) {
        return ctx.badRequest('Ce commerçant a déjà un backend');
      }
      
      // Créer le backend
      const backend = await strapi.entityService.create('api::merchant-backend.merchant-backend', {
        data: {
          merchant: merchantId,
          template: templateId,
          subdomain,
          status: 'deploying',
          apiEndpoint: `https://${subdomain}.marketplace.local/api`,
          adminUrl: `https://${subdomain}.marketplace.local/admin`,
          version: '1.0.0',
          publishedAt: new Date()
        },
        populate: ['merchant', 'template']
      });
      
      // Lancer le déploiement en arrière-plan
      this.deployBackend(backend.id);
      
      ctx.body = { data: backend };
      
    } catch (error) {
      console.error('Erreur création backend:', error);
      ctx.throw(500, 'Erreur lors de la création du backend');
    }
  },
  
  // Déployer un backend (simulation)
  async deployBackend(backendId) {
    try {
      // Simulation du processus de déploiement
      console.log(`🚀 Démarrage du déploiement pour le backend ${backendId}`);
      
      // Étape 1: Préparation
      await this.updateDeploymentStatus(backendId, 'deploying', 'Préparation de l\'environnement...');
      await this.sleep(2000);
      
      // Étape 2: Création de la base de données
      await this.updateDeploymentStatus(backendId, 'deploying', 'Création de la base de données...');
      await this.sleep(3000);
      
      // Étape 3: Déploiement de l\'application
      await this.updateDeploymentStatus(backendId, 'deploying', 'Déploiement de l\'application...');
      await this.sleep(5000);
      
      // Étape 4: Configuration
      await this.updateDeploymentStatus(backendId, 'deploying', 'Configuration finale...');
      await this.sleep(2000);
      
      // Finalisation
      await strapi.entityService.update('api::merchant-backend.merchant-backend', backendId, {
        data: {
          status: 'active',
          deploymentLogs: 'Déploiement terminé avec succès',
          lastHealthCheck: new Date(),
          healthStatus: 'healthy'
        }
      });
      
      console.log(`✅ Déploiement terminé pour le backend ${backendId}`);
      
    } catch (error) {
      console.error('Erreur déploiement:', error);
      await strapi.entityService.update('api::merchant-backend.merchant-backend', backendId, {
        data: {
          status: 'error',
          deploymentLogs: `Erreur: ${error.message}`
        }
      });
    }
  },
  
  async updateDeploymentStatus(backendId, status, logs) {
    await strapi.entityService.update('api::merchant-backend.merchant-backend', backendId, {
      data: {
        status,
        deploymentLogs: logs,
        lastHealthCheck: new Date()
      }
    });
  },
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  // Obtenir le statut de déploiement
  async getDeploymentStatus(ctx) {
    try {
      const { id } = ctx.params;
      
      const backend = await strapi.entityService.findOne('api::merchant-backend.merchant-backend', id, {
        populate: ['merchant']
      });
      
      if (!backend) {
        return ctx.notFound('Backend introuvable');
      }
      
      ctx.body = {
        data: {
          status: backend.status,
          logs: backend.deploymentLogs,
          lastHealthCheck: backend.lastHealthCheck,
          healthStatus: backend.healthStatus
        }
      };
      
    } catch (error) {
      ctx.throw(500, error.message);
    }
  },
  
  // Redémarrer un backend
  async restart(ctx) {
    try {
      const { id } = ctx.params;
      
      await strapi.entityService.update('api::merchant-backend.merchant-backend', id, {
        data: {
          status: 'maintenance',
          deploymentLogs: 'Redémarrage en cours...',
          lastHealthCheck: new Date()
        }
      });
      
      // Simuler le redémarrage
      setTimeout(async () => {
        await strapi.entityService.update('api::merchant-backend.merchant-backend', id, {
          data: {
            status: 'active',
            deploymentLogs: 'Redémarrage terminé',
            lastHealthCheck: new Date(),
            healthStatus: 'healthy'
          }
        });
      }, 10000);
      
      ctx.body = { message: 'Redémarrage initié' };
      
    } catch (error) {
      ctx.throw(500, error.message);
    }
  },
  
  // Obtenir les statistiques des backends
  async getStats(ctx) {
    try {
      const totalBackends = await strapi.entityService.count('api::merchant-backend.merchant-backend');
      const activeBackends = await strapi.entityService.count('api::merchant-backend.merchant-backend', {
        filters: { status: 'active' }
      });
      const deployingBackends = await strapi.entityService.count('api::merchant-backend.merchant-backend', {
        filters: { status: 'deploying' }
      });
      const errorBackends = await strapi.entityService.count('api::merchant-backend.merchant-backend', {
        filters: { status: 'error' }
      });
      
      // Calcul de l'utilisation du stockage
      const backends = await strapi.entityService.findMany('api::merchant-backend.merchant-backend', {
        fields: ['storageUsed']
      });
      
      const totalStorage = backends.reduce((sum, backend) => sum + (backend.storageUsed || 0), 0);
      
      ctx.body = {
        data: {
          total: totalBackends,
          active: activeBackends,
          deploying: deployingBackends,
          error: errorBackends,
          totalStorageGB: Math.round(totalStorage / (1024 * 1024 * 1024) * 100) / 100,
          successRate: totalBackends > 0 ? ((activeBackends / totalBackends) * 100).toFixed(2) : 0
        }
      };
      
    } catch (error) {
      ctx.throw(500, error.message);
    }
  }
  
}));
