{
  local dev = import 'dev/main.libsonnet',
  local k = import 'k.libsonnet',

  db: {
    local container = k.core.v1.container,
    local envVar = k.core.v1.envVar,

    mysql:
      dev.mysql.new(
        name='%(name)s-mysql' % $._config,
        namespace=$._config.namespace,
        password='$(DB_PASSWORD)',
        database=$._config.env.MYSQL_DATABASE,
      )
      + dev.mysql.withEnvFromSecretRef($._config.db_secret_name)
      + dev.mysql.withPersitentVolume('localdev-%(name)s-mysql-data' % $._config, storage_class='hostpath'),

    container_mixin::
      container.withEnvMixin([
        envVar.new('MYSQL_HOST', '%s.%s.svc.cluster.local' % [self.mysql.service.metadata.name, $._config.namespace]),
        envVar.fromSecretRef('MYSQL_PASSWORD', $._config.db_secret_name, 'DB_PASSWORD'),
        envVar.new('MYSQL_DSN', 'root:$(MYSQL_PASSWORD)@$(MYSQL_HOST)/$(MYSQL_DATABASE)?sslmode=disable'),
      ]),
  },
  container_mixin+:: self.db.container_mixin,

  _config+:: {
    image: self.app_name,  // will be replaced by devspace
  },
}
