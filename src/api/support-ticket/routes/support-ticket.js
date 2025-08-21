'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/support-tickets',
      handler: 'support-ticket.create',
    },
    {
      method: 'PUT',
      path: '/support-tickets/:id/assign',
      handler: 'support-ticket.assign',
    },
    {
      method: 'PUT',
      path: '/support-tickets/:id/status',
      handler: 'support-ticket.updateStatus',
    },
    {
      method: 'POST',
      path: '/support-tickets/:id/responses',
      handler: 'support-ticket.addResponse',
    },
    {
      method: 'GET',
      path: '/support-tickets/stats',
      handler: 'support-ticket.getStats',
    },
    {
      method: 'GET',
      path: '/support-tickets/merchant/:merchantId',
      handler: 'support-ticket.findByMerchant',
    },
    {
      method: 'GET',
      path: '/support-tickets',
      handler: 'support-ticket.find',
    },
    {
      method: 'GET',
      path: '/support-tickets/:id',
      handler: 'support-ticket.findOne',
    },
    {
      method: 'PUT',
      path: '/support-tickets/:id',
      handler: 'support-ticket.update',
    },
    {
      method: 'DELETE',
      path: '/support-tickets/:id',
      handler: 'support-ticket.delete',
    }
  ],
};
