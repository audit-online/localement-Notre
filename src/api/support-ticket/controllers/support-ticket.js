'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::support-ticket.support-ticket', ({ strapi }) => ({
  
  // Créer un nouveau ticket
  async create(ctx) {
    try {
      const { data } = ctx.request.body;
      
      // Générer un numéro de ticket unique
      const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      
      const ticket = await strapi.entityService.create('api::support-ticket.support-ticket', {
        data: {
          ...data,
          ticketNumber,
          lastActivityAt: new Date(),
          publishedAt: new Date()
        },
        populate: ['merchant', 'assignedTo', 'attachments']
      });
      
      // Envoyer une notification email (à implémenter)
      // await this.sendTicketNotification(ticket);
      
      ctx.body = { data: ticket };
      
    } catch (error) {
      console.error('Erreur création ticket:', error);
      ctx.throw(500, 'Erreur lors de la création du ticket');
    }
  },
  
  // Assigner un ticket à un agent
  async assign(ctx) {
    try {
      const { id } = ctx.params;
      const { assignedTo } = ctx.request.body;
      
      const ticket = await strapi.entityService.update('api::support-ticket.support-ticket', id, {
        data: {
          assignedTo,
          status: 'in_progress',
          lastActivityAt: new Date()
        },
        populate: ['merchant', 'assignedTo']
      });
      
      ctx.body = { data: ticket };
      
    } catch (error) {
      ctx.throw(500, error.message);
    }
  },
  
  // Changer le statut d'un ticket
  async updateStatus(ctx) {
    try {
      const { id } = ctx.params;
      const { status } = ctx.request.body;
      
      let updateData = {
        status,
        lastActivityAt: new Date()
      };
      
      // Si le ticket est résolu, enregistrer la date
      if (status === 'resolved') {
        updateData.resolvedAt = new Date();
      }
      
      const ticket = await strapi.entityService.update('api::support-ticket.support-ticket', id, {
        data: updateData,
        populate: ['merchant', 'assignedTo', 'responses']
      });
      
      ctx.body = { data: ticket };
      
    } catch (error) {
      ctx.throw(500, error.message);
    }
  },
  
  // Ajouter une réponse à un ticket
  async addResponse(ctx) {
    try {
      const { id } = ctx.params;
      const { message, isInternal, timeSpent } = ctx.request.body;
      
      // Vérifier que le ticket existe
      const ticket = await strapi.entityService.findOne('api::support-ticket.support-ticket', id);
      if (!ticket) {
        return ctx.notFound('Ticket introuvable');
      }
      
      // Créer la réponse
      const response = await strapi.entityService.create('api::ticket-response.ticket-response', {
        data: {
          ticket: id,
          message,
          author: ctx.state.user.id, // Admin user
          isInternal: isInternal || false,
          timeSpent: timeSpent || 0
        },
        populate: ['author', 'attachments']
      });
      
      // Mettre à jour le ticket
      let updateData = {
        lastActivityAt: new Date()
      };
      
      // Si c'est la première réponse, enregistrer la date
      if (!ticket.firstResponseAt) {
        updateData.firstResponseAt = new Date();
      }
      
      await strapi.entityService.update('api::support-ticket.support-ticket', id, {
        data: updateData
      });
      
      ctx.body = { data: response };
      
    } catch (error) {
      console.error('Erreur ajout réponse:', error);
      ctx.throw(500, 'Erreur lors de l\'ajout de la réponse');
    }
  },
  
  // Obtenir les statistiques des tickets
  async getStats(ctx) {
    try {
      const totalTickets = await strapi.entityService.count('api::support-ticket.support-ticket');
      const openTickets = await strapi.entityService.count('api::support-ticket.support-ticket', {
        filters: { status: { $in: ['open', 'in_progress'] } }
      });
      const resolvedTickets = await strapi.entityService.count('api::support-ticket.support-ticket', {
        filters: { status: 'resolved' }
      });
      const urgentTickets = await strapi.entityService.count('api::support-ticket.support-ticket', {
        filters: { priority: 'urgent', status: { $ne: 'closed' } }
      });
      
      // Temps de réponse moyen (à calculer)
      const ticketsWithResponse = await strapi.entityService.findMany('api::support-ticket.support-ticket', {
        filters: {
          firstResponseAt: { $notNull: true }
        },
        fields: ['createdAt', 'firstResponseAt']
      });
      
      let avgResponseTime = 0;
      if (ticketsWithResponse.length > 0) {
        const totalResponseTime = ticketsWithResponse.reduce((sum, ticket) => {
          const responseTime = new Date(ticket.firstResponseAt) - new Date(ticket.createdAt);
          return sum + responseTime;
        }, 0);
        avgResponseTime = Math.round(totalResponseTime / ticketsWithResponse.length / (1000 * 60 * 60)); // en heures
      }
      
      ctx.body = {
        data: {
          total: totalTickets,
          open: openTickets,
          resolved: resolvedTickets,
          urgent: urgentTickets,
          avgResponseTimeHours: avgResponseTime,
          resolutionRate: totalTickets > 0 ? ((resolvedTickets / totalTickets) * 100).toFixed(2) : 0
        }
      };
      
    } catch (error) {
      console.error('Erreur stats tickets:', error);
      ctx.throw(500, error.message);
    }
  },
  
  // Obtenir les tickets par merchant
  async findByMerchant(ctx) {
    try {
      const { merchantId } = ctx.params;
      
      const tickets = await strapi.entityService.findMany('api::support-ticket.support-ticket', {
        filters: { merchant: merchantId },
        sort: { createdAt: 'desc' },
        populate: ['assignedTo', 'responses', 'attachments']
      });
      
      ctx.body = { data: tickets };
      
    } catch (error) {
      ctx.throw(500, error.message);
    }
  }
  
}));
