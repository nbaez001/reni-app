package pe.gob.mimp.reni.service;

import java.util.List;
import java.util.Map;

import pe.gob.mimp.reni.dto.request.EdneDescargarPlantillaRequest;
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
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;

public interface EdneService {

	public OutResponse<List<EdneListarResponse>> listarEdne(EdneListarRequest req);

//	public OutResponse<EdneRegistrarResponse> registrarEdne(EdneRegistrarRequest req);

	public OutResponse<EdneRegistrarResponse> registrarEdne(EdneRegistrarRequest req) throws Exception;

	public OutResponse<?> modificarEdne(EdneModificarRequest req);

	public OutResponse<?> eliminarEdne(EdneEliminarRequest req);

	public OutResponse<List<EdneListarParamEstructuraResponse>> listarParamEstructura(
			EdneListarParamEstructuraRequest req);

	public OutResponse<List<EdneListarUsuarioXCodigoResponse>> listarUsuarioXCodigo(
			EdneListarUsuarioXCodigoRequest req);

	public OutResponse<List<EdneListarUsuarioXDocumentoResponse>> listarUsuarioXDocumento(
			EdneListarUsuarioXDocumentoRequest req);

	public OutResponse<List<Map<String, Object>>> listarUsuariosEdne(EdneModificarListarUsuarioRequest req);

	public OutResponse<FileResponse> exportarListaEdneXlsx(EdneListarRequest c);

	public OutResponse<FileResponse> descargarPlantillaRENEXlsx(EdneDescargarPlantillaRequest c);
}
