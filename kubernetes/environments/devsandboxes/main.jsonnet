local dev = (import 'dev/main.libsonnet');

dev.utils.patchForDevsandboxes(
  {
    _config:: {
      environment: 'devsandboxes',
      domain: 'ankorstore-sandbox.com',
      app_name: 'shopify-sales-channel',
      sandbox: std.extVar('SANDBOX'),
    },
  }
  + (
    if (std.startsWith(std.extVar('SANDBOX'), 'devsandboxes-')) then
      (import 'shared.libsonnet')
    else
      (import 'devsandboxes.libsonnet')
  )
)
