package pe.gob.mimp.reni.dao;

import java.util.List;
import java.util.Map;

import pe.gob.mimp.reni.dto.request.EdneEliminarRequest;
import pe.gob.mimp.reni.dto.request.EdneListarParamEstructuraRequest;
import pe.gob.mimp.reni.dto.request.EdneListarRequest;
import pe.gob.mimp.reni.dto.request.EdneListarUsuarioXCodigoRequest;
import pe.gob.mimp.reni.dto.request.EdneListarUsuarioXDocumentoRequest;
import pe.gob.mimp.reni.dto.request.EdneModificarListarUsuarioRequest;
import pe.gob.mimp.reni.dto.request.EdneModificarRequest;
import pe.gob.mimp.reni.dto.request.EdneRegistrarRequest;
import pe.gob.mimp.reni.dto.response.EdneListarParamEstructuraResponse;
import pe.gob.mimp.reni.dto.response.EdneListarResponse;
import pe.gob.mimp.reni.dto.response.EdneListarUsuarioXCodigoResponse;
import pe.gob.mimp.reni.dto.response.EdneListarUsuarioXDocumentoResponse;
import pe.gob.mimp.reni.dto.response.EdneRegistrarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;

public interface EdneDao {

	public OutResponse<List<EdneListarResponse>> listarEdne(EdneListarRequest req);

//	public OutResponse<EdneRegistrarResponse> registrarEdne(EdneRegistrarRequest req, String lIdentificado,
//			Integer tIdentificado, String lNoIdentificado, Integer tNoIdentificado);

	public OutResponse<EdneRegistrarResponse> registrarEdne(EdneRegistrarRequest req) throws Exception;

	public OutResponse<?> registrarEdneUsuarioNN(Long idEdne, String dataUsu, String dataUsuDetalle,
			String dataUsuIngreso, String dataUsuAgent, String dataUsuActividad, String dataUsuSituacion,
			String queryUsu, String queryUsuDetalle, String queryUsuIngreso, String queryUsuAgent,
			String queryUsuActividad, String queryUsuSituacion) throws Exception;

	public OutResponse<?> registrarEdneUsuarioID(Long idEdne, String dataUsuDetalle, String dataUsuIngreso,
			String dataUsuAgent, String dataUsuActividad, String dataUsuSituacion, String queryUsuDetalle,
			String queryUsuIngreso, String queryUsuAgent, String queryUsuActividad, String queryUsuSituacion)
			throws Exception;

	public OutResponse<?> modificarEdne(EdneModificarRequest req);

	public OutResponse<?> eliminarEdne(EdneEliminarRequest req);

	public OutResponse<List<EdneListarParamEstructuraResponse>> listarParamEstructura(
			EdneListarParamEstructuraRequest req);

	public OutResponse<List<EdneListarUsuarioXCodigoResponse>> listarUsuarioXCodigo(EdneListarUsuarioXCodigoRequest req,
			String lCodigos, Integer tCodigos);

	public OutResponse<List<EdneListarUsuarioXDocumentoResponse>> listarUsuarioXDocumento(
			EdneListarUsuarioXDocumentoRequest req, String lDocumentos, Integer tDocumentos);

	public OutResponse<List<Map<String, Object>>> listarUsuariosEdne(EdneModificarListarUsuarioRequest req);
}
