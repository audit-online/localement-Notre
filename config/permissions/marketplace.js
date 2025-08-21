module.exports = {
  permissions: {
    // Permissions pour les utilisateurs non connectés (public)
    public: {
      'api::merchant.merchant': {
        find: true,
        findOne: true,
        count: true
      },
      'api::product.product': {
        find: true,
        findOne: true,
        count: true
      },
      'api::category.category': {
        find: true,
        findOne: true,
        count: true
      }
    },
    // Permissions pour les utilisateurs authentifiés
    authenticated: {
      'api::order.order': {
        create: true,
        find: true, // Seulement ses propres commandes
        findOne: true,
        update: true
      },
      'api::order-item.order-item': {
        create: true,
        find: true,
        update: true
      }
    }
  }
};
