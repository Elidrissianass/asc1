import { shopifyAppConfig } from './common';

interface ShopifyOrder {
  shop: string;
  payload: any;
}

export const sendProductStock = async ({
  shop,
  payload,
}: ShopifyOrder): Promise<string> => {
  const clientId = '9b37a85f-9329-4a70-8b42-7ebd7b755017'; // from DB
  const clientSecret = 'ZCewRa4f9FduDUPzeRDKCexzmCqA1HBcqazVRYfg';
  const response = await fetch(
    `${shopifyAppConfig.webhookBaseUrl}/shopify/sync/product-update?client_id=${clientId}&client_secret=${clientSecret}&shop=${shop}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );
  return response.json();
};
