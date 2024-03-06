import { PrismaClient } from '@prisma/client';
import {
  type LoaderFunctionArgs,
  json,
  type ActionFunctionArgs,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Card, Layout, Page } from '@shopify/polaris';
import { useState } from 'react';
import WebhookGeneratorCard from '~/components/OnBoarding/WebhookGenerator';
import HeadingCard from '~/components/OnBoarding/Heading';
import IntroductionCard from '~/components/OnBoarding/introduction';
import { authenticate } from '~/shopify.server';
import MetaFieldsGenerator from '~/components/OnBoarding/MetaFieldsGenerator';
import Completion from '~/components/OnBoarding/Completion';
// import { calculatePercentage } from '~/utils/common';

const prisma = new PrismaClient();
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const currShop = session.shop;

  const shopData = await prisma.onBoarding.findFirst({
    where: {
      shopId: currShop,
    },
  });
  if (!shopData) {
    const createdShopData = await prisma.onBoarding.create({
      data: { shopId: currShop, currentStep: 1, isOnBoarded: false },
    });
    return json(createdShopData);
  }

  return json(shopData);
};

export const action = ({ request }: ActionFunctionArgs) => {
  console.log('🚀 ~  action ~ TEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEST');
  console.log('🚀 ~  action ~ request.body:', request.body);
  // prisma.onBoarding.update({
  //   where: {
  //     shopId: shopData.shopId,
  //   },
  //   data: {
  //     currentStep: currentStep + 1,
  //   },
  // });
  return null;
};

export default function Index() {
  const shopData = useLoaderData<typeof loader>();
  const [currentStep, setCurrentStep] = useState<number>(shopData.currentStep);
  console.log('🚀 Index ~ currentStep:', currentStep);

  const handleSetValue = (newValue: number) => {
    setCurrentStep(newValue);
  };

  const increaseStep = async () => {
    console.log('🚀 ~ increaseStep ~ here1');
    if (currentStep < 4) {
      console.log('🚀 ~ increaseStep ~ here2');
      if (currentStep === 4) {
        console.log('🚀 ~ increaseStep ~ here3');
        // const response = await fetch(`./onboard`, {
        //   method: 'POST',

        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ step: 4, shopId: shopData.shopId }),
        // }).then((res) => res.json());
      }
      handleSetValue(currentStep + 1);
    }
  };

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card padding={'500'}>
            <HeadingCard
              header="Welcome to OnBoarding!"
              text="This text exists to briefly introduce the app and explain what will happne during this on-boarding. Pharetra varius ut felis sit consequat scelerisque leo facilisis elit. Pellentesque velit vel ultrices fermentum tortor massa ante. Laoreet aliquam enim donec in tellus. Pulvinar facilisis faucibus rhoncus risus eget at. A morbi cras volutpat enim lacus."
              currentStep={currentStep}
            />
            {currentStep === 1 && (
              <IntroductionCard
                increaseStep={increaseStep}
                shop={shopData.shopId}
              />
            )}
            {currentStep === 2 && (
              <WebhookGeneratorCard
                increaseStep={increaseStep}
                shop={shopData.shopId}
              />
            )}
            {currentStep === 3 && (
              <MetaFieldsGenerator
                increaseStep={increaseStep}
                shop={shopData.shopId}
              />
            )}
            {currentStep === 4 && <Completion />}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
