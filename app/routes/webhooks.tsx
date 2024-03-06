import type { ActionFunctionArgs } from '@remix-run/node';
import { authenticate } from '../shopify.server';
import db from '../db.server';
import {
  getOrderProductsStock,
  sendOrderProductsStock,
} from '~/utils/send-order-products';
import { getCurrentApp } from '~/utils/get-current-app';
import { shopifyAppConfig } from '~/utils/common';
import { cancelAnkorstoreOrder } from '~/utils/cancel-order';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin, payload } =
    await authenticate.webhook(request);

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  switch (topic) {
    case 'APP_UNINSTALLED':
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }
      break;
    case 'ORDERS_CREATE':
      try {
        console.log('🚀 ORDERS_CREATE ~ START');
        const usedApp = await getCurrentApp(admin, payload);
        if (usedApp !== shopifyAppConfig.appName) {
          const productsStock = await getOrderProductsStock(admin, payload);

          await sendOrderProductsStock(shop, productsStock);
        }
      } catch (error) {
        console.log(
          '🚀 ~ file: webhooks.tsx:32 ~ ORDERS_CREATE ~ error:',
          error,
        );
      }

      break;
    case 'ORDERS_CANCELLED':
      console.log('🚀 ORDERS_CANCELLED ~ START:');
      const usedApp = await getCurrentApp(admin, payload);

      if (usedApp === shopifyAppConfig.appName) {
        const response = await cancelAnkorstoreOrder(shop, payload);
        console.log('🚀  ORDERS_CANCELLED response:', response);
      }
      break;
    case 'PRODUCTS_UPDATE':
      console.log('🚀 PRODUCTS_UPDATE ~ payload:', payload);
      // try {
      //   const response = await sendOrderProductsStock(shop, payload);
      //   console.log('🚀 response notification:', response);
      // } catch (error) {
      //   console.log(
      //     '🚀 ~ file: webhooks.tsx:32 ~ PRODUCTS_UPDATE ~ error:',
      //     error,
      //   );
      // }
      break;
    case 'CUSTOMERS_DATA_REQUEST':
    case 'CUSTOMERS_REDACT':
    case 'SHOP_REDACT':
    default:
      throw new Response('Unhandled webhook topic', { status: 404 });
  }

  throw new Response();
};
