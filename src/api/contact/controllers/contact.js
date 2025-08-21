'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::contact.contact', ({ strapi }) => ({
  // Créer un message de contact avec notification email
  async create(ctx) {
    const { name, email, phone, subject, message, type, merchantId } = ctx.request.body;

    if (!name || !email || !subject || !message) {
      return ctx.badRequest('Nom, email, sujet et message sont requis');
    }

    // Créer le contact
    const contact = await strapi.entityService.create('api::contact.contact', {
      data: {
        name,
        email,
        phone,
        subject,
        message,
        type: type || 'general',
        status: 'new',
        priority: 'medium',
        merchant: merchantId || null,
        user: ctx.state.user?.id || null
      },
      populate: ['merchant']
    });

    // Envoyer une notification email (si le plugin email est configuré)
    try {
      await strapi.plugins['email'].services.email.send({
        to: 'admin@localement-votre.fr',
        from: 'noreply@localement-votre.fr',
        subject: `Nouveau contact: ${subject}`,
        html: `
          <h2>Nouveau message de contact</h2>
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Téléphone:</strong> ${phone || 'Non renseigné'}</p>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Sujet:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          ${contact.merchant ? `<p><strong>Commerçant:</strong> ${contact.merchant.name}</p>` : ''}
        `
      });

      // Email de confirmation au client
      await strapi.plugins['email'].services.email.send({
        to: email,
        from: 'noreply@localement-votre.fr',
        subject: 'Confirmation de réception de votre message',
        html: `
          <h2>Merci pour votre message !</h2>
          <p>Bonjour ${name},</p>
          <p>Nous avons bien reçu votre message concernant "${subject}".</p>
          <p>Nous vous répondrons dans les plus brefs délais.</p>
          <p>Cordialement,<br>L'équipe Localement Vôtre</p>
        `
      });
    } catch (error) {
      console.log('Erreur envoi email:', error);
      // Ne pas faire échouer la création du contact si l'email échoue
    }

    return { data: contact };
  },

  // Répondre à un contact
  async respond(ctx) {
    const { id } = ctx.params;
    const { response } = ctx.request.body;

    if (!response) {
      return ctx.badRequest('Réponse requise');
    }

    const contact = await strapi.entityService.findOne('api::contact.contact', id);
    if (!contact) {
      return ctx.notFound('Contact non trouvé');
    }

    const updatedContact = await strapi.entityService.update('api::contact.contact', id, {
      data: {
        response,
        responseDate: new Date(),
        status: 'resolved'
      }
    });

    // Envoyer la réponse par email
    try {
      await strapi.plugins['email'].services.email.send({
        to: contact.email,
        from: 'noreply@localement-votre.fr',
        subject: `Réponse à votre message: ${contact.subject}`,
        html: `
          <h2>Réponse à votre message</h2>
          <p>Bonjour ${contact.name},</p>
          <p>Voici notre réponse concernant votre message "${contact.subject}":</p>
          <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #007bff;">
            ${response}
          </div>
          <p>Cordialement,<br>L'équipe Localement Vôtre</p>
        `
      });
    } catch (error) {
      console.log('Erreur envoi email de réponse:', error);
    }

    return { data: updatedContact };
  },

  // Changer le statut d'un contact
  async updateStatus(ctx) {
    const { id } = ctx.params;
    const { status, priority } = ctx.request.body;

    const updatedContact = await strapi.entityService.update('api::contact.contact', id, {
      data: {
        status: status || undefined,
        priority: priority || undefined
      }
    });

    return { data: updatedContact };
  },

  // Obtenir les contacts d'un utilisateur
  async myContacts(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Utilisateur non connecté');
    }

    const contacts = await strapi.entityService.findMany('api::contact.contact', {
      filters: { user: user.id },
      populate: ['merchant'],
      sort: { createdAt: 'desc' }
    });

    return { data: contacts };
  }
}));
