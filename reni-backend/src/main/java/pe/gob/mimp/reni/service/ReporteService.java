package pe.gob.mimp.reni.service;

import java.util.List;
import java.util.Map;

import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarEntidadPermitidoRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarEstructuraPermitidoRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarLineaInterPermitidoRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarServicioPermitidoRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarUsuarioXDatosRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarXlsxRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionXUsuarioListarRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionXUsuarioListarXlsxRequest;
import pe.gob.mimp.reni.dto.request.ReporteParametroEstrucListarRequest;
import pe.gob.mimp.reni.dto.request.ReporteParametroEstrucXUsuListarRequest;
import pe.gob.mimp.reni.dto.request.ReportePlantillaRequest;
import pe.gob.mimp.reni.dto.response.EntidadListarResponse;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.LineaIntervencionListarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.ReporteIntervencionListarEstructuraPermitidoResponse;
import pe.gob.mimp.reni.dto.response.ReporteIntervencionListarUsuarioXDatosResponse;
import pe.gob.mimp.reni.dto.response.ReporteParametroEstrucListarResponse;
import pe.gob.mimp.reni.dto.response.ServicioListarResponse;

public interface ReporteService {

	public OutResponse<List<ReporteParametroEstrucListarResponse>> listarParametroEstructura(
			ReporteParametroEstrucListarRequest req);

	public OutResponse<List<Map<String, Object>>> listarReporteIntervencion(ReporteIntervencionListarRequest req);

	public OutResponse<FileResponse> listarReporteIntervencionXlsx(ReporteIntervencionListarXlsxRequest c);

	public OutResponse<List<EntidadListarResponse>> listarEntidadPermitido(
			ReporteIntervencionListarEntidadPermitidoRequest req);

	public OutResponse<List<LineaIntervencionListarResponse>> listarLineaInterPermitido(
			ReporteIntervencionListarLineaInterPermitidoRequest req);

	public OutResponse<List<ServicioListarResponse>> listarServicioPermitido(
			ReporteIntervencionListarServicioPermitidoRequest req);

	public OutResponse<List<ReporteIntervencionListarEstructuraPermitidoResponse>> listarEstructuraPermitido(
			ReporteIntervencionListarEstructuraPermitidoRequest req);

	public OutResponse<List<ReporteParametroEstrucListarResponse>> listarParametroEstructuraXUsuario(
			ReporteParametroEstrucXUsuListarRequest req);

	public OutResponse<List<Map<String, Object>>> listarReporteIntervencionXUsuario(
			ReporteIntervencionXUsuarioListarRequest req);

	public OutResponse<List<ReporteIntervencionListarUsuarioXDatosResponse>> listarUsuarioXDatos(
			ReporteIntervencionListarUsuarioXDatosRequest req);

	public OutResponse<FileResponse> listarReporteIntervencionXUsuarioXlsx(
			ReporteIntervencionXUsuarioListarXlsxRequest c);
	
	public OutResponse<FileResponse> descargarPlantilla(
			ReportePlantillaRequest req);
}
