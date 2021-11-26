package pe.gob.mimp.reni.util;

import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Component
@ConfigurationProperties(prefix = "plantillas")
@Getter
@Setter
public class PlantillaProperties {

	private Map<String, String> excel;
}
