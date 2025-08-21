'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/merchant-backends',
      handler: 'merchant-backend.create',
    },
    {
      method: 'GET',
      path: '/merchant-backends/:id/deployment-status',
      handler: 'merchant-backend.getDeploymentStatus',
    },
    {
      method: 'POST',
      path: '/merchant-backends/:id/restart',
      handler: 'merchant-backend.restart',
    },
    {
      method: 'GET',
      path: '/merchant-backends/stats',
      handler: 'merchant-backend.getStats',
    },
    {
      method: 'GET',
      path: '/merchant-backends',
      handler: 'merchant-backend.find',
    },
    {
      method: 'GET',
      path: '/merchant-backends/:id',
      handler: 'merchant-backend.findOne',
    },
    {
      method: 'PUT',
      path: '/merchant-backends/:id',
      handler: 'merchant-backend.update',
    },
    {
      method: 'DELETE',
      path: '/merchant-backends/:id',
      handler: 'merchant-backend.delete',
    }
  ],
};
