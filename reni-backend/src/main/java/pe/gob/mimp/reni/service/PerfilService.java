package pe.gob.mimp.reni.service;

import java.util.List;

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

public interface PerfilService {

	public OutResponse<List<PerfilListarResponse>> listarPerfil(PerfilListarRequest req);

	public OutResponse<PerfilRegistrarResponse> registrarPerfil(PerfilRegistrarRequest req);

	public OutResponse<?> modificarPerfil(PerfilModificarRequest req);

	public OutResponse<?> eliminarPerfil(PerfilEliminarRequest req);

	public OutResponse<List<PerfilFuncionalidadListarResponse>> listarFuncionalidad(
			PerfilFuncionalidadListarRequest req);

	public OutResponse<List<PerfilFuncionalidadPerfListarResponse>> listarFuncionalidadPerfil(
			PerfilFuncionalidadPerfListarRequest req);
	
	public OutResponse<FileResponse> exportarListaPerfilXlsx(PerfilListarRequest c);
}
