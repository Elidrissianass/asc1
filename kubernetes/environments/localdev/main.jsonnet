local dev = (import 'dev/main.libsonnet');

local namespace = 'localdev-shopify-sales-channel';

// Import the local stack
local stack = dev.localdev.patch(
  (import 'ankorstore/app/main.libsonnet')
  + (import 'localdev-mixin.libsonnet')
  + {
    _config+: {
      app_name: 'shopify-sales-channel',
      cluster: 'localdev',
      namespace: namespace,
    },
  },
);

dev.localdev.genStageEnvs(stack, namespace)
