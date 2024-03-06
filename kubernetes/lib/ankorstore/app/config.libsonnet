local k = (import 'ksonnet-util/kausal.libsonnet') + (import 'utils/v2/main.libsonnet');

{
  local this = self,
  _config+:: {
    local config = self,
    name: self.app_name,

    min_replicas: 2,
    max_replicas: 4,

    image: std.extVar('IMAGE'),

    db_secret_name: 'db',

    release_channel: 'sandbox',

    env+: {
      APP_NAME: 'shopify-sales-channel',
      PORT: '3000',
      MYSQL_DATABASE: 'shopify-sales-channel'
    },
  },
}
