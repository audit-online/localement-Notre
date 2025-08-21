'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  // Créer une commande sécurisée
  async create(ctx) {
    const user = ctx.state.user;
    const { 
      items, 
      customerName, 
      customerEmail, 
      customerPhone, 
      shippingMethod = 'pickup',
      shippingAddress,
      customerNotes 
    } = ctx.request.body;

    if (!items || items.length === 0) {
      return ctx.badRequest('Au moins un article requis');
    }

    if (!customerName || !customerEmail) {
      return ctx.badRequest('Nom et email client requis');
    }

    try {
      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerEmail)) {
        return ctx.badRequest('Format email invalide');
      }

      // Générer un numéro de commande unique et sécurisé
      const orderNumber = `LV${Date.now().toString().slice(-8)}${Math.random().toString(36).slice(-4).toUpperCase()}`;

      let subtotal = 0;
      const validatedItems = [];

      // Validation et calcul sécurisé des articles
      for (const item of items) {
        const product = await strapi.entityService.findOne('api::product.product', item.productId, {
          populate: ['merchant']
        });

        if (!product) {
          return ctx.badRequest(`Produit ${item.productId} non trouvé`);
        }

        if (!product.isActive) {
          return ctx.badRequest(`Produit ${product.name} non disponible`);
        }

        if (product.stock !== null && product.stock < item.quantity) {
          return ctx.badRequest(`Stock insuffisant pour ${product.name}`);
        }

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        validatedItems.push({
          product: product.id,
          quantity: item.quantity,
          unitPrice: product.price,
          totalPrice: itemTotal,
          productName: product.name // Pour référence
        });
      }

      // Calcul des frais de livraison sécurisé
      let shippingCost = 0;
      if (shippingMethod === 'delivery') {
        shippingCost = subtotal < (process.env.FREE_DELIVERY_THRESHOLD || 50) ? 5.90 : 0;
      }

      const total = subtotal + shippingCost;

      // Créer la commande
      const order = await strapi.entityService.create('api::order.order', {
        data: {
          orderNumber,
          user: user?.id || null,
          customerName,
          customerEmail,
          customerPhone,
          subtotal,
          shippingCost,
          total,
          status: 'pending',
          paymentStatus: 'pending',
          shippingMethod,
          shippingAddress: shippingAddress || null,
          customerNotes: customerNotes || null,
          merchant: validatedItems[0]?.product ? (await strapi.entityService.findOne('api::product.product', validatedItems[0].product, { populate: ['merchant'] }))?.merchant?.id : null
        }
      });

      // Créer les items de commande
      for (const item of validatedItems) {
        await strapi.entityService.create('api::order-item.order-item', {
          data: {
            order: order.id,
            product: item.product,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice
          }
        });
      }

      // Récupérer la commande complète
      const completeOrder = await strapi.entityService.findOne('api::order.order', order.id, {
        populate: {
          items: {
            populate: {
              product: {
                populate: ['images', 'merchant']
              }
            }
          },
          user: true,
          merchant: true
        }
      });

      // Log sécurisé
      strapi.log.info(`Commande créée: ${orderNumber}`, {
        orderId: order.id,
        customerEmail,
        total,
        itemsCount: validatedItems.length,
        userId: user?.id || 'guest'
      });

      return { data: completeOrder };

    } catch (error) {
      strapi.log.error('Erreur création commande:', error);
      return ctx.internalServerError('Erreur lors de la création de la commande');
    }
  },

  // Obtenir les commandes de l'utilisateur connecté
  async myOrders(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Utilisateur non connecté');
    }

    try {
      const orders = await strapi.entityService.findMany('api::order.order', {
        filters: { user: user.id },
        populate: {
          items: {
            populate: {
              product: {
                populate: ['images']
              }
            }
          },
          merchant: true
        },
        sort: { createdAt: 'desc' }
      });

      return { data: orders };

    } catch (error) {
      strapi.log.error('Erreur récupération commandes utilisateur:', error);
      return ctx.internalServerError('Erreur récupération commandes');
    }
  },

  // Obtenir une commande spécifique (sécurisé)
  async findOne(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;

    try {
      const order = await strapi.entityService.findOne('api::order.order', id, {
        populate: {
          items: {
            populate: {
              product: {
                populate: ['images', 'merchant']
              }
            }
          },
          user: true,
          merchant: true
        }
      });

      if (!order) {
        return ctx.notFound('Commande non trouvée');
      }

      // Vérifier les permissions
      if (user && order.user?.id !== user.id) {
        return ctx.forbidden('Accès non autorisé à cette commande');
      }

      return { data: order };

    } catch (error) {
      strapi.log.error('Erreur récupération commande:', error);
      return ctx.internalServerError('Erreur récupération commande');
    }
  },

  // Obtenir les commandes d'un commerçant
  async findByMerchant(ctx) {
    try {
      const { merchantId } = ctx.params;
      const { status, page = 1, pageSize = 25 } = ctx.query;
      
      let filters = {
        merchant: merchantId
      };
      
      if (status) {
        filters.status = status;
      }
      
      const orders = await strapi.entityService.findMany('api::order.order', {
        filters,
        populate: {
          orderItems: {
            populate: {
              product: true
            }
          }
        },
        pagination: {
          page: parseInt(String(page)),
          pageSize: parseInt(String(pageSize))
        },
        sort: { createdAt: 'desc' }
      });
      
      ctx.body = { data: orders };
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  // Mettre à jour le statut d'une commande
  async updateStatus(ctx) {
    try {
      const { id } = ctx.params;
      const { status } = ctx.request.body;
      
      const order = await strapi.entityService.update('api::order.order', id, {
        data: { status }
      });
      
      ctx.body = { data: order };
    } catch (err) {
      ctx.throw(500, err);
    }
  }
}));
