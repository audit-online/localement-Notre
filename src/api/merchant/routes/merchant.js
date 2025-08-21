'use strict';

module.exports = {
  routes: [
    // Routes par défaut
    {
      method: 'GET',
      path: '/merchants',
      handler: 'merchant.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/merchants/:id',
      handler: 'merchant.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/merchants',
      handler: 'merchant.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/merchants/:id',
      handler: 'merchant.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/merchants/:id',
      handler: 'merchant.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    // Routes personnalisées
    {
      method: 'GET',
      path: '/merchants/search/location',
      handler: 'merchant.findByLocation',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/merchants/:id/products',
      handler: 'merchant.getProducts',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/merchants/:id/stats',
      handler: 'merchant.getStats',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
