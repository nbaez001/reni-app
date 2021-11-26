package pe.gob.mimp.reni.dao;

import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.UsuarioResponse;

public interface UsuarioOauth2Dao {

	public OutResponse<UsuarioResponse> buscarUsuario(String username);

}
