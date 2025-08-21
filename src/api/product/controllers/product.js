'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::product.product', ({ strapi }) => ({
  // Trouver tous les produits avec population
  async find(ctx) {
    try {
      const products = await strapi.entityService.findMany('api::product.product', {
        ...ctx.query,
        populate: {
          images: true,
          merchant: {
            populate: {
              logo: true
            }
          },
          category: true
        }
      });

      ctx.body = { data: products };
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  // Trouver un produit avec population complète
  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      
      const product = await strapi.entityService.findOne('api::product.product', id, {
        populate: {
          images: true,
          merchant: {
            populate: {
              logo: true,
              images: true
            }
          },
          category: true
        }
      });

      if (!product) {
        return ctx.notFound('Product not found');
      }

      ctx.body = { data: product };
    } catch (err) {
      ctx.throw(500, err);
    }
  }
}));
