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
import pe.gob.mimp.reni.dto.request.EstructuraBuscarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraEliminarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraListarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraModificarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraParametroListarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraRegistrarRequest;
import pe.gob.mimp.reni.dto.response.EstructuraBuscarResponse;
import pe.gob.mimp.reni.dto.response.EstructuraListarResponse;
import pe.gob.mimp.reni.dto.response.EstructuraParametroListarResponse;
import pe.gob.mimp.reni.dto.response.EstructuraRegistrarResponse;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.service.EstructuraService;

@RestController
@RequestMapping("/estructura")
@Api(value = "API Estructura")
public class EstructuraController {

	private static final Logger log = LoggerFactory.getLogger(EstructuraController.class);

	@Autowired
	EstructuraService estructuraService;

	@PostMapping("/listarEstructura")
	public OutResponse<List<EstructuraListarResponse>> listarEstructura(@RequestBody EstructuraListarRequest req) {
		log.info("[LISTAR ESTRUCTURA][CONTROLLER][INICIO]");
		OutResponse<List<EstructuraListarResponse>> out = estructuraService.listarEstructura(req);
		log.info("[LISTAR ESTRUCTURA][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/registrarEstructura")
	public OutResponse<EstructuraRegistrarResponse> registrarEstructura(@RequestBody EstructuraRegistrarRequest req) {
		log.info("[REGISTRAR ESTRUCTURA][CONTROLLER][INICIO]");
		OutResponse<EstructuraRegistrarResponse> out = estructuraService.registrarEstructura(req);
		log.info("[REGISTRAR ESTRUCTURA][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/modificarEstructura")
	public OutResponse<?> modificarEstructura(@RequestBody EstructuraModificarRequest req) {
		log.info("[MODIFICAR ESTRUCTURA][CONTROLLER][INICIO]");
		OutResponse<?> out;
		try {
			out = estructuraService.modificarEstructura(req);
			log.info("[MODIFICAR ESTRUCTURA][CONTROLLER][EXITO]");
		} catch (Exception e) {
			log.info("[MODIFICAR ESTRUCTURA][CONTROLLER][EXCEPTION][" + e.getMessage() + "]");
			out = new OutResponse<>();
			out.setRCodigo(500);
			out.setRMensaje(e.getMessage());
		}
		log.info("[MODIFICAR ESTRUCTURA][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/eliminarEstructura")
	public OutResponse<?> eliminarEstructura(@RequestBody EstructuraEliminarRequest req) {
		log.info("[ELIMINAR ESTRUCTURA][CONTROLLER][INICIO]");
		OutResponse<?> out = estructuraService.eliminarEstructura(req);
		log.info("[ELIMINAR ESTRUCTURA][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarParametroEstructura")
	public OutResponse<List<EstructuraParametroListarResponse>> listarParametroEstructura(
			@RequestBody EstructuraParametroListarRequest req) {
		log.info("[LISTAR PARAMETROS ESTRUCTURA][CONTROLLER][INICIO]");
		OutResponse<List<EstructuraParametroListarResponse>> out = estructuraService.listarParametroEstructura(req);
		log.info("[LISTAR PARAMETROS ESTRUCTURA][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/buscarEstructura")
	public OutResponse<EstructuraBuscarResponse> buscarEstructura(@RequestBody EstructuraBuscarRequest req) {
		log.info("[BUSCAR ESTRUCTURA][CONTROLLER][INICIO]");
		OutResponse<EstructuraBuscarResponse> out = estructuraService.buscarEstructura(req);
		log.info("[BUSCAR ESTRUCTURA][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/exportarListaEstructuraXlsx")
	public OutResponse<FileResponse> exportarListaEstructuraXlsx(@RequestBody EstructuraListarRequest c) {
		log.info("[EXPORTAR LISTA ESTRUCTURA][CONTROLLER][INICIO]");
		OutResponse<FileResponse> out = estructuraService.exportarListaEstructuraXlsx(c);
		log.info("[EXPORTAR LISTA ESTRUCTURA][CONTROLLER][FIN]");
		return out;
	}
}
