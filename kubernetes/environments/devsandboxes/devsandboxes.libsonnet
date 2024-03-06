local apps_core = (import 'apps-core/main.libsonnet');
local k = (import 'k.libsonnet');

{
  environment: {
    apiVersion: 'tanka.dev/v1alpha1',
    kind: 'Environment',
    metadata: {
      name: '%s' % $._config.sandbox,
    },
    spec: {
      apiServer: '',
      namespace: '%(sandbox)s-%(app_name)s' % $._config,
      project: $._config.environment,
    },
    data:
      apps_core.injectKustomizations(
        (import 'utils/main.libsonnet')
        + (import 'ankorstore/app/main.libsonnet')
        + {
          local this = self,
          _config+:: {
            local config = self,
            namespace: '%(sandbox)s-%(app_name)s' % self,
            release_channel: $._config.environment,
            environment: $._config.environment,
            app_name: $._config.app_name,
            sandbox: $._config.sandbox,
            image: '%s:%s' % [std.extVar('IMAGE_app'), std.extVar('IMAGE_VERSION')],
          },
        }
        + (import 'devsandboxes-mixin.libsonnet')
        + std.extVar('SANDBOX_MIXIN'),
        prune=true,
      ),
  },
}
