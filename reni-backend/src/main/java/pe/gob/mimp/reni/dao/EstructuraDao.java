package pe.gob.mimp.reni.dao;

import java.util.List;

import pe.gob.mimp.reni.dto.request.EstructuraBuscarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraEliminarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraListarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraModificarParametroRequest;
import pe.gob.mimp.reni.dto.request.EstructuraModificarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraParametroListarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraRegistrarParametroRequest;
import pe.gob.mimp.reni.dto.request.EstructuraRegistrarRequest;
import pe.gob.mimp.reni.dto.response.EstructuraBuscarResponse;
import pe.gob.mimp.reni.dto.response.EstructuraListarResponse;
import pe.gob.mimp.reni.dto.response.EstructuraParametroListarResponse;
import pe.gob.mimp.reni.dto.response.EstructuraRegistrarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;

public interface EstructuraDao {

	public OutResponse<List<EstructuraListarResponse>> listarEstructura(EstructuraListarRequest req);

	public OutResponse<EstructuraRegistrarResponse> registrarEstructura(EstructuraRegistrarRequest req, String lista,
			Integer total);

	public OutResponse<?> modificarEstructura(EstructuraModificarRequest req) throws Exception;

	public OutResponse<?> eliminarEstructura(EstructuraEliminarRequest req);

	public OutResponse<?> registrarParametro(EstructuraRegistrarParametroRequest req, Long idEstructura,
			Long idUsuarioCrea) throws Exception;

	public OutResponse<?> modificarParametro(EstructuraModificarParametroRequest req, Long idUsuarioModif)
			throws Exception;

	public OutResponse<?> eliminarParametro(Long idParametro, Long idUsuarioModif) throws Exception;

	public OutResponse<List<EstructuraParametroListarResponse>> listarParametroEstructura(
			EstructuraParametroListarRequest req);

	public OutResponse<EstructuraBuscarResponse> buscarEstructura(EstructuraBuscarRequest req);
}
