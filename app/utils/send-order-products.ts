import { shopifyAppConfig } from './common';
import type { RestResources } from '@shopify/shopify-api/rest/admin/2024-01';
import type { AdminApiContext } from 'node_modules/@shopify/shopify-app-remix/build/ts/server/clients';

export const getOrderProductsStock = async (
  admin: AdminApiContext<RestResources>,
  payload: any,
): Promise<any> => {
  const usedProductsSkus = payload.line_items
    .map(({ sku }: { sku: string }) => 'sku:' + sku)
    .join(' OR ');
  const response = await admin.graphql(
    `query getProductsBySku {
      productVariants(first: 250, query: "${usedProductsSkus}") {
        edges {
          node {
            sku
            inventoryQuantity
            inventoryPolicy
          }
        }
      }
    }`,
  );
  const data = await response.json();

  return data.data.productVariants;
};

export const sendOrderProductsStock = async (
  shop: string,
  productsStock: any,
): Promise<string> => {
  const clientId = '9b37a85f-9329-4a70-8b42-7ebd7b755017'; // from DB
  const clientSecret = 'ZCewRa4f9FduDUPzeRDKCexzmCqA1HBcqazVRYfg';

  const response = await fetch(
    `${shopifyAppConfig.webhookBaseUrl}/shopify/sync/order-create?client_id=${clientId}&client_secret=${clientSecret}&shop=${shop}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productsStock),
    },
  );
  return response.json();
};
