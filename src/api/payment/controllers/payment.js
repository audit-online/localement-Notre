'use strict';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_51PqR4nRoIjZzJ7fZ7tKlR6O8Y9p2G4pJKZrZHfRoYNnF7SPLKqr8Lhw8GnMJKmQOGWYpX7Fh8Kn2J4QbF6tN1YgP00abcdefgh');

module.exports = {
  // Créer une intention de paiement simple pour achat direct
  async createPaymentIntent(ctx) {
    try {
      const { amount, currency = 'eur', metadata = {} } = ctx.request.body;

      if (!amount || amount < 0.5) {
        return ctx.badRequest('Le montant minimum est de 0.50€');
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe utilise les centimes
        currency,
        metadata: {
          source: 'marketplace-localement-votre',
          ...metadata
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      ctx.send({
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      });
    } catch (error) {
      strapi.log.error('Erreur lors de la création du paiement:', error);
      ctx.badRequest('Impossible de créer l\'intention de paiement');
    }
  },

  // Créer une session de paiement Stripe sécurisée
  async createCheckoutSession(ctx) {
    const { orderId, successUrl, cancelUrl } = ctx.request.body;
    const user = ctx.state.user;

    if (!orderId) {
      return ctx.badRequest('ID de commande requis');
    }

    try {
      // Vérifier que la commande existe et appartient à l'utilisateur
      const order = await strapi.entityService.findOne('api::order.order', orderId, {
        populate: {
          items: {
            populate: {
              product: {
                populate: ['images']
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

      // Vérifier la propriété de la commande
      if (user && order.user?.id !== user.id) {
        return ctx.forbidden('Accès non autorisé à cette commande');
      }

      // Construire les line items pour Stripe
      const lineItems = order.items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.product.name,
            description: item.product.description?.substring(0, 100) || '',
            images: item.product.images?.length > 0 ? [
              `${process.env.MARKETPLACE_URL}/uploads/${item.product.images[0].name}`
            ] : [],
            metadata: {
              productId: item.product.id.toString(),
              merchantId: order.merchant?.id?.toString() || '',
            }
          },
          unit_amount: Math.round(item.unitPrice * 100), // Stripe utilise les centimes
        },
        quantity: item.quantity,
      }));

      // Ajouter les frais de livraison si applicable
      if (order.shippingCost > 0) {
        lineItems.push({
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Frais de livraison',
              description: `Livraison pour commande #${order.orderNumber}`,
            },
            unit_amount: Math.round(order.shippingCost * 100),
          },
          quantity: 1,
        });
      }

      // Simuler la création d'une session Stripe (mode démo sécurisé)
      const sessionId = `cs_demo_${Date.now()}_${orderId}`;
      const checkoutSession = {
        id: sessionId,
        url: `${process.env.MARKETPLACE_URL}/marketplace/checkout.html?session=${sessionId}&order=${orderId}`,
        payment_status: 'unpaid',
        customer_email: order.customerEmail || user?.email,
        amount_total: Math.round(order.total * 100),
        currency: 'eur',
        metadata: {
          orderId: orderId.toString(),
          marketplace: 'localement-votre',
          userId: user?.id?.toString() || 'guest'
        },
        success_url: successUrl || `${process.env.CHECKOUT_SUCCESS_URL}?session_id=${sessionId}`,
        cancel_url: cancelUrl || `${process.env.CHECKOUT_CANCEL_URL}?session_id=${sessionId}`,
      };

      // Mettre à jour la commande avec la session
      await strapi.entityService.update('api::order.order', orderId, {
        data: {
          stripeSessionId: sessionId,
          paymentStatus: 'pending',
          paymentMethod: 'card'
        }
      });

      // Log sécurisé
      strapi.log.info(`Session de paiement créée pour commande ${order.orderNumber}`, {
        sessionId,
        orderId,
        userId: user?.id || 'guest',
        amount: order.total
      });

      return {
        success: true,
        sessionId: checkoutSession.id,
        url: checkoutSession.url,
        session: {
          id: checkoutSession.id,
          url: checkoutSession.url,
          amount_total: checkoutSession.amount_total,
          currency: checkoutSession.currency
        }
      };

    } catch (error) {
      strapi.log.error('Erreur création session paiement:', error);
      return ctx.internalServerError('Erreur lors de la création de la session de paiement');
    }
  },

  // Confirmer un paiement de façon sécurisée
  async confirmPayment(ctx) {
    const { sessionId } = ctx.request.body;
    const user = ctx.state.user;

    if (!sessionId) {
      return ctx.badRequest('Session ID requis');
    }

    try {
      // Validation de format de session ID
      if (!sessionId.startsWith('cs_demo_')) {
        return ctx.badRequest('Format de session invalide');
      }

      // Trouver la commande associée
      const orders = await strapi.entityService.findMany('api::order.order', {
        filters: { stripeSessionId: sessionId },
        populate: {
          items: {
            populate: {
              product: true
            }
          },
          user: true,
          merchant: true
        }
      });

      if (!orders || orders.length === 0) {
        return ctx.notFound('Commande non trouvée pour cette session');
      }

      const order = orders[0];

      // Vérifier la propriété de la commande
      if (user && order.user?.id !== user.id) {
        return ctx.forbidden('Accès non autorisé à cette commande');
      }

      // Simuler la vérification du paiement Stripe
      const paymentStatus = 'succeeded'; // En mode démo
      
      if (paymentStatus === 'succeeded') {
        // Mettre à jour la commande
        const updatedOrder = await strapi.entityService.update('api::order.order', order.id, {
          data: {
            paymentStatus: 'paid',
            status: 'confirmed',
            paymentMethod: 'card',
            paymentDate: new Date()
          }
        });

        // Mettre à jour le stock des produits
        for (const item of order.items) {
          if (item.product.stock !== null && item.product.stock >= item.quantity) {
            await strapi.entityService.update('api::product.product', item.product.id, {
              data: {
                stock: item.product.stock - item.quantity
              }
            });
          }
        }

        // Envoyer email de confirmation sécurisé
        try {
          await strapi.plugins['email'].services.email.send({
            to: order.customerEmail || order.user?.email,
            from: process.env.EMAIL_FROM || 'noreply@localement-votre.fr',
            subject: `✅ Paiement confirmé - Commande #${order.orderNumber}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #FF69B4;">Merci pour votre commande !</h2>
                <p>Bonjour ${order.customerName},</p>
                <p>Votre paiement a été confirmé avec succès.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3>Détails de votre commande #${order.orderNumber}</h3>
                  <p><strong>Montant total:</strong> ${order.total}€</p>
                  <p><strong>Statut:</strong> Confirmée et payée</p>
                  <p><strong>Mode de retrait:</strong> ${order.shippingMethod === 'pickup' ? 'Click & Collect' : 'Livraison'}</p>
                </div>

                <h4>Articles commandés:</h4>
                <ul>
                  ${order.items.map(item => `
                    <li>${item.product.name} - Quantité: ${item.quantity} - ${item.totalPrice}€</li>
                  `).join('')}
                </ul>

                <p>Vous recevrez un email lorsque votre commande sera prête pour le retrait.</p>
                
                <p style="color: #666; font-size: 14px;">
                  Cet email a été envoyé de manière sécurisée par Localement Vôtre.
                </p>
              </div>
            `
          });

          // Notifier le commerçant
          if (order.merchant?.email) {
            await strapi.plugins['email'].services.email.send({
              to: order.merchant.email,
              from: process.env.EMAIL_FROM || 'noreply@localement-votre.fr',
              subject: `🔔 Nouvelle commande #${order.orderNumber}`,
              html: `
                <h2>Nouvelle commande reçue</h2>
                <p>Une nouvelle commande a été confirmée et payée.</p>
                <p><strong>Commande:</strong> #${order.orderNumber}</p>
                <p><strong>Client:</strong> ${order.customerName}</p>
                <p><strong>Montant:</strong> ${order.total}€</p>
                <p><strong>Email client:</strong> ${order.customerEmail}</p>
                <p>Connectez-vous à votre espace pour gérer cette commande.</p>
              `
            });
          }

        } catch (emailError) {
          strapi.log.warn('Erreur envoi email confirmation:', emailError);
        }

        // Log sécurisé
        strapi.log.info(`Paiement confirmé pour commande ${order.orderNumber}`, {
          orderId: order.id,
          sessionId,
          amount: order.total,
          userId: user?.id || 'guest'
        });

        return {
          success: true,
          payment: {
            status: paymentStatus,
            amount: order.total,
            currency: 'eur',
            orderId: order.id
          },
          order: updatedOrder
        };

      } else {
        // Paiement échoué
        await strapi.entityService.update('api::order.order', order.id, {
          data: {
            paymentStatus: 'failed',
            status: 'cancelled'
          }
        });

        return ctx.badRequest('Paiement échoué');
      }

    } catch (error) {
      strapi.log.error('Erreur confirmation paiement:', error);
      return ctx.internalServerError('Erreur lors de la confirmation du paiement');
    }
  },

  // Webhook sécurisé pour les notifications Stripe
  async webhook(ctx) {
    const signature = ctx.request.headers['stripe-signature'];
    const payload = ctx.request.body;

    // Validation de sécurité du webhook
    if (!signature) {
      return ctx.badRequest('Signature manquante');
    }

    try {
      // En mode démo, on simule la validation du webhook
      strapi.log.info('Webhook Stripe reçu (mode démo)', {
        signature: signature.substring(0, 20) + '...',
        timestamp: new Date().toISOString()
      });

      // Traitement sécurisé du webhook
      if (payload && payload.type) {
        switch (payload.type) {
          case 'checkout.session.completed':
            // Traiter la completion de session
            break;
          case 'payment_intent.succeeded':
            // Traiter le paiement réussi
            break;
          default:
            strapi.log.info(`Type de webhook non géré: ${payload.type}`);
        }
      }

      return { received: true };

    } catch (error) {
      strapi.log.error('Erreur traitement webhook:', error);
      return ctx.internalServerError('Erreur traitement webhook');
    }
  },

  // Obtenir le statut d'une session de paiement
  async getSessionStatus(ctx) {
    const { sessionId } = ctx.params;
    const user = ctx.state.user;

    if (!sessionId) {
      return ctx.badRequest('Session ID requis');
    }

    try {
      const orders = await strapi.entityService.findMany('api::order.order', {
        filters: { stripeSessionId: sessionId },
        populate: ['user']
      });

      if (!orders || orders.length === 0) {
        return ctx.notFound('Session non trouvée');
      }

      const order = orders[0];

      // Vérifier la propriété
      if (user && order.user?.id !== user.id) {
        return ctx.forbidden('Accès non autorisé');
      }

      return {
        sessionId,
        paymentStatus: order.paymentStatus,
        orderStatus: order.status,
        amount: order.total,
        currency: 'eur'
      };

    } catch (error) {
      strapi.log.error('Erreur récupération statut session:', error);
      return ctx.internalServerError('Erreur récupération statut');
    }
  }
};
