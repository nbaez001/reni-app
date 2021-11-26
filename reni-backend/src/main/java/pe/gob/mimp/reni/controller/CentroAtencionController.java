package pe.gob.mimp.reni.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import pe.gob.mimp.reni.dto.request.CentroAtencionAsociarServicioRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionCargaMasivaCentroListarRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionCargaMasivaRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionCargaMasivaServListarRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionEliminarRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionEliminarServicioAsocRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionListarRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionModificarRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionRegistrarRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionServListarXCentroRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionServListarXTipCenRequest;
import pe.gob.mimp.reni.dto.response.CentroAtencionAsociarServicioResponse;
import pe.gob.mimp.reni.dto.response.CentroAtencionCargaMasivaCentroListarResponse;
import pe.gob.mimp.reni.dto.response.CentroAtencionCargaMasivaServListarResponse;
import pe.gob.mimp.reni.dto.response.CentroAtencionListarResponse;
import pe.gob.mimp.reni.dto.response.CentroAtencionRegistrarResponse;
import pe.gob.mimp.reni.dto.response.CentroAtencionServListarXCentroResponse;
import pe.gob.mimp.reni.dto.response.CentroAtencionServListarXTipCenResponse;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.service.CentroAtencionService;

@RestController
@RequestMapping("/centro-atencion")
@Api(value = "API Centro atencion")
public class CentroAtencionController {

	private static final Logger log = LoggerFactory.getLogger(CentroAtencionController.class);

	@Autowired
	CentroAtencionService centroAtencionService;

	@PostMapping("/listarCentroAtencion")
	public OutResponse<List<CentroAtencionListarResponse>> listarCentroAtencion(
			@RequestBody CentroAtencionListarRequest req) {
		log.info("[LISTAR CENTRO ATENCION][CONTROLLER][INICIO]");
		OutResponse<List<CentroAtencionListarResponse>> out = centroAtencionService.listarCentroAtencion(req);
		log.info("[LISTAR CENTRO ATENCION][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarCentroAtencionLigero")
	public OutResponse<List<CentroAtencionListarResponse>> listarCentroAtencionLigero(
			@RequestBody CentroAtencionListarRequest req) {
		log.info("[LISTAR CENTRO ATENCION][CONTROLLER][INICIO]");
		OutResponse<List<CentroAtencionListarResponse>> out = centroAtencionService.listarCentroAtencionLigero(req);
		log.info("[LISTAR CENTRO ATENCION][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/registrarCentroAtencion")
	public OutResponse<CentroAtencionRegistrarResponse> registrarCentroAtencion(
			@RequestBody CentroAtencionRegistrarRequest req) {
		log.info("[REGISTRAR CENTRO ATENCION][CONTROLLER][INICIO]");
		OutResponse<CentroAtencionRegistrarResponse> out = centroAtencionService.registrarCentroAtencion(req);
		log.info("[REGISTRAR CENTRO ATENCION][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/modificarCentroAtencion")
	public OutResponse<?> modificarCentroAtencion(@RequestBody CentroAtencionModificarRequest req) {
		log.info("[MODIFICAR CENTRO ATENCION][CONTROLLER][INICIO]");
		OutResponse<?> out = centroAtencionService.modificarCentroAtencion(req);
		log.info("[MODIFICAR CENTRO ATENCION][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/eliminarCentroAtencion")
	public OutResponse<?> eliminarCentroAtencion(@RequestBody CentroAtencionEliminarRequest req) {
		log.info("[ELIMINAR CENTRO ATENCION][CONTROLLER][INICIO]");
		OutResponse<?> out = centroAtencionService.eliminarCentroAtencion(req);
		log.info("[ELIMINAR CENTRO ATENCION][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarServicioXTipoCentro")
	public OutResponse<List<CentroAtencionServListarXTipCenResponse>> listarServicioXTipoCentro(
			@RequestBody CentroAtencionServListarXTipCenRequest req) {
		log.info("[LISTAR SERVICIO X TIPO CENTRO][CONTROLLER][INICIO]");
		OutResponse<List<CentroAtencionServListarXTipCenResponse>> out = centroAtencionService
				.listarServicioXTipoCentro(req);
		log.info("[LISTAR SERVICIO X TIPO CENTRO][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarServicioXCentro")
	public OutResponse<List<CentroAtencionServListarXCentroResponse>> listarServicioXCentro(
			@RequestBody CentroAtencionServListarXCentroRequest req) {
		log.info("[LISTAR SERVICIO X CENTRO][CONTROLLER][INICIO]");
		OutResponse<List<CentroAtencionServListarXCentroResponse>> out = centroAtencionService
				.listarServicioXCentro(req);
		log.info("[LISTAR SERVICIO X CENTRO][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/registrarServicioCentroAtencion")
	public OutResponse<CentroAtencionAsociarServicioResponse> registrarServicioCentroAtencion(
			@RequestBody CentroAtencionAsociarServicioRequest req) {
		log.info("[ASOCIAR SERVICIO A CENTRO][CONTROLLER][INICIO]");
		OutResponse<CentroAtencionAsociarServicioResponse> out = centroAtencionService
				.registrarServicioCentroAtencion(req);
		log.info("[ASOCIAR SERVICIO A CENTRO][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/eliminarServicioCentroAtencion")
	public OutResponse<?> eliminarServicioCentroAtencion(@RequestBody CentroAtencionEliminarServicioAsocRequest req) {
		log.info("[ELIMINAR SERVICIO DE CENTRO][CONTROLLER][INICIO]");
		OutResponse<?> out = centroAtencionService.eliminarServicioCentroAtencion(req);
		log.info("[ELIMINAR SERVICIO DE CENTRO][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarServicio")
	public OutResponse<List<CentroAtencionCargaMasivaServListarResponse>> listarServicio(
			@RequestBody CentroAtencionCargaMasivaServListarRequest req) {
		log.info("[LISTAR SERVICIO][CONTROLLER][INICIO]");
		OutResponse<List<CentroAtencionCargaMasivaServListarResponse>> out = centroAtencionService.listarServicio(req);
		log.info("[LISTAR SERVICIO][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarCentro")
	public OutResponse<List<CentroAtencionCargaMasivaCentroListarResponse>> listarCentro(
			@RequestBody CentroAtencionCargaMasivaCentroListarRequest req) {
		log.info("[LISTAR CENTRO ATENCION][CONTROLLER][INICIO]");
		OutResponse<List<CentroAtencionCargaMasivaCentroListarResponse>> out = centroAtencionService.listarCentro(req);
		log.info("[LISTAR CENTRO ATENCION][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/cargaMasivaCentro")
	public OutResponse<?> cargaMasivaCentro(@RequestBody CentroAtencionCargaMasivaRequest req) {
		log.info("[CARGA MASIVA CENTRO][CONTROLLER][INICIO]");
		OutResponse<?> out;
		try {
			out = centroAtencionService.cargaMasivaCentro(req);
			log.info("[CARGA MASIVA CENTRO][CONTROLLER][EXITO]");
		} catch (Exception e) {
			log.info("[CARGA MASIVA CENTRO][CONTROLLER][EXCEPTION][" + e.getMessage() + "]");
			out = new OutResponse<>();
			out.setRCodigo(500);
			out.setRMensaje(e.getMessage());
		}
		log.info("[CARGA MASIVA CENTRO][CONTROLLER][FIN]");
		return out;
	}
	
	@PostMapping("/exportarListaCentroAtencionXlsx")
	public OutResponse<FileResponse> exportarListaCentroAtencionXlsx(@RequestBody CentroAtencionListarRequest c) {
		log.info("[EXPORTAR LISTA CENTRO ATENCION][CONTROLLER][INICIO]");
		OutResponse<FileResponse> out = centroAtencionService.exportarListaCentroAtencionXlsx(c);
		log.info("[EXPORTAR LISTA CENTRO ATENCION][CONTROLLER][FIN]");
		return out;
	}
	
	// API ADICIONAL PARA ACTUALIZAR TODOS LOS UBIGEOS DEL CENTRO DE ATENCION
	@PostMapping("/actUbigeosCentroAtencion")
	public OutResponse<?> actUbigeosCentroAtencion() {
		log.info("[ACTUALIZAR UBIGEO CENTRO ATENCION][CONTROLLER][INICIO]");
		OutResponse<?> out = centroAtencionService.actUbigeosCentroAtencion();
		log.info("[ACTUALIZAR UBIGEO ATENCION][CONTROLLER][FIN]");
		return out;
	}
}
