package pe.gob.mimp.reni.service;

import java.util.List;

import pe.gob.mimp.reni.dto.request.MaestraCargaMasivaListarMaeRequest;
import pe.gob.mimp.reni.dto.request.MaestraCargaMasivaRequest;
import pe.gob.mimp.reni.dto.request.MaestraEliminarRequest;
import pe.gob.mimp.reni.dto.request.MaestraListarExportRequest;
import pe.gob.mimp.reni.dto.request.MaestraListarRequest;
import pe.gob.mimp.reni.dto.request.MaestraModificarRequest;
import pe.gob.mimp.reni.dto.request.MaestraRegistrarRequest;
import pe.gob.mimp.reni.dto.request.MaestraSubitemEliminarRequest;
import pe.gob.mimp.reni.dto.request.MaestraSubitemListarRequest;
import pe.gob.mimp.reni.dto.request.MaestraSubitemModificarRequest;
import pe.gob.mimp.reni.dto.request.MaestraSubitemRegistrarRequest;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.MaestraCargaMasivaListarMaeResponse;
import pe.gob.mimp.reni.dto.response.MaestraListarResponse;
import pe.gob.mimp.reni.dto.response.MaestraRegistrarResponse;
import pe.gob.mimp.reni.dto.response.MaestraSubitemListarResponse;
import pe.gob.mimp.reni.dto.response.MaestraSubitemRegistrarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;

public interface MaestraService {

	public OutResponse<List<MaestraListarResponse>> listarMaestra(MaestraListarRequest req);

	public OutResponse<MaestraRegistrarResponse> registrarMaestra(MaestraRegistrarRequest req);

	public OutResponse<?> modificarMaestra(MaestraModificarRequest req);

	public OutResponse<?> eliminarMaestra(MaestraEliminarRequest req);

	public OutResponse<List<MaestraSubitemListarResponse>> listarMaestraSubitem(MaestraSubitemListarRequest req);

	public OutResponse<MaestraSubitemRegistrarResponse> registrarMaestraSubitem(MaestraSubitemRegistrarRequest req);

	public OutResponse<?> modificarMaestraSubitem(MaestraSubitemModificarRequest req);

	public OutResponse<?> eliminarMaestraSubitem(MaestraSubitemEliminarRequest req);

	public OutResponse<FileResponse> exportarListaMaestraXlsx(MaestraListarExportRequest c);

	public OutResponse<List<MaestraCargaMasivaListarMaeResponse>> listarMaestraCargaMasiva(
			MaestraCargaMasivaListarMaeRequest req);

	public OutResponse<?> cargaMasivaMaestras(MaestraCargaMasivaRequest req) throws Exception;
}
