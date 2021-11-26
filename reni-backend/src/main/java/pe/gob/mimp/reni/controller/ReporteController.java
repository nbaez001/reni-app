package pe.gob.mimp.reni.controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarXlsxRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarEntidadPermitidoRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarEstructuraPermitidoRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarLineaInterPermitidoRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarServicioPermitidoRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarUsuarioXDatosRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionXUsuarioListarRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionXUsuarioListarXlsxRequest;
import pe.gob.mimp.reni.dto.request.ReporteParametroEstrucListarRequest;
import pe.gob.mimp.reni.dto.request.ReporteParametroEstrucXUsuListarRequest;
import pe.gob.mimp.reni.dto.request.ReportePlantillaRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarRequest;
import pe.gob.mimp.reni.dto.response.EntidadListarResponse;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.LineaIntervencionListarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.ReporteIntervencionListarEstructuraPermitidoResponse;
import pe.gob.mimp.reni.dto.response.ReporteIntervencionListarUsuarioXDatosResponse;
import pe.gob.mimp.reni.dto.response.ReporteParametroEstrucListarResponse;
import pe.gob.mimp.reni.dto.response.ServicioListarResponse;
import pe.gob.mimp.reni.service.ReporteService;

@RestController
@RequestMapping("/reporte")
@Api(value = "API Reporte")
public class ReporteController {

	private static final Logger log = LoggerFactory.getLogger(ReporteController.class);

	@Autowired
	ReporteService reporteService;

	@PostMapping("/listarParametroEstructura")
	public OutResponse<List<ReporteParametroEstrucListarResponse>> listarParametroEstructura(
			@RequestBody ReporteParametroEstrucListarRequest req) {
		log.info("[LISTAR PARAMETRO ESTRUCTURA][CONTROLLER][INICIO]");
		OutResponse<List<ReporteParametroEstrucListarResponse>> out = reporteService.listarParametroEstructura(req);
		log.info("[LISTAR PARAMETRO ESTRUCTURA][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarReporteIntervencion")
	public OutResponse<List<Map<String, Object>>> listarReporteIntervencion(@RequestBody ReporteIntervencionListarRequest req) {
		log.info("[LISTAR REPORTE INTERVENCION][CONTROLLER][INICIO]");
		OutResponse<List<Map<String, Object>>> out = reporteService.listarReporteIntervencion(req);
		log.info("[LISTAR REPORTE INTERVENCION][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarReporteIntervencionXlsx")
	public OutResponse<FileResponse> listarReporteIntervencionXlsx(
			@RequestBody ReporteIntervencionListarXlsxRequest c) {
		log.info("[EXPORTAR LISTA USUARIOS][CONTROLLER][INICIO]");
		OutResponse<FileResponse> out = reporteService.listarReporteIntervencionXlsx(c);
		log.info("[EXPORTAR LISTA USUARIOS][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarEntidadPermitido")
	public OutResponse<List<EntidadListarResponse>> listarEntidadPermitido(
			@RequestBody ReporteIntervencionListarEntidadPermitidoRequest req) {
		log.info("[LISTAR ENTIDAD PERMITIDO][CONTROLLER][INICIO]");
		OutResponse<List<EntidadListarResponse>> out = reporteService.listarEntidadPermitido(req);
		log.info("[LISTAR ENTIDAD PERMITIDO][CONTROLLER][FIN]");
		return out;
	}
	
	@PostMapping("/listarLineaInterPermitido")
	public OutResponse<List<LineaIntervencionListarResponse>> listarLineaInterPermitido(
			@RequestBody ReporteIntervencionListarLineaInterPermitidoRequest req) {
		log.info("[LISTAR LINEA INTER PERMITIDO][CONTROLLER][INICIO]");
		OutResponse<List<LineaIntervencionListarResponse>> out = reporteService.listarLineaInterPermitido(req);
		log.info("[LISTAR LINEA INTER PERMITIDO][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarServicioPermitido")
	public OutResponse<List<ServicioListarResponse>> listarServicioPermitido(
			@RequestBody ReporteIntervencionListarServicioPermitidoRequest req) {
		log.info("[LISTAR SERVICIO PERMITIDO][CONTROLLER][INICIO]");
		OutResponse<List<ServicioListarResponse>> out = reporteService.listarServicioPermitido(req);
		log.info("[LISTAR SERVICIO PERMITIDO][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarEstructuraPermitido")
	public OutResponse<List<ReporteIntervencionListarEstructuraPermitidoResponse>> listarEstructuraPermitido(
			@RequestBody ReporteIntervencionListarEstructuraPermitidoRequest req) {
		log.info("[LISTAR ESTRUCTURA PERMITIDO][CONTROLLER][INICIO]");
		OutResponse<List<ReporteIntervencionListarEstructuraPermitidoResponse>> out = reporteService
				.listarEstructuraPermitido(req);
		log.info("[LISTAR ESTRUCTURA PERMITIDO][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarParametroEstructuraXUsu")
	public OutResponse<List<ReporteParametroEstrucListarResponse>> listarParametroEstructuraXUsuario(
			@RequestBody ReporteParametroEstrucXUsuListarRequest req) {
		log.info("[LISTAR PARAMETRO ESTRUCTURA X USU][CONTROLLER][INICIO]");
		OutResponse<List<ReporteParametroEstrucListarResponse>> out = reporteService
				.listarParametroEstructuraXUsuario(req);
		log.info("[LISTAR PARAMETRO ESTRUCTURA X USU][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarReporteIntervencionXUsuario")
	public OutResponse<List<Map<String, Object>>> listarReporteIntervencionXUsuario(
			@RequestBody ReporteIntervencionXUsuarioListarRequest req) {
		log.info("[LISTAR REPORTE INTERVENCION X USUARIO][CONTROLLER][INICIO]");
		OutResponse<List<Map<String, Object>>> out = reporteService.listarReporteIntervencionXUsuario(req);
		log.info("[LISTAR REPORTE INTERVENCION X USUARIO][CONTROLLER][FIN]");
		return out;
	}
	
	@PostMapping("/listarReporteIntervencionXUsuarioXlsx")
	public OutResponse<FileResponse> listarReporteIntervencionXUsuarioXlsx(
			@RequestBody ReporteIntervencionXUsuarioListarXlsxRequest c) {
		log.info("[LISTAR INTERVENCION X USUARIO XLSX][CONTROLLER][INICIO]");
		OutResponse<FileResponse> out = reporteService.listarReporteIntervencionXUsuarioXlsx(c);
		log.info("[LISTAR INTERVENCION X USUARIO XLSX][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarUsuarioXDatos")
	public OutResponse<List<ReporteIntervencionListarUsuarioXDatosResponse>> listarUsuarioXDatos(
			@RequestBody ReporteIntervencionListarUsuarioXDatosRequest req) {
		log.info("[LISTAR USUARIO X DATOS][CONTROLLER][INICIO]");
		OutResponse<List<ReporteIntervencionListarUsuarioXDatosResponse>> out = reporteService.listarUsuarioXDatos(req);
		log.info("[LISTAR USUARIO X DATOS][CONTROLLER][FIN]");
		return out;
	}
	
	@PostMapping("/descargarPlantilla")
	public OutResponse<FileResponse> descargarPlantilla(@RequestBody ReportePlantillaRequest req) {
		log.info("[DESCARGAR PLANTILLA CENTRO ATENCION XLSX][CONTROLLER][INICIO]");
		OutResponse<FileResponse> out = reporteService.descargarPlantilla(req);
		log.info("[DESCARGAR PLANTILLA CENTRO ATENCION XLSX][CONTROLLER][FIN]");
		return out;
	}
}
