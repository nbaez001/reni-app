package pe.gob.mimp.reni.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import pe.gob.mimp.reni.dto.request.LineaIntervencionEliminarRequest;
import pe.gob.mimp.reni.dto.request.LineaIntervencionListarRequest;
import pe.gob.mimp.reni.dto.request.LineaIntervencionModificarRequest;
import pe.gob.mimp.reni.dto.request.LineaIntervencionRegistrarRequest;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.LineaIntervencionListarResponse;
import pe.gob.mimp.reni.dto.response.LineaIntervencionRegistrarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.service.LineaIntervencionService;

@RestController
@RequestMapping("/linea-intervencion")
@Api(value = "API LineaIntervencion")
public class LineaIntervencionController {

	private static final Logger log = LoggerFactory.getLogger(LineaIntervencionController.class);

	@Autowired
	LineaIntervencionService lineaIntervencionService;

	@PostMapping("/listarLineaIntervencion")
	public OutResponse<List<LineaIntervencionListarResponse>> listarLineaIntervencion(
			@RequestBody LineaIntervencionListarRequest req) {
		log.info("[LISTAR LINEA INTERVENCION][CONTROLLER][INICIO]");
		OutResponse<List<LineaIntervencionListarResponse>> out = lineaIntervencionService.listarLineaIntervencion(req);
		log.info("[LISTAR LINEA INTERVENCION][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/registrarLineaIntervencion")
	public OutResponse<LineaIntervencionRegistrarResponse> registrarLineaIntervencion(
			@RequestBody LineaIntervencionRegistrarRequest req) {
		log.info("[REGISTRAR LINEA INTERVENCION][CONTROLLER][INICIO]");
		OutResponse<LineaIntervencionRegistrarResponse> out = lineaIntervencionService.registrarLineaIntervencion(req);
		log.info("[REGISTRAR LINEA INTERVENCION][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/modificarLineaIntervencion")
	public OutResponse<?> modificarLineaIntervencion(@RequestBody LineaIntervencionModificarRequest req) {
		log.info("[MODIFICAR LINEA INTERVENCION][CONTROLLER][INICIO]");
		OutResponse<?> out = lineaIntervencionService.modificarLineaIntervencion(req);
		log.info("[MODIFICAR LINEA INTERVENCION][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/eliminarLineaIntervencion")
	public OutResponse<?> eliminarLineaIntervencion(@RequestBody LineaIntervencionEliminarRequest req) {
		log.info("[ELIMINAR LINEA INTERVENCION][CONTROLLER][INICIO]");
		OutResponse<?> out = lineaIntervencionService.eliminarLineaIntervencion(req);
		log.info("[ELIMINAR LINEA INTERVENCION][CONTROLLER][FIN]");
		return out;
	}
	
	@PostMapping("/exportarListaLineaIntervencionXlsx")
	public OutResponse<FileResponse> exportarListaLineaIntervencionXlsx(@RequestBody LineaIntervencionListarRequest c) {
		log.info("[EXPORTAR LISTA LINEA INTERVENCION][CONTROLLER][INICIO]");
		OutResponse<FileResponse> out = lineaIntervencionService.exportarListaLineaIntervencionXlsx(c);
		log.info("[EXPORTAR LISTA LINEA INTERVENCION][CONTROLLER][FIN]");
		return out;
	}
}
