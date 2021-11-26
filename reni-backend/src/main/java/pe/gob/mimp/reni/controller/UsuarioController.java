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
import pe.gob.mimp.reni.dto.request.UsuarioAsociarRequest;
import pe.gob.mimp.reni.dto.request.UsuarioBuscarRequest;
import pe.gob.mimp.reni.dto.request.UsuarioEliminarRequest;
import pe.gob.mimp.reni.dto.request.UsuarioListarRequest;
import pe.gob.mimp.reni.dto.request.UsuarioModificarRequest;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.UsuarioBuscarResponse;
import pe.gob.mimp.reni.dto.response.UsuarioListarResponse;
import pe.gob.mimp.reni.service.UsuarioService;

@RestController
@RequestMapping("/usuario")
@Api(value = "API Usuario")
public class UsuarioController {

	private static final Logger log = LoggerFactory.getLogger(UsuarioController.class);

	@Autowired
	UsuarioService usuarioService;

	@PostMapping("/listarUsuario")
	public OutResponse<List<UsuarioListarResponse>> listarUsuario(@RequestBody UsuarioListarRequest req) {
		log.info("[LISTAR USUARIO][CONTROLLER][INICIO]");
		OutResponse<List<UsuarioListarResponse>> out = usuarioService.listarUsuario(req);
		log.info("[LISTAR USUARIO][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/modificarUsuario")
	public OutResponse<?> modificarUsuario(@RequestBody UsuarioModificarRequest req) {
		log.info("[MODIFICAR USUARIO][CONTROLLER][INICIO]");
		OutResponse<?> out = usuarioService.modificarUsuario(req);
		log.info("[MODIFICAR USUARIO][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/eliminarUsuario")
	public OutResponse<?> eliminarUsuario(@RequestBody UsuarioEliminarRequest req) {
		log.info("[ELIMINAR USUARIO][CONTROLLER][INICIO]");
		OutResponse<?> out = usuarioService.eliminarUsuario(req);
		log.info("[ELIMINAR USUARIO][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/buscarUsuario")
	public OutResponse<UsuarioBuscarResponse> buscarUsuario(@RequestBody UsuarioBuscarRequest req) {
		log.info("[BUSCAR USUARIO][CONTROLLER][INICIO]");
		OutResponse<UsuarioBuscarResponse> out = usuarioService.buscarUsuario(req);
		log.info("[BUSCAR USUARIO][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/asociarUsuario")
	public OutResponse<?> asociarUsuario(@RequestBody UsuarioAsociarRequest req) {
		log.info("[BUSCAR USUARIO][CONTROLLER][INICIO]");
		OutResponse<?> out = usuarioService.asociarUsuario(req);
		log.info("[BUSCAR USUARIO][CONTROLLER][FIN]");
		return out;
	}
	
	@PostMapping("/exportarListaUsuarioXlsx")
	public OutResponse<FileResponse> exportarListaUsuarioXlsx(@RequestBody UsuarioListarRequest c) {
		log.info("[EXPORTAR LISTA USUARIO][CONTROLLER][INICIO]");
		OutResponse<FileResponse> out = usuarioService.exportarListaUsuarioXlsx(c);
		log.info("[EXPORTAR LISTA USUARIO][CONTROLLER][FIN]");
		return out;
	}
}
