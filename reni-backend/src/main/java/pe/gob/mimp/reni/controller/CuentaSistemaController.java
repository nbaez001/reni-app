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
import pe.gob.mimp.reni.dto.request.CuentaSistemaBuscarPersonaRequest;
import pe.gob.mimp.reni.dto.request.CuentaSistemaEliminarRequest;
import pe.gob.mimp.reni.dto.request.CuentaSistemaListarRequest;
import pe.gob.mimp.reni.dto.request.CuentaSistemaModificarRequest;
import pe.gob.mimp.reni.dto.request.CuentaSistemaRegistrarRequest;
import pe.gob.mimp.reni.dto.request.CuentaSistemaUsuarioSeguridadBuscarRequest;
import pe.gob.mimp.reni.dto.request.CuentaSistemaValidarUsuarioRequest;
import pe.gob.mimp.reni.dto.response.CuentaSistemaBuscarPersonaResponse;
import pe.gob.mimp.reni.dto.response.CuentaSistemaListarResponse;
import pe.gob.mimp.reni.dto.response.CuentaSistemaRegistrarResponse;
import pe.gob.mimp.reni.dto.response.CuentaSistemaUsuarioSeguridadBuscarResponse;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.service.CuentaSistemaService;

@RestController
@RequestMapping("/cuenta-sistema")
@Api(value = "API Cuenta Sistema")
public class CuentaSistemaController {

	private static final Logger log = LoggerFactory.getLogger(CuentaSistemaController.class);

	@Autowired
	CuentaSistemaService cuentaSistemaService;

	@PostMapping("/listarCuentaSistema")
	public OutResponse<List<CuentaSistemaListarResponse>> listarCuentaSistema(
			@RequestBody CuentaSistemaListarRequest req) {
		log.info("[LISTAR CUENTA SISTEMA][CONTROLLER][INICIO]");
		OutResponse<List<CuentaSistemaListarResponse>> out = cuentaSistemaService.listarCuentaSistema(req);
		log.info("[LISTAR CUENTA SISTEMA][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/registrarCuentaSistema")
	public OutResponse<CuentaSistemaRegistrarResponse> registrarCuentaSistema(
			@RequestBody CuentaSistemaRegistrarRequest req) {
		log.info("[REGISTRAR CUENTA SISTEMA][CONTROLLER][INICIO]");
		OutResponse<CuentaSistemaRegistrarResponse> out = cuentaSistemaService.registrarCuentaSistema(req);
		log.info("[REGISTRAR CUENTA SISTEMA][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/modificarCuentaSistema")
	public OutResponse<?> modificarCuentaSistema(@RequestBody CuentaSistemaModificarRequest req) {
		log.info("[MODIFICAR CUENTA SISTEMA][CONTROLLER][INICIO]");
		OutResponse<?> out = cuentaSistemaService.modificarCuentaSistema(req);
		log.info("[MODIFICAR CUENTA SISTEMA][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/eliminarCuentaSistema")
	public OutResponse<?> eliminarCuentaSistema(@RequestBody CuentaSistemaEliminarRequest req) {
		log.info("[ELIMINAR CUENTA SISTEMA][CONTROLLER][INICIO]");
		OutResponse<?> out = cuentaSistemaService.eliminarCuentaSistema(req);
		log.info("[ELIMINAR CUENTA SISTEMA][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/buscarCuentaPersona")
	public OutResponse<CuentaSistemaBuscarPersonaResponse> buscarPersona(
			@RequestBody CuentaSistemaBuscarPersonaRequest req) {
		log.info("[BUSCAR CUENTA PERSONA][CONTROLLER][INICIO]");
		OutResponse<CuentaSistemaBuscarPersonaResponse> out = cuentaSistemaService.buscarPersona(req);
		log.info("[BUSCAR CUENTA PERSONA][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/validarExisteUsuario")
	public OutResponse<Integer> validarExisteUsuario(@RequestBody CuentaSistemaValidarUsuarioRequest req) {
		log.info("[VALIDAR EXISTE USUARIO][CONTROLLER][INICIO]");
		OutResponse<Integer> out = cuentaSistemaService.validarExisteUsuario(req);
		log.info("[VALIDAR EXISTE USUARIO][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/buscarUsuarioSeguridad")
	public OutResponse<CuentaSistemaUsuarioSeguridadBuscarResponse> buscarUsuarioSeguridad(
			@RequestBody CuentaSistemaUsuarioSeguridadBuscarRequest req) {
		log.info("[LISTAR SERVICIOS USUARIOS][CONTROLLER][INICIO]");
		OutResponse<CuentaSistemaUsuarioSeguridadBuscarResponse> out = cuentaSistemaService
				.buscarUsuarioSeguridad(req);
		log.info("[LISTAR SERVICIOS USUARIOS][CONTROLLER][FIN]");
		return out;
	}
	
	@PostMapping("/exportarListaCuentaSistemaXlsx")
	public OutResponse<FileResponse> exportarListaCuentaSistemaXlsx(@RequestBody CuentaSistemaListarRequest c) {
		log.info("[EXPORTAR LISTA CUENTA SISTEMA][CONTROLLER][INICIO]");
		OutResponse<FileResponse> out = cuentaSistemaService.exportarListaCuentaSistemaXlsx(c);
		log.info("[EXPORTAR LISTA CUENTA SISTEMA][CONTROLLER][FIN]");
		return out;
	}
}
