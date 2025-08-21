module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/cart/me',
      handler: 'cart.me',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/cart/add',
      handler: 'cart.addItem',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/cart/item/:id',
      handler: 'cart.updateItem',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/cart/clear',
      handler: 'cart.clear',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
