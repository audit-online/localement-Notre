'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::merchant.merchant', ({ strapi }) => ({
  // Recherche de commerçants par ville ou type d'activité
  async findByLocation(ctx) {
    try {
      const { city, businessType, radius } = ctx.query;
      
      let filters = {};
      
      if (city) {
        filters.city = { $containsi: city };
      }
      
      if (businessType) {
        filters.businessType = businessType;
      }
      
      // Seulement les commerçants actifs
      filters.isActive = true;
      
      const merchants = await strapi.entityService.findMany('api::merchant.merchant', {
        filters,
        populate: {
          logo: true,
          images: true,
          products: {
            populate: {
              images: true,
              category: true
            }
          }
        }
      });
      
      ctx.body = {
        data: merchants,
        meta: {
          count: merchants.length
        }
      };
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  // Obtenir les produits d'un commerçant
  async getProducts(ctx) {
    try {
      const { id } = ctx.params;
      
      const merchant = await strapi.entityService.findOne('api::merchant.merchant', id, {
        populate: {
          products: {
            populate: {
              images: true,
              category: true
            },
            filters: {
              isActive: true
            }
          }
        }
      });
      
      if (!merchant) {
        return ctx.notFound('Merchant not found');
      }
      
      ctx.body = {
        data: merchant['products'] || []
      };
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  // Statistiques d'un commerçant
  async getStats(ctx) {
    try {
      const { id } = ctx.params;
      
      const merchant = await strapi.entityService.findOne('api::merchant.merchant', id);
      
      if (!merchant) {
        return ctx.notFound('Merchant not found');
      }
      
      // Compter les produits
      const productsCount = await strapi.entityService.count('api::product.product', {
        filters: {
          merchant: id,
          isActive: true
        }
      });
      
      // Compter les commandes
      const ordersCount = await strapi.entityService.count('api::order.order', {
        filters: {
          merchant: id
        }
      });
      
      ctx.body = {
        data: {
          merchant: merchant.name,
          productsCount,
          ordersCount,
          rating: merchant.rating || 0
        }
      };
    } catch (err) {
      ctx.throw(500, err);
    }
  }
}));
