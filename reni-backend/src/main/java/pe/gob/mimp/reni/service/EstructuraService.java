package pe.gob.mimp.reni.service;

import java.util.List;

import pe.gob.mimp.reni.dto.request.EstructuraBuscarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraEliminarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraListarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraModificarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraParametroListarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraRegistrarRequest;
import pe.gob.mimp.reni.dto.response.EstructuraBuscarResponse;
import pe.gob.mimp.reni.dto.response.EstructuraListarResponse;
import pe.gob.mimp.reni.dto.response.EstructuraParametroListarResponse;
import pe.gob.mimp.reni.dto.response.EstructuraRegistrarResponse;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;

public interface EstructuraService {

	public OutResponse<List<EstructuraListarResponse>> listarEstructura(EstructuraListarRequest req);

	public OutResponse<EstructuraRegistrarResponse> registrarEstructura(EstructuraRegistrarRequest req);

	public OutResponse<?> modificarEstructura(EstructuraModificarRequest req) throws Exception;

	public OutResponse<?> eliminarEstructura(EstructuraEliminarRequest req);

	public OutResponse<List<EstructuraParametroListarResponse>> listarParametroEstructura(
			EstructuraParametroListarRequest req);

	public OutResponse<EstructuraBuscarResponse> buscarEstructura(EstructuraBuscarRequest req);

	public OutResponse<FileResponse> exportarListaEstructuraXlsx(EstructuraListarRequest c);
}
