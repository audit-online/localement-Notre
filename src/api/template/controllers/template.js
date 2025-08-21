'use strict';

/**
 * template controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::template.template', ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;
    
    // Configuration de la population par défaut
    const populateFields = {
      previewImage: true,
      screenshots: true,
      merchants: {
        fields: ['name', 'city', 'rating']
      }
    };

    try {
      const entity = await strapi.entityService.findMany('api::template.template', {
        ...query,
        populate: populateFields
      });

      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      console.error('Error in templates find:', error);
      return ctx.internalServerError('Error fetching templates');
    }
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    try {
      const entity = await strapi.entityService.findOne('api::template.template', id, {
        populate: {
          previewImage: true,
          screenshots: true,
          merchants: {
            fields: ['name', 'city', 'rating', 'website']
          }
        }
      });

      if (!entity) {
        return ctx.notFound('Template not found');
      }

      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      console.error('Error in template findOne:', error);
      return ctx.internalServerError('Error fetching template');
    }
  },

  // Endpoint pour télécharger un template
  async download(ctx) {
    const { id } = ctx.params;

    try {
      const template = await strapi.entityService.findOne('api::template.template', id);
      
      if (!template) {
        return ctx.notFound('Template not found');
      }

      // Incrémenter le compteur de téléchargements
      await strapi.entityService.update('api::template.template', id, {
        data: {
          downloadCount: (template.downloadCount || 0) + 1
        }
      });

      // Retourner les fichiers du template
      return ctx.send({
        success: true,
        data: {
          id: template.id,
          name: template.name,
          templateCode: template.templateCode,
          cssCode: template.cssCode,
          jsCode: template.jsCode,
          downloadUrl: template.downloadUrl
        }
      });
    } catch (error) {
      console.error('Error downloading template:', error);
      return ctx.internalServerError('Error downloading template');
    }
  },

  // Endpoint pour obtenir les templates par catégorie
  async findByCategory(ctx) {
    const { category } = ctx.params;

    try {
      const templates = await strapi.entityService.findMany('api::template.template', {
        filters: {
          category: { $eq: category },
          isActive: { $eq: true }
        },
        populate: {
          previewImage: true,
          merchants: {
            fields: ['name']
          }
        },
        sort: { sortOrder: 'asc', createdAt: 'desc' }
      });

      return ctx.send({
        success: true,
        data: templates,
        meta: {
          category,
          count: templates.length
        }
      });
    } catch (error) {
      console.error('Error fetching templates by category:', error);
      return ctx.internalServerError('Error fetching templates');
    }
  },

  // Endpoint pour les templates populaires
  async popular(ctx) {
    try {
      const templates = await strapi.entityService.findMany('api::template.template', {
        filters: {
          isActive: { $eq: true }
        },
        populate: {
          previewImage: true,
          merchants: true
        },
        sort: { downloadCount: 'desc', rating: 'desc' },
        limit: 12
      });

      return ctx.send({
        success: true,
        data: templates
      });
    } catch (error) {
      console.error('Error fetching popular templates:', error);
      return ctx.internalServerError('Error fetching popular templates');
    }
  },

  // Endpoint pour les templates mis en avant
  async featured(ctx) {
    try {
      const templates = await strapi.entityService.findMany('api::template.template', {
        filters: {
          isFeatured: { $eq: true },
          isActive: { $eq: true }
        },
        populate: {
          previewImage: true,
          screenshots: true
        },
        sort: { sortOrder: 'asc' }
      });

      return ctx.send({
        success: true,
        data: templates
      });
    } catch (error) {
      console.error('Error fetching featured templates:', error);
      return ctx.internalServerError('Error fetching featured templates');
    }
  },

  // Endpoint pour noter un template
  async rate(ctx) {
    const { id } = ctx.params;
    const { rating } = ctx.request.body;

    if (!rating || rating < 1 || rating > 5) {
      return ctx.badRequest('Rating must be between 1 and 5');
    }

    try {
      const template = await strapi.entityService.findOne('api::template.template', id);
      
      if (!template) {
        return ctx.notFound('Template not found');
      }

      // Calculer la nouvelle moyenne
      const currentRating = template.rating || 0;
      const currentCount = template.ratingCount || 0;
      const newCount = currentCount + 1;
      const newRating = ((currentRating * currentCount) + rating) / newCount;

      await strapi.entityService.update('api::template.template', id, {
        data: {
          rating: newRating,
          ratingCount: newCount
        }
      });

      return ctx.send({
        success: true,
        data: {
          rating: newRating,
          ratingCount: newCount
        }
      });
    } catch (error) {
      console.error('Error rating template:', error);
      return ctx.internalServerError('Error rating template');
    }
  },

  // Recherche de templates
  async search(ctx) {
    const { query } = ctx.query;
    const { category, framework, features, price } = ctx.query;

    try {
      let filters = {
        isActive: { $eq: true }
      };

      // Recherche textuelle
      if (query) {
        filters.$or = [
          { name: { $containsi: query } },
          { description: { $containsi: query } },
          { tags: { $containsi: query } }
        ];
      }

      // Filtres
      if (category) {
        filters.category = { $eq: category };
      }

      if (framework) {
        filters.framework = { $eq: framework };
      }

      if (price === 'free') {
        filters.isFree = { $eq: true };
      } else if (price === 'premium') {
        filters.isPremium = { $eq: true };
      }

      const templates = await strapi.entityService.findMany('api::template.template', {
        filters,
        populate: {
          previewImage: true,
          merchants: {
            fields: ['name']
          }
        },
        sort: { rating: 'desc', downloadCount: 'desc' }
      });

      return ctx.send({
        success: true,
        data: templates,
        meta: {
          count: templates.length,
          query: query || '',
          filters: { category, framework, features, price }
        }
      });
    } catch (error) {
      console.error('Error searching templates:', error);
      return ctx.internalServerError('Error searching templates');
    }
  }
}));
