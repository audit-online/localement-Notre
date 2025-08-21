module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/contacts',
      handler: 'contact.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/contacts/:id/respond',
      handler: 'contact.respond',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/contacts/:id/status',
      handler: 'contact.updateStatus',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/contacts/my',
      handler: 'contact.myContacts',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    // Routes standards
    {
      method: 'GET',
      path: '/contacts',
      handler: 'contact.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/contacts/:id',
      handler: 'contact.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/contacts/:id',
      handler: 'contact.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/contacts/:id',
      handler: 'contact.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
