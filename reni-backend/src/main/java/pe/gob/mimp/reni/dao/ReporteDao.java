package pe.gob.mimp.reni.dao;

import java.util.List;
import java.util.Map;

import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarEntidadPermitidoRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarEstructuraPermitidoRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarServicioPermitidoRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarUsuarioXDatosRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarXlsxRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionXUsuarioListarMaestraResponse;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionXUsuarioListarRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionXUsuarioListarXlsxRequest;
import pe.gob.mimp.reni.dto.request.ReporteParametroEstrucXUsuListarRequest;
import pe.gob.mimp.reni.dto.response.EntidadListarResponse;
import pe.gob.mimp.reni.dto.response.LineaIntervencionListarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.ReporteIntervencionListarEstructuraPermitidoResponse;
import pe.gob.mimp.reni.dto.response.ReporteIntervencionListarMaestraResponse;
import pe.gob.mimp.reni.dto.response.ReporteIntervencionListarParametroResponse;
import pe.gob.mimp.reni.dto.response.ReporteIntervencionListarUsuarioXDatosResponse;
import pe.gob.mimp.reni.dto.response.ReporteParametroEstrucListarResponse;
import pe.gob.mimp.reni.dto.response.ServicioListarResponse;

public interface ReporteDao {

	public OutResponse<List<ReporteParametroEstrucListarResponse>> listarParametroEstructura(String lEstructura);

	public OutResponse<List<Map<String, Object>>> listarReporteIntervencion(ReporteIntervencionListarRequest req,
			List<ReporteIntervencionListarMaestraResponse> lMaestra);

	public OutResponse<List<ReporteIntervencionListarMaestraResponse>> listarMaestraXEstructura(String req);

	public OutResponse<List<ReporteIntervencionListarParametroResponse>> listarParametroXEstructura(String req);

	public OutResponse<List<Map<String, Object>>> listarReporteIntervencionXlsx(ReporteIntervencionListarXlsxRequest c,
			List<ReporteIntervencionListarMaestraResponse> lMaestra);

	public OutResponse<List<EntidadListarResponse>> listarEntidadPermitido(
			ReporteIntervencionListarEntidadPermitidoRequest req, String lServicio);

	public OutResponse<List<LineaIntervencionListarResponse>> listarLineaInterPermitido(String lServicio);

	public OutResponse<List<ServicioListarResponse>> listarServicioPermitido(
			ReporteIntervencionListarServicioPermitidoRequest req, String lServicio);

	public OutResponse<List<ReporteIntervencionListarEstructuraPermitidoResponse>> listarEstructuraPermitido(
			ReporteIntervencionListarEstructuraPermitidoRequest req, String lServicio);

	public OutResponse<List<ReporteParametroEstrucListarResponse>> listarParametroEstructuraXUsuario(
			ReporteParametroEstrucXUsuListarRequest req);

	public OutResponse<List<ReporteIntervencionXUsuarioListarMaestraResponse>> listarMaestraXEstructurasUsuario(
			String tipDocUsu, String nroDocUsu, String codUsu);

	public OutResponse<List<Map<String, Object>>> listarReporteIntervencionXUsuario(
			ReporteIntervencionXUsuarioListarRequest req,
			List<ReporteIntervencionXUsuarioListarMaestraResponse> lMaestra);

	public OutResponse<List<ReporteIntervencionListarUsuarioXDatosResponse>> listarUsuarioXDatos(
			ReporteIntervencionListarUsuarioXDatosRequest req);

	public OutResponse<List<Map<String, Object>>> listarReporteIntervencionXUsuarioXlsx(
			ReporteIntervencionXUsuarioListarXlsxRequest req,
			List<ReporteIntervencionXUsuarioListarMaestraResponse> lMaestra);

	public OutResponse<List<ReporteIntervencionListarParametroResponse>> listarParametroXEstructura(String tipDocUsu,
			String nroDocUsu, String codUsu);
}
