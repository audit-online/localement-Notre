'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/platform/dashboard',
      handler: 'platform.platformDashboard',
    },
    {
      method: 'GET',
      path: '/platform/merchant/:merchantId/dashboard',
      handler: 'platform.merchantDashboard',
    },
    {
      method: 'POST',
      path: '/platform/onboard-merchant',
      handler: 'platform.onboardMerchant',
    }
  ],
};
