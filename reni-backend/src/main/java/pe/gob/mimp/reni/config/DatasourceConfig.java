package pe.gob.mimp.reni.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.lookup.JndiDataSourceLookup;

import pe.gob.mimp.reni.util.ConstanteUtil;
import pe.gob.mimp.reni.util.DatasourceProperties;

@Configuration
@EnableConfigurationProperties
public class DatasourceConfig {

	@Value("${spring.profiles}")
	private String profile;

	@Autowired
	DatasourceProperties datasourceProperties;

	@Bean
	@Primary
	public DataSource dataSource() {
		if (profile.equals(ConstanteUtil.PERFIL_DEV)) {
			DataSourceBuilder<?> dataSourceBuilder = DataSourceBuilder.create();
			dataSourceBuilder.driverClassName(datasourceProperties.getDatasource().get("driver-class-name"));
			dataSourceBuilder.url(datasourceProperties.getDatasource().get("jdbc-url"));
			dataSourceBuilder.username(datasourceProperties.getDatasource().get("username"));
			dataSourceBuilder.password(datasourceProperties.getDatasource().get("password"));
			return dataSourceBuilder.build();
		} else {
			JndiDataSourceLookup lookup = new JndiDataSourceLookup();
			return lookup.getDataSource(datasourceProperties.getDatasource().get("jndi-name"));
		}
	}

	@Bean(name = "dataSourceGeneral")
	public DataSource dataSourceGeneral() {
		if (profile.equals(ConstanteUtil.PERFIL_DEV)) {
			DataSourceBuilder<?> dataSourceBuilder = DataSourceBuilder.create();
			dataSourceBuilder.driverClassName(datasourceProperties.getDatasourceGeneral().get("driver-class-name"));
			dataSourceBuilder.url(datasourceProperties.getDatasourceGeneral().get("jdbc-url"));
			dataSourceBuilder.username(datasourceProperties.getDatasourceGeneral().get("username"));
			dataSourceBuilder.password(datasourceProperties.getDatasourceGeneral().get("password"));
			return dataSourceBuilder.build();
		} else {
			JndiDataSourceLookup lookup = new JndiDataSourceLookup();
			return lookup.getDataSource(datasourceProperties.getDatasourceGeneral().get("jndi-name"));
		}
	}
	
	@Bean(name = "dataSourceSeguridad")
	public DataSource dataSourceSeguridad() {
		if (profile.equals(ConstanteUtil.PERFIL_DEV)) {
			DataSourceBuilder<?> dataSourceBuilder = DataSourceBuilder.create();
			dataSourceBuilder.driverClassName(datasourceProperties.getDatasourceSeguridad().get("driver-class-name"));
			dataSourceBuilder.url(datasourceProperties.getDatasourceSeguridad().get("jdbc-url"));
			dataSourceBuilder.username(datasourceProperties.getDatasourceSeguridad().get("username"));
			dataSourceBuilder.password(datasourceProperties.getDatasourceSeguridad().get("password"));
			return dataSourceBuilder.build();
		} else {
			JndiDataSourceLookup lookup = new JndiDataSourceLookup();
			return lookup.getDataSource(datasourceProperties.getDatasourceGeneral().get("jndi-name"));
		}
	}

}
