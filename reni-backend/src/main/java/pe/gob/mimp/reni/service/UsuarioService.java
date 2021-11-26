package pe.gob.mimp.reni.service;

import java.util.List;

import pe.gob.mimp.reni.dto.request.UsuarioAsociarRequest;
import pe.gob.mimp.reni.dto.request.UsuarioBuscarRequest;
import pe.gob.mimp.reni.dto.request.UsuarioEliminarRequest;
import pe.gob.mimp.reni.dto.request.UsuarioListarRequest;
import pe.gob.mimp.reni.dto.request.UsuarioModificarRequest;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.UsuarioBuscarResponse;
import pe.gob.mimp.reni.dto.response.UsuarioListarResponse;

public interface UsuarioService {

	public OutResponse<List<UsuarioListarResponse>> listarUsuario(UsuarioListarRequest req);

	public OutResponse<?> modificarUsuario(UsuarioModificarRequest req);

	public OutResponse<?> eliminarUsuario(UsuarioEliminarRequest req);

	public OutResponse<UsuarioBuscarResponse> buscarUsuario(UsuarioBuscarRequest req);

	public OutResponse<?> asociarUsuario(UsuarioAsociarRequest req);
	
	public OutResponse<FileResponse> exportarListaUsuarioXlsx(UsuarioListarRequest c);
}
