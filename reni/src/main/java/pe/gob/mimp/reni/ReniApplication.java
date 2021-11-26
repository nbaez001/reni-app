package pe.gob.mimp.reni;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ReniApplication {

	private static final Logger log = LoggerFactory.getLogger(ReniApplication.class);

	public static void main(String[] args) {
		log.info("---------Start class Application---------");
		SpringApplication.run(ReniApplication.class, args);
	}

}
