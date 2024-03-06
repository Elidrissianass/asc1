import type { RestResources } from '@shopify/shopify-api/rest/admin/2024-01';
import type { AdminApiContext } from 'node_modules/@shopify/shopify-app-remix/build/ts/server/clients';

export const getCurrentApp = async (
  admin: AdminApiContext<RestResources>,
  payload: any,
): Promise<string> => {
  const response = await admin.graphql(
    `  query getCurrentApp {
        app(id: "gid://shopify/App/${payload.app_id}") {
          title
        }
      }`,
  );
  const data = await response.json();

  return data.data.app.title;
};
