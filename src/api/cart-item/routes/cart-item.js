module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/cart-items',
      handler: 'cart-item.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/cart-items/:id',
      handler: 'cart-item.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/cart-items',
      handler: 'cart-item.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/cart-items/:id',
      handler: 'cart-item.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/cart-items/:id',
      handler: 'cart-item.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
