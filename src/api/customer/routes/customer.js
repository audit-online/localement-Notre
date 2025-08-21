module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/customer/me',
      handler: 'customer.me',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/customer/profile',
      handler: 'customer.updateProfile',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/customer/orders',
      handler: 'customer.orders',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/customer/loyalty-points',
      handler: 'customer.addLoyaltyPoints',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    // Routes standards
    {
      method: 'GET',
      path: '/customers',
      handler: 'customer.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/customers/:id',
      handler: 'customer.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/customers',
      handler: 'customer.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/customers/:id',
      handler: 'customer.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/customers/:id',
      handler: 'customer.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
