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
import pe.gob.mimp.reni.service.MaestraService;

@RestController
@RequestMapping("/maestra")
@Api(value = "API Maestra")
public class MaestraController {

	private static final Logger log = LoggerFactory.getLogger(MaestraController.class);

	@Autowired
	MaestraService maestraService;

	@PostMapping("/listarMaestra")
	public OutResponse<List<MaestraListarResponse>> listarMaestra(@RequestBody MaestraListarRequest req) {
		log.info("[LISTAR MAESTRA][CONTROLLER][INICIO]");
		OutResponse<List<MaestraListarResponse>> out = maestraService.listarMaestra(req);
		log.info("[LISTAR MAESTRA][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/registrarMaestra")
	public OutResponse<MaestraRegistrarResponse> registrarMaestra(@RequestBody MaestraRegistrarRequest req) {
		log.info("[REGISTRAR MAESTRA][CONTROLLER][INICIO]");
		OutResponse<MaestraRegistrarResponse> out = maestraService.registrarMaestra(req);
		log.info("[REGISTRAR MAESTRA][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/modificarMaestra")
	public OutResponse<?> modificarMaestra(@RequestBody MaestraModificarRequest req) {
		log.info("[MODIFICAR MAESTRA][CONTROLLER][INICIO]");
		OutResponse<?> out = maestraService.modificarMaestra(req);
		log.info("[MODIFICAR MAESTRA][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/eliminarMaestra")
	public OutResponse<?> eliminarMaestra(@RequestBody MaestraEliminarRequest req) {
		log.info("[ELIMINAR MAESTRA][CONTROLLER][INICIO]");
		OutResponse<?> out = maestraService.eliminarMaestra(req);
		log.info("[ELIMINAR MAESTRA][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarMaestraSubitem")
	public OutResponse<List<MaestraSubitemListarResponse>> listarMaestraSubitem(
			@RequestBody MaestraSubitemListarRequest req) {
		log.info("[LISTAR MAESTRA SUBITEM][CONTROLLER][INICIO]");
		OutResponse<List<MaestraSubitemListarResponse>> out = maestraService.listarMaestraSubitem(req);
		log.info("[LISTAR MAESTRA SUBITEM][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/registrarMaestraSubitem")
	public OutResponse<MaestraSubitemRegistrarResponse> registrarMaestraSubitem(
			@RequestBody MaestraSubitemRegistrarRequest req) {
		log.info("[REGISTRAR MAESTRA SUBITEM][CONTROLLER][INICIO]");
		OutResponse<MaestraSubitemRegistrarResponse> out = maestraService.registrarMaestraSubitem(req);
		log.info("[REGISTRAR MAESTRA SUBITEM][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/modificarMaestraSubitem")
	public OutResponse<?> modificarMaestraSubitem(@RequestBody MaestraSubitemModificarRequest req) {
		log.info("[MODIFICAR MAESTRA SUBITEM][CONTROLLER][INICIO]");
		OutResponse<?> out = maestraService.modificarMaestraSubitem(req);
		log.info("[MODIFICAR MAESTRA SUBITEM][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/eliminarMaestraSubitem")
	public OutResponse<?> eliminarMaestraSubitem(@RequestBody MaestraSubitemEliminarRequest req) {
		log.info("[ELIMINAR MAESTRA SUBITEM][CONTROLLER][INICIO]");
		OutResponse<?> out = maestraService.eliminarMaestraSubitem(req);
		log.info("[ELIMINAR MAESTRA SUBITEM][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/exportarListaMaestraXlsx")
	public OutResponse<FileResponse> exportarListaMaestraXlsx(@RequestBody MaestraListarExportRequest c) {
		log.info("[EXPORTAR LISTA MAESTRA][CONTROLLER][INICIO]");
		OutResponse<FileResponse> out = maestraService.exportarListaMaestraXlsx(c);
		log.info("[EXPORTAR LISTA MAESTRA][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarMaestraCargaMasiva")
	public OutResponse<List<MaestraCargaMasivaListarMaeResponse>> listarMaestraCargaMasiva(
			@RequestBody MaestraCargaMasivaListarMaeRequest req) {
		log.info("[LISTAR MAESTRA CARGA MASIVA][CONTROLLER][INICIO]");
		OutResponse<List<MaestraCargaMasivaListarMaeResponse>> out = maestraService.listarMaestraCargaMasiva(req);
		log.info("[LISTAR MAESTRA CARGA MASIVA][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/cargaMasivaMaestras")
	public OutResponse<?> cargaMasivaMaestras(@RequestBody MaestraCargaMasivaRequest req) {
		log.info("[CARGA MASIVA MAESTRAS][CONTROLLER][INICIO]");
		OutResponse<?> out;
		try {
			out = maestraService.cargaMasivaMaestras(req);
			log.info("[CARGA MASIVA MAESTRAS][CONTROLLER][EXITO]");
		} catch (Exception e) {
			log.info("[CARGA MASIVA MAESTRAS][CONTROLLER][EXCEPTION][" + e.getMessage() + "]");
			out = new OutResponse<>();
			out.setRCodigo(500);
			out.setRMensaje(e.getMessage());
		}
		log.info("[CARGA MASIVA MAESTRAS][CONTROLLER][FIN]");
		return out;
	}
}
