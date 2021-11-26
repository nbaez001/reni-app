package pe.gob.mimp.reni.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.RecursosSeguridadListarCargoResponse;
import pe.gob.mimp.reni.dto.response.RecursosSeguridadListarTipoDocumResponse;
import pe.gob.mimp.reni.service.RecursosSeguridadService;

@RestController
@RequestMapping("/recursos-seguridad")
@Api(value = "API Recursos seguridad")
public class RecursosSeguridadController {

	private static final Logger log = LoggerFactory.getLogger(RecursosSeguridadController.class);

	@Autowired
	RecursosSeguridadService recursosSeguridadService;

	@PostMapping("/listarTipoDocumento")
	public OutResponse<List<RecursosSeguridadListarTipoDocumResponse>> listarTipoDocumento() {
		log.info("[LISTAR TIPO DOCUMENTO][CONTROLLER][INICIO]");
		OutResponse<List<RecursosSeguridadListarTipoDocumResponse>> out = recursosSeguridadService
				.listarTipoDocumento();
		log.info("[LISTAR TIPO DOCUMENTO][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarCargo")
	public OutResponse<List<RecursosSeguridadListarCargoResponse>> listarCargo() {
		log.info("[LISTAR CARGO][CONTROLLER][INICIO]");
		OutResponse<List<RecursosSeguridadListarCargoResponse>> out = recursosSeguridadService.listarCargo();
		log.info("[LISTAR CARGO][CONTROLLER][FIN]");
		return out;
	}
}
