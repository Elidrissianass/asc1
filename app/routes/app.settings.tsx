import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from '@remix-run/node';
import { authenticate } from '~/shopify.server';
import {
  BlockStack,
  Box,
  Button,
  Card,
  ChoiceList,
  Divider,
  InlineGrid,
  Page,
  Select,
  Text,
  TextField,
} from '@shopify/polaris';
import { useCallback, useState } from 'react';
import { Form } from '@remix-run/react';

// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   return null;
// };

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const appUrl = process.env.SHOPIFY_APP_URL;
  const webhook = new admin.rest.resources.Webhook({ session: session });
  if (!webhook || !appUrl) {
    return null;
  }
  // const { scope } = session;
  // console.log('🚀 ~ file: app.settings.tsx:41 ~ action ~ scope:', scope);
  // const scopes = await admin.rest.resources.AccessScope.all({
  //   session: session,
  // });
  // console.log('🚀 ~ file: app.settings.tsx:43 ~ action ~ scopes:', scopes);
  // const response = await admin.graphql(
  //   `#graphql
  //   query {
  //     node(id: "gid://shopify/Order/5285121818660") {
  //       id
  //       ... on Order {
  //         name
  //       }
  //     }
  //   }`,
  // );
  // const data = response.json();
  // const usedrder = await admin.rest.resources.Order.find({
  //   session: session,
  //   id: 5497912197257,
  //   fields: 'id,line_items,name,total_price',
  // });
  // console.log('🚀 ~ file: app.settings.tsx:45 ~ action ~ usedrder:', usedrder);

  const formData = await request.clone().formData();
  const orderSync = formData.get('orderSync');

  if (orderSync === 'true') {
    // webhook.address = `${appUrl}/webhooks`;
    // webhook.topic = 'orders/cancelled';
    // webhook.fields = ['app_id', 'id'];
    // webhook.format = 'json';
    // await webhook.save({
    //   update: true,
    // });
    // webhook.address = `${appUrl}/webhooks`;
    // webhook.topic = 'orders/create';
    // webhook.fields = ['app_id', 'line_items'];
    // webhook.format = 'json';
    // await webhook.save({
    //   update: true,
    // });

    // webhook.address = `${appUrl}/webhooks`;
    // webhook.topic = 'products/update';
    // webhook.format = 'json';
    // webhook.fields = ['id', 'title', 'variants'];
    // await webhook.save({
    //   update: true,
    // });
    console.log('🚀 ~  ~ SUCESS CREATE');
  } else {
    // const usedWebhooks = await admin.rest.resources.Webhook.all({
    //   session: session,
    // });
    // console.log('🚀 usedWebhooks:', usedWebhooks);
    // const filteredWebhooks = usedWebhooks.data.filter((webhook) => {
    //   return webhook.topic === 'orders/cancelled';
    // });
    // if (filteredWebhooks.length > 0) {
    //   filteredWebhooks.map(async (webhook, index) => {
    //     if (webhook.id) {
    //       await admin.rest.resources.Webhook.delete({
    //         session: session,
    //         id: webhook.id,
    //       });
    //       console.log('🚀 ~  ~ SUCESS DELETED', index + 1);
    //     }
    //   });
    // }
    console.log('🚀 ~  ~ DONE HERE !!!');
  }

  return null;
};

const SettingsPage = () => {
  const [selected, setSelected] = useState('field1');
  const [selectedChoice, setSelectedChoice] = useState<string[]>(['field1']);
  const [orderSyncSelectedChoice, setOrderSyncSelectedChoice] = useState<
    string[]
  >(['false']);
  const handleSelectChange = useCallback(
    (value: string) => setSelected(value),
    [],
  );

  const handleChoiceListChange = useCallback(
    (value: string[]) => setSelectedChoice(value),
    [],
  );
  const handleOrderSyncChoiceListChange = useCallback(
    (value: string[]) => setOrderSyncSelectedChoice(value),
    [],
  );

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  // };
  return (
    <Page fullWidth>
      <BlockStack gap={{ xs: '800', sm: '400' }}>
        <InlineGrid columns={{ xs: '1fr', md: '1fr 8fr' }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: '400', sm: '0' }}
            paddingInlineEnd={{ xs: '400', sm: '0' }}
          >
            <BlockStack gap="400">
              <Text as="h1" variant="headingMd">
                Settings
              </Text>
            </BlockStack>
          </Box>
          <BlockStack gap="400">
            <Form method="post">
              <Card roundedAbove="sm">
                <Select
                  label="what shopify produc"
                  options={[
                    { label: 'field 1', value: 'field1' },
                    { label: 'field 2', value: 'field2' },
                  ]}
                  onChange={handleSelectChange}
                  value={selected}
                />
                <Text as="p" variant="bodyMd">
                  Interjambs are the rounded protruding bits of your puzzlie
                  piece
                </Text>
                <Divider />
                <ChoiceList
                  title="Synchronize products everyday automatically?"
                  name="orderSync"
                  choices={[
                    { label: 'Yes', value: 'true' },
                    { label: 'No', value: 'false' },
                  ]}
                  selected={orderSyncSelectedChoice}
                  onChange={handleOrderSyncChoiceListChange}
                />
                <Divider />
                <TextField
                  label="Prices discount on product from B2C to B2B"
                  onChange={() => {}}
                  placeholder='e.g. "10%"'
                  value={'10%'}
                  autoComplete="off"
                />
                <Text as="p" variant="bodyMd">
                  Interjambs are the rounded protruding bits of your puzzlie
                  piece
                </Text>
                <ChoiceList
                  title="other thing"
                  choices={[
                    { label: 'Yes', value: 'true' },
                    { label: 'No', value: 'false' },
                  ]}
                  selected={selectedChoice}
                  onChange={handleChoiceListChange}
                />
                <Divider />
                <Button submit variant="primary">
                  Submit
                </Button>
              </Card>
            </Form>
          </BlockStack>
        </InlineGrid>
      </BlockStack>
    </Page>
  );
};

export default SettingsPage;
