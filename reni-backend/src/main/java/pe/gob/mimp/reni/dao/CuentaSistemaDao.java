package pe.gob.mimp.reni.dao;

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
import pe.gob.mimp.reni.dto.response.OutResponse;

public interface CuentaSistemaDao {

	public OutResponse<List<CuentaSistemaListarResponse>> listarCuentaSistema(CuentaSistemaListarRequest req);

	public OutResponse<CuentaSistemaRegistrarResponse> registrarCuentaSistema(CuentaSistemaRegistrarRequest req,
			String listaServicio);

	public OutResponse<?> modificarCuentaSistema(CuentaSistemaModificarRequest req, String listaServicio);

	public OutResponse<?> eliminarCuentaSistema(CuentaSistemaEliminarRequest req);

	public OutResponse<CuentaSistemaBuscarPersonaResponse> buscarPersona(CuentaSistemaBuscarPersonaRequest req);

	public OutResponse<Integer> validarExisteUsuario(CuentaSistemaValidarUsuarioRequest req);

	public OutResponse<CuentaSistemaUsuarioSeguridadBuscarResponse> buscarUsuarioSeguridad(
			CuentaSistemaUsuarioSeguridadBuscarRequest req);

}
