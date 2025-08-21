'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::cart.cart', ({ strapi }) => ({
  // Obtenir le panier de l'utilisateur connecté
  async me(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Utilisateur non connecté');
    }

    let cart = await strapi.entityService.findMany('api::cart.cart', {
      filters: { user: user.id, status: 'active' },
      populate: {
        items: {
          populate: {
            product: {
              populate: ['images']
            }
          }
        }
      }
    });

    if (!cart || cart.length === 0) {
      // Créer un nouveau panier
      cart = await strapi.entityService.create('api::cart.cart', {
        data: {
          user: user.id,
          status: 'active',
          total: 0,
          lastActivity: new Date()
        },
        populate: {
          items: {
            populate: {
              product: {
                populate: ['images']
              }
            }
          }
        }
      });
    } else {
      cart = cart[0];
    }

    return { data: cart };
  },

  // Ajouter un produit au panier
  async addItem(ctx) {
    const user = ctx.state.user;
    const { productId, quantity = 1 } = ctx.request.body;

    if (!user) {
      return ctx.unauthorized('Utilisateur non connecté');
    }

    if (!productId) {
      return ctx.badRequest('Product ID requis');
    }

    // Récupérer le produit
    const product = await strapi.entityService.findOne('api::product.product', productId);
    if (!product) {
      return ctx.notFound('Produit non trouvé');
    }

    // Vérifier le stock
    if (product.stock < quantity) {
      return ctx.badRequest('Stock insuffisant');
    }

    // Récupérer ou créer le panier
    let cart = await strapi.entityService.findMany('api::cart.cart', {
      filters: { user: user.id, status: 'active' }
    });

    if (!cart || cart.length === 0) {
      cart = await strapi.entityService.create('api::cart.cart', {
        data: {
          user: user.id,
          status: 'active',
          total: 0,
          lastActivity: new Date()
        }
      });
    } else {
      cart = cart[0];
    }

    // Vérifier si l'item existe déjà
    const existingItem = await strapi.entityService.findMany('api::cart-item.cart-item', {
      filters: { cart: cart.id, product: productId }
    });

    let cartItem;
    if (existingItem && existingItem.length > 0) {
      // Mettre à jour la quantité
      const newQuantity = existingItem[0].quantity + quantity;
      cartItem = await strapi.entityService.update('api::cart-item.cart-item', existingItem[0].id, {
        data: {
          quantity: newQuantity,
          totalPrice: product.price * newQuantity
        }
      });
    } else {
      // Créer un nouvel item
      cartItem = await strapi.entityService.create('api::cart-item.cart-item', {
        data: {
          cart: cart.id,
          product: productId,
          quantity,
          unitPrice: product.price,
          totalPrice: product.price * quantity
        }
      });
    }

    // Recalculer le total du panier
    await this.updateCartTotal(cart.id);

    return { data: cartItem };
  },

  // Mettre à jour la quantité d'un item
  async updateItem(ctx) {
    const user = ctx.state.user;
    const { id } = ctx.params;
    const { quantity } = ctx.request.body;

    if (!user) {
      return ctx.unauthorized('Utilisateur non connecté');
    }

    const cartItem = await strapi.entityService.findOne('api::cart-item.cart-item', id, {
      populate: ['cart', 'product']
    });

    if (!cartItem || cartItem.cart.user !== user.id) {
      return ctx.notFound('Item non trouvé');
    }

    if (quantity <= 0) {
      // Supprimer l'item
      await strapi.entityService.delete('api::cart-item.cart-item', id);
    } else {
      // Mettre à jour l'item
      await strapi.entityService.update('api::cart-item.cart-item', id, {
        data: {
          quantity,
          totalPrice: cartItem.product.price * quantity
        }
      });
    }

    // Recalculer le total du panier
    await this.updateCartTotal(cartItem.cart.id);

    return { success: true };
  },

  // Vider le panier
  async clear(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Utilisateur non connecté');
    }

    const cart = await strapi.entityService.findMany('api::cart.cart', {
      filters: { user: user.id, status: 'active' }
    });

    if (cart && cart.length > 0) {
      // Supprimer tous les items
      await strapi.entityService.deleteMany('api::cart-item.cart-item', {
        filters: { cart: cart[0].id }
      });

      // Mettre à jour le total
      await strapi.entityService.update('api::cart.cart', cart[0].id, {
        data: { total: 0 }
      });
    }

    return { success: true };
  },

  // Méthode utilitaire pour recalculer le total du panier
  async updateCartTotal(cartId) {
    const items = await strapi.entityService.findMany('api::cart-item.cart-item', {
      filters: { cart: cartId }
    });

    const total = items.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0);

    await strapi.entityService.update('api::cart.cart', cartId, {
      data: { 
        total,
        lastActivity: new Date()
      }
    });

    return total;
  }
}));
