'use strict';

/**
 * template router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::template.template');

const customRoutes = {
  routes: [
    {
      method: 'GET',
      path: '/templates',
      handler: 'template.find',
      config: {
        auth: false, // Pas d'authentification requise
      },
    },
    {
      method: 'GET',
      path: '/templates/:id',
      handler: 'template.findOne',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/templates',
      handler: 'template.create',
      config: {
        auth: false, // Permettre la création sans authentification
      },
    },
    {
      method: 'PUT',
      path: '/templates/:id',
      handler: 'template.update',
      config: {
        auth: false,
      },
    },
    {
      method: 'DELETE',
      path: '/templates/:id',
      handler: 'template.delete',
      config: {
        auth: false,
      },
    },
  ],
};

module.exports = customRoutes;
