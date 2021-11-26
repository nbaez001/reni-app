package pe.gob.mimp.reni.service;

import java.util.List;

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

public interface CuentaSistemaService {

	public OutResponse<List<CuentaSistemaListarResponse>> listarCuentaSistema(CuentaSistemaListarRequest req);

	public OutResponse<CuentaSistemaRegistrarResponse> registrarCuentaSistema(CuentaSistemaRegistrarRequest req);

	public OutResponse<?> modificarCuentaSistema(CuentaSistemaModificarRequest req);

	public OutResponse<?> eliminarCuentaSistema(CuentaSistemaEliminarRequest req);

	public OutResponse<CuentaSistemaBuscarPersonaResponse> buscarPersona(CuentaSistemaBuscarPersonaRequest req);

	public OutResponse<Integer> validarExisteUsuario(CuentaSistemaValidarUsuarioRequest req);

	public OutResponse<CuentaSistemaUsuarioSeguridadBuscarResponse> buscarUsuarioSeguridad(
			CuentaSistemaUsuarioSeguridadBuscarRequest req);
	
	public OutResponse<FileResponse> exportarListaCuentaSistemaXlsx(CuentaSistemaListarRequest c);
}
