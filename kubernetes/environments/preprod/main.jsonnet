local apps_core = (import 'apps-core/main.libsonnet');

apps_core.injectKustomizations(
  (import 'utils/main.libsonnet')
  + (import 'ankorstore/app/main.libsonnet')
  + {
    _config+:: {
      app_name: 'shopify-sales-channel',
      cluster: 'preprod',
    },
  },
  prune=true
)
