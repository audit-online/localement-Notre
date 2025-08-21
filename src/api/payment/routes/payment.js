module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/payment/checkout-session',
      handler: 'payment.createCheckoutSession',
      config: {
        policies: [],
        middlewares: ['global::rate-limit'],
      },
    },
    {
      method: 'POST',
      path: '/payment/create-payment-intent',
      handler: 'payment.createPaymentIntent',
      config: {
        policies: [],
        middlewares: ['global::rate-limit'],
      },
    },
    {
      method: 'POST',
      path: '/payment/confirm',
      handler: 'payment.confirmPayment',
      config: {
        policies: [],
        middlewares: ['global::rate-limit'],
      },
    },
    {
      method: 'GET',
      path: '/payment/session/:sessionId/status',
      handler: 'payment.getSessionStatus',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/payment/webhook',
      handler: 'payment.webhook',
      config: {
        policies: [],
        middlewares: [],
        auth: false, // Les webhooks Stripe n'utilisent pas l'auth JWT
      },
    },
  ],
};
