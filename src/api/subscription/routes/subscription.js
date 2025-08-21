'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/subscriptions',
      handler: 'subscription.create',
    },
    {
      method: 'PUT',
      path: '/subscriptions/:id/cancel',
      handler: 'subscription.cancel',
    },
    {
      method: 'GET',
      path: '/subscriptions/stats',
      handler: 'subscription.getStats',
    },
    {
      method: 'GET',
      path: '/subscriptions',
      handler: 'subscription.find',
    },
    {
      method: 'GET',
      path: '/subscriptions/:id',
      handler: 'subscription.findOne',
    },
    {
      method: 'PUT',
      path: '/subscriptions/:id',
      handler: 'subscription.update',
    },
    {
      method: 'DELETE',
      path: '/subscriptions/:id',
      handler: 'subscription.delete',
    }
  ],
};
