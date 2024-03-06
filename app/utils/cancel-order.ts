import { shopifyAppConfig } from './common';

export const cancelAnkorstoreOrder = async (
  shop: string,
  payload: any,
): Promise<string> => {
  const { id } = payload;
  const clientId = '9b37a85f-9329-4a70-8b42-7ebd7b755017'; // from DB
  const clientSecret = 'ZCewRa4f9FduDUPzeRDKCexzmCqA1HBcqazVRYfg';

  const response = await fetch(
    `${shopifyAppConfig.webhookBaseUrl}/shopify/sync/order-cancel?client_id=${clientId}&client_secret=${clientSecret}&shop=${shop}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    },
  );
  return response.json();
};
