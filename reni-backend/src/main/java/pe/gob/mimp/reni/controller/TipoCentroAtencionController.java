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
import pe.gob.mimp.reni.dto.request.SubtipoCentroEliminarRequest;
import pe.gob.mimp.reni.dto.request.SubtipoCentroListarRequest;
import pe.gob.mimp.reni.dto.request.SubtipoCentroModificarRequest;
import pe.gob.mimp.reni.dto.request.SubtipoCentroRegistrarRequest;
import pe.gob.mimp.reni.dto.request.TipoCentroEliminarRequest;
import pe.gob.mimp.reni.dto.request.TipoCentroListarRequest;
import pe.gob.mimp.reni.dto.request.TipoCentroModificarRequest;
import pe.gob.mimp.reni.dto.request.TipoCentroRegistrarRequest;
import pe.gob.mimp.reni.dto.response.TipoCentroListarResponse;
import pe.gob.mimp.reni.dto.response.TipoCentroRegistrarResponse;
import pe.gob.mimp.reni.service.TipoCentroAtencionService;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.SubtipoCentroListarResponse;
import pe.gob.mimp.reni.dto.response.SubtipoCentroRegistrarResponse;

@RestController
@RequestMapping("/tipo-centro")
@Api(value = "API Tipo centro")
public class TipoCentroAtencionController {

	private static final Logger log = LoggerFactory.getLogger(TipoCentroAtencionController.class);

	@Autowired
	TipoCentroAtencionService tipoCentroAtencionService;

	@PostMapping("/listarTipoCentro")
	public OutResponse<List<TipoCentroListarResponse>> listarTipoCentro(@RequestBody TipoCentroListarRequest req) {
		log.info("[LISTAR TIPO CENTRO ATENCION][CONTROLLER][INICIO]");
		OutResponse<List<TipoCentroListarResponse>> out = tipoCentroAtencionService.listarTipoCentro(req);
		log.info("[LISTAR TIPO CENTRO ATENCION][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/registrarTipoCentro")
	public OutResponse<TipoCentroRegistrarResponse> registrarTipoCentro(@RequestBody TipoCentroRegistrarRequest req) {
		log.info("[REGISTRAR TIPO CENTRO ATENCION][CONTROLLER][INICIO]");
		OutResponse<TipoCentroRegistrarResponse> out = tipoCentroAtencionService.registrarTipoCentro(req);
		log.info("[REGISTRAR TIPO CENTRO ATENCION][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/modificarTipoCentro")
	public OutResponse<?> modificarTipoCentro(@RequestBody TipoCentroModificarRequest req) {
		log.info("[MODIFICAR TIPO CENTRO ATENCION][CONTROLLER][INICIO]");
		OutResponse<?> out = tipoCentroAtencionService.modificarTipoCentro(req);
		log.info("[MODIFICAR TIPO CENTRO ATENCION][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/eliminarTipoCentro")
	public OutResponse<?> eliminarTipoCentro(@RequestBody TipoCentroEliminarRequest req) {
		log.info("[ELIMINAR TIPO CENTRO ATENCION][CONTROLLER][INICIO]");
		OutResponse<?> out = tipoCentroAtencionService.eliminarTipoCentro(req);
		log.info("[ELIMINAR TIPO CENTRO ATENCION][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/exportarListaTipoCentroXlsx")
	public OutResponse<FileResponse> exportarListaTipoCentroXlsx(@RequestBody TipoCentroListarRequest c) {
		log.info("[EXPORTAR LISTA TIPO CENTRO ATENCION][CONTROLLER][INICIO]");
		OutResponse<FileResponse> out = tipoCentroAtencionService.exportarListaTipoCentroXlsx(c);
		log.info("[EXPORTAR LISTA TIPO CENTRO ATENCION][CONTROLLER][FIN]");
		return out;
	}
	
	@PostMapping("/listarSubtipoCentro")
	public OutResponse<List<SubtipoCentroListarResponse>> listarSubtipoCentro(@RequestBody SubtipoCentroListarRequest req) {
		log.info("[LISTAR SUBTIPO CENTRO ATENCION][CONTROLLER][INICIO]");
		OutResponse<List<SubtipoCentroListarResponse>> out = tipoCentroAtencionService.listarSubtipoCentro(req);
		log.info("[LISTAR SUBTIPO CENTRO ATENCION][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/registrarSubtipoCentro")
	public OutResponse<SubtipoCentroRegistrarResponse> registrarSubtipoCentro(@RequestBody SubtipoCentroRegistrarRequest req) {
		log.info("[REGISTRAR SUBTIPO CENTRO ATENCION][CONTROLLER][INICIO]");
		OutResponse<SubtipoCentroRegistrarResponse> out = tipoCentroAtencionService.registrarSubtipoCentro(req);
		log.info("[REGISTRAR SUBTIPO CENTRO ATENCION][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/modificarSubtipoCentro")
	public OutResponse<?> modificarSubtipoCentro(@RequestBody SubtipoCentroModificarRequest req) {
		log.info("[MODIFICAR SUBTIPO CENTRO ATENCION][CONTROLLER][INICIO]");
		OutResponse<?> out = tipoCentroAtencionService.modificarSubtipoCentro(req);
		log.info("[MODIFICAR SUBTIPO CENTRO ATENCION][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/eliminarSubtipoCentro")
	public OutResponse<?> eliminarSubtipoCentro(@RequestBody SubtipoCentroEliminarRequest req) {
		log.info("[ELIMINAR SUBTIPO CENTRO ATENCION][CONTROLLER][INICIO]");
		OutResponse<?> out = tipoCentroAtencionService.eliminarSubtipoCentro(req);
		log.info("[ELIMINAR SUBTIPO CENTRO ATENCION][CONTROLLER][FIN]");
		return out;
	}
}
