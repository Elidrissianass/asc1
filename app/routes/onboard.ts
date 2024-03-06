import type { ActionFunction, ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/react';
import { PrismaClient } from '@prisma/client';
import { shopifyAppConfig } from '~/utils/common';
import { authenticate } from '~/shopify.server';
export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const prisma = new PrismaClient();
  const data = await request.json();

  switch (data.step) {
    case 1:
      const step1Boarding = await prisma.onBoarding.update({
        where: {
          shopId: data.shopId,
        },
        data: {
          currentStep: data.step + 1,
        },
      });
      if (step1Boarding) {
        return json({ message: 'updated' }, { status: 200 });
      }
      break;
    case 2:
      const response = await fetch(
        `${shopifyAppConfig.webhookBaseUrl}/shopify/verification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientId: data.clientId,
            clientSecret: data.clientSecret,
            shop: data.shopId,
          }),
        },
      ).then((res) => res.json());
      console.log('🚀 ~ file: onboard.ts:45 ~ response:', response);
      if (response === 'authorized') {
        try {
          const webhook = new admin.rest.resources.Webhook({
            session: session,
          });
          const appUrl = process.env.SHOPIFY_APP_URL; // fix this
          webhook.address = `${appUrl}/webhooks`;
          webhook.topic = 'orders/cancelled';
          webhook.fields = ['app_id', 'id'];
          webhook.format = 'json';
          await webhook.save({
            update: true,
          });
          webhook.address = `${appUrl}/webhooks`;
          webhook.topic = 'orders/create';
          webhook.fields = ['app_id', 'line_items'];
          webhook.format = 'json';
          await webhook.save({
            update: true,
          });

          webhook.address = `${appUrl}/webhooks`;
          webhook.topic = 'products/update';
          webhook.format = 'json';
          webhook.fields = ['id', 'title', 'variants'];
          await webhook.save({
            update: true,
          });
        } catch (error) {
          console.log('🚀 ~ file: onboard.ts:44 ~ error:', error);
        }

        const webhookURL = `${shopifyAppConfig.webhookBaseUrl}/shopify/order/handle?client_id=${data.clientId}&client_secret=${data.clientSecret}&destination=shopify&shop=${data.shopId}`;
        const createMerchantSettings = await prisma.settings.create({
          data: {
            ankorClientID: data.clientId,
            ankorClientSecret: data.clientSecret,
            webhoohUrl: webhookURL,
            pricesDiscountPercentage: 10,
            syncedOrderStatus: 'authorized',
            dailyProductSync: false,
            orderSync: false,
            termsAccepted: false,
            shopId: data.shopId,
          },
        });
        if (!createMerchantSettings) return json(null, { status: 400 });
        console.log(
          '🚀 ~ file: onboard.ts:67 ~ settings:',
          createMerchantSettings,
        );
        const step2Boarding = await prisma.onBoarding.update({
          where: {
            shopId: data.shopId,
          },
          data: {
            currentStep: data.step + 1,
          },
        });
        if (!step2Boarding) {
          await prisma.settings.delete({ where: { shopId: data.shopId } });
          return json(null, { status: 400 });
        }
        console.log('🚀 ~ file: onboard.ts:54 ~ step2Boarding:', step2Boarding);
        return json({ message: 'updated', webhookURL }, { status: 200 });
      }
      break;
    case 3:
      const shop = session.shop;

      const usedWebhooks = await admin.rest.resources.Webhook.all({
        session: session,
      });
      console.log('🚀 ~ file: onboard.ts:82 ~ webhook:', usedWebhooks);
      console.log('🚀 ~ file: onboard.ts:81 ~ shop:', shop);
      console.log('🚀 ~ file: onboard.ts:78 ~ data:', data);
      if (usedWebhooks) {
        const step3Boarding = await prisma.onBoarding.update({
          where: {
            shopId: data.shopId,
          },
          data: {
            currentStep: data.step + 1,
          },
        });
        if (!step3Boarding) {
          return json(null, { status: 400 });
        }
        if (step3Boarding) {
          return json({ message: 'updated' }, { status: 200 });
        }
      }
      break;
    // case 4:
    //   const step4Boarding = await prisma.onBoarding.update({
    //     where: {
    //       shopId: data.shopId,
    //     },
    //     data: {
    //       currentStep: data.step + 1,
    //     },
    //   });
    //   break;
    default:
      return json(null, { status: 400 });
  }
};
