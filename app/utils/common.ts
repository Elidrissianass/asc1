export const calculatePercentage = (numerator: number, denominator: number) => {
  const fraction = numerator / denominator;
  const percentage = fraction * 100;
  return Math.round(percentage);
};

interface ShopifyAppconfig {
  appName?: string;
  appUrl?: string;
  webhookBaseUrl?: string;
}

export const shopifyAppConfig: ShopifyAppconfig = {
  appName: process.env.SHOPIFY_APP_NAME || '',
  appUrl: process.env.SHOPIFY_APP_URL || '',
  webhookBaseUrl:
    process.env.WEBHOOK_BASE_URL || 'http://localhost:3000/api/v1',
};
