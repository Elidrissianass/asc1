local k = (import 'ksonnet-util/kausal.libsonnet') + (import 'utils/v2/main.libsonnet');
local generic_app = (import 'generic-app/main.libsonnet');
local simplemysql = (import 'simplemysql/main.libsonnet');

{
  local this = self,
  local config = $._config,

  db: simplemysql.new(
    config.name,
    config.namespace,
    secret_name=config.db_secret_name,
    secret_key='DB_PASSWORD',
    gcp_vpc_selflink=$._config.gcp.vpc_selflink,
    release_channel=std.trace(config.release_channel, config.release_channel),
  ),

  // generic app
  local container = k.core.v1.container,
  container_mixin+::
    container.withEnvMap(config.env)
    + self.db.container_mixin,

  // Deployment
  app:
    generic_app.new(
      name=config.name,
      namespace=config.namespace,
      image=config.image,
      container_mixin=self.container_mixin,
    )
    + generic_app.withAutoscaling(config.min_replicas, config.max_replicas)
    + generic_app.withPodDisruptionBudget()
    + generic_app.withHttp(port=3000),
}
