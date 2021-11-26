package pe.gob.mimp.reni.util;

import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Component
@ConfigurationProperties(prefix = "spring")
@Getter
@Setter
@ToString
public class DatasourceProperties {

	private Map<String, String> datasource;
	private Map<String, String> datasourceGeneral;
	private Map<String, String> datasourceSeguridad;
}
