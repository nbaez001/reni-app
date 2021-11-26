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
import pe.gob.mimp.reni.dto.request.PerfilEliminarRequest;
import pe.gob.mimp.reni.dto.request.PerfilFuncionalidadListarRequest;
import pe.gob.mimp.reni.dto.request.PerfilFuncionalidadPerfListarRequest;
import pe.gob.mimp.reni.dto.request.PerfilListarRequest;
import pe.gob.mimp.reni.dto.request.PerfilModificarRequest;
import pe.gob.mimp.reni.dto.request.PerfilRegistrarRequest;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.PerfilFuncionalidadListarResponse;
import pe.gob.mimp.reni.dto.response.PerfilFuncionalidadPerfListarResponse;
import pe.gob.mimp.reni.dto.response.PerfilListarResponse;
import pe.gob.mimp.reni.dto.response.PerfilRegistrarResponse;
import pe.gob.mimp.reni.service.PerfilService;

@RestController
@RequestMapping("/perfil")
@Api(value = "API Perfil")
public class PerfilController {

	private static final Logger log = LoggerFactory.getLogger(PerfilController.class);

	@Autowired
	PerfilService perfilService;

	@PostMapping("/listarPerfil")
	public OutResponse<List<PerfilListarResponse>> listarPerfil(@RequestBody PerfilListarRequest req) {
		log.info("[LISTAR PERFIL][CONTROLLER][INICIO]");
		OutResponse<List<PerfilListarResponse>> out = perfilService.listarPerfil(req);
		log.info("[LISTAR PERFIL][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/registrarPerfil")
	public OutResponse<PerfilRegistrarResponse> registrarPerfil(@RequestBody PerfilRegistrarRequest req) {
		log.info("[REGISTRAR PERFIL][CONTROLLER][INICIO]");
		OutResponse<PerfilRegistrarResponse> out = perfilService.registrarPerfil(req);
		log.info("[REGISTRAR PERFIL][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/modificarPerfil")
	public OutResponse<?> modificarPerfil(@RequestBody PerfilModificarRequest req) {
		log.info("[MODIFICAR PERFIL][CONTROLLER][INICIO]");
		OutResponse<?> out = perfilService.modificarPerfil(req);
		log.info("[MODIFICAR PERFIL][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/eliminarPerfil")
	public OutResponse<?> eliminarPerfil(@RequestBody PerfilEliminarRequest req) {
		log.info("[ELIMINAR PERFIL][CONTROLLER][INICIO]");
		OutResponse<?> out = perfilService.eliminarPerfil(req);
		log.info("[ELIMINAR PERFIL][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarFuncionalidad")
	public OutResponse<List<PerfilFuncionalidadListarResponse>> listarFuncionalidad(
			@RequestBody PerfilFuncionalidadListarRequest req) {
		log.info("[LISTAR FUNCIONALIDAD][CONTROLLER][INICIO]");
		OutResponse<List<PerfilFuncionalidadListarResponse>> out = perfilService.listarFuncionalidad(req);
		log.info("[LISTAR FUNCIONALIDAD][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarFuncionalidadPerfil")
	public OutResponse<List<PerfilFuncionalidadPerfListarResponse>> listarFuncionalidadPerfil(
			@RequestBody PerfilFuncionalidadPerfListarRequest req) {
		log.info("[LISTAR FUNCIONALIDAD PERFIL][CONTROLLER][INICIO]");
		OutResponse<List<PerfilFuncionalidadPerfListarResponse>> out = perfilService.listarFuncionalidadPerfil(req);
		log.info("[LISTAR FUNCIONALIDAD PERFIL][CONTROLLER][FIN]");
		return out;
	}
	
	@PostMapping("/exportarListaPerfilXlsx")
	public OutResponse<FileResponse> exportarListaPerfilXlsx(@RequestBody PerfilListarRequest c) {
		log.info("[EXPORTAR LISTA PERFIL][CONTROLLER][INICIO]");
		OutResponse<FileResponse> out = perfilService.exportarListaPerfilXlsx(c);
		log.info("[EXPORTAR LISTA PERFIL][CONTROLLER][FIN]");
		return out;
	}
}
