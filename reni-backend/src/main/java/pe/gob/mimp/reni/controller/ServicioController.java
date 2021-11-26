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
import pe.gob.mimp.reni.dto.request.ServicioEliminarRequest;
import pe.gob.mimp.reni.dto.request.ServicioListarRequest;
import pe.gob.mimp.reni.dto.request.ServicioModificarRequest;
import pe.gob.mimp.reni.dto.request.ServicioRegistrarRequest;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.ServicioListarResponse;
import pe.gob.mimp.reni.dto.response.ServicioRegistrarResponse;
import pe.gob.mimp.reni.service.ServicioService;

@RestController
@RequestMapping("/servicio")
@Api(value = "API Servicio")
public class ServicioController {

	private static final Logger log = LoggerFactory.getLogger(ServicioController.class);

	@Autowired
	ServicioService entidadService;

	@PostMapping("/listarServicio")
	public OutResponse<List<ServicioListarResponse>> listarServicio(@RequestBody ServicioListarRequest req) {
		log.info("[LISTAR SERVICIO][CONTROLLER][INICIO]");
		OutResponse<List<ServicioListarResponse>> out = entidadService.listarServicio(req);
		log.info("[LISTAR SERVICIO][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/registrarServicio")
	public OutResponse<ServicioRegistrarResponse> registrarServicio(@RequestBody ServicioRegistrarRequest req) {
		log.info("[REGISTRAR SERVICIO][CONTROLLER][INICIO]");
		OutResponse<ServicioRegistrarResponse> out = entidadService.registrarServicio(req);
		log.info("[REGISTRAR SERVICIO][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/modificarServicio")
	public OutResponse<?> modificarServicio(@RequestBody ServicioModificarRequest req) {
		log.info("[MODIFICAR SERVICIO][CONTROLLER][INICIO]");
		OutResponse<?> out = entidadService.modificarServicio(req);
		log.info("[MODIFICAR SERVICIO][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/eliminarServicio")
	public OutResponse<?> eliminarServicio(@RequestBody ServicioEliminarRequest req) {
		log.info("[ELIMINAR SERVICIO][CONTROLLER][INICIO]");
		OutResponse<?> out = entidadService.eliminarServicio(req);
		log.info("[ELIMINAR SERVICIO][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/exportarListaServicioXlsx")
	public OutResponse<FileResponse> exportarListaServicioXlsx(@RequestBody ServicioListarRequest c) {
		log.info("[EXPORTAR LISTA SERVICIO][CONTROLLER][INICIO]");
		OutResponse<FileResponse> out = entidadService.exportarListaServicioXlsx(c);
		log.info("[EXPORTAR LISTA SERVICIO][CONTROLLER][FIN]");
		return out;
	}
}
