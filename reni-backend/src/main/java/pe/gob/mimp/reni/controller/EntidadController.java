package pe.gob.mimp.reni.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import pe.gob.mimp.reni.dto.CustomUser;
import pe.gob.mimp.reni.dto.request.EntidadEliminarRequest;
import pe.gob.mimp.reni.dto.request.EntidadListarRequest;
import pe.gob.mimp.reni.dto.request.EntidadModificarRequest;
import pe.gob.mimp.reni.dto.request.EntidadRegistrarRequest;
import pe.gob.mimp.reni.dto.response.EntidadListarResponse;
import pe.gob.mimp.reni.dto.response.EntidadRegistrarResponse;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.service.EntidadService;

@RestController
@RequestMapping("/entidad")
@Api(value = "API Entidad")
public class EntidadController {

	private static final Logger log = LoggerFactory.getLogger(EntidadController.class);

	@Autowired
	EntidadService entidadService;

	@GetMapping("/admins")
	@PreAuthorize("hasAuthority('OMEP')")
	public String context() {
		CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return user.getUsername() + " " + user.getNombres();
	}

	@PostMapping("/listarEntidad")
	public OutResponse<List<EntidadListarResponse>> listarEntidad(@RequestBody EntidadListarRequest req) {
		log.info("[LISTAR ENTIDAD][CONTROLLER][INICIO]");
		OutResponse<List<EntidadListarResponse>> out = entidadService.listarEntidad(req);
		log.info("[LISTAR ENTIDAD][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/registrarEntidad")
	public OutResponse<EntidadRegistrarResponse> registrarEntidad(@RequestBody EntidadRegistrarRequest req) {
		log.info("[REGISTRAR ENTIDAD][CONTROLLER][INICIO]");
		OutResponse<EntidadRegistrarResponse> out = entidadService.registrarEntidad(req);
		log.info("[REGISTRAR ENTIDAD][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/modificarEntidad")
	public OutResponse<?> modificarEntidad(@RequestBody EntidadModificarRequest req) {
		log.info("[MODIFICAR ENTIDAD][CONTROLLER][INICIO]");
		OutResponse<?> out = entidadService.modificarEntidad(req);
		log.info("[MODIFICAR ENTIDAD][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/eliminarEntidad")
	public OutResponse<?> eliminarEntidad(@RequestBody EntidadEliminarRequest req) {
		log.info("[ELIMINAR ENTIDAD][CONTROLLER][INICIO]");
		OutResponse<?> out = entidadService.eliminarEntidad(req);
		log.info("[ELIMINAR ENTIDAD][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/exportarListaEntidadXlsx")
	public OutResponse<FileResponse> exportarListaEntidadXlsx(@RequestBody EntidadListarRequest c) {
		log.info("[EXPORTAR LISTA ENTIDAD][CONTROLLER][INICIO]");
		OutResponse<FileResponse> out = entidadService.exportarListaEntidadXlsx(c);
		log.info("[EXPORTAR LISTA ENTIDAD][CONTROLLER][FIN]");
		return out;
	}

//	@PostMapping("/alterTable")
//	public OutResponse<?> alterTable(@PathParam(value = "nombre") String nombre) {
//		log.info("[AGREGAR CAMPO ENTIDAD][CONTROLLER][INICIO]");
//		OutResponse<?> out = entidadService.alterTable(nombre);
//		log.info("[AGREGAR CAMPO ENTIDAD][CONTROLLER][FIN]");
//		return out;
//	}
}
