'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/subscription-plans/active',
      handler: 'subscription-plan.findActive',
    },
    {
      method: 'POST',
      path: '/subscription-plans',
      handler: 'subscription-plan.create',
    },
    {
      method: 'GET',
      path: '/subscription-plans',
      handler: 'subscription-plan.find',
    },
    {
      method: 'GET',
      path: '/subscription-plans/:id',
      handler: 'subscription-plan.findOne',
    },
    {
      method: 'PUT',
      path: '/subscription-plans/:id',
      handler: 'subscription-plan.update',
    },
    {
      method: 'DELETE',
      path: '/subscription-plans/:id',
      handler: 'subscription-plan.delete',
    }
  ],
};
