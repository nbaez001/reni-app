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
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.service.EdneService;

@RestController
@RequestMapping("/edne")
@Api(value = "API Edne")
public class EdneController {

	private static final Logger log = LoggerFactory.getLogger(EdneController.class);

	@Autowired
	EdneService edneService;

	@PostMapping("/listarEdne")
	public OutResponse<List<EdneListarResponse>> listarEdne(@RequestBody EdneListarRequest req) {
		log.info("[LISTAR EDNE][CONTROLLER][INICIO]");
		OutResponse<List<EdneListarResponse>> out = edneService.listarEdne(req);
		log.info("[LISTAR EDNE][CONTROLLER][FIN]");
		return out;
	}

//	@PostMapping("/registrarEdne")
//	public OutResponse<EdneRegistrarResponse> registrarEdne(@RequestBody EdneRegistrarRequest req) {
//		log.info("[REGISTRAR EDNE][CONTROLLER][INICIO]");
//		OutResponse<EdneRegistrarResponse> out = edneService.registrarEdne(req);
//		log.info("[REGISTRAR EDNE][CONTROLLER][FIN]");
//		return out;
//	}

	@PostMapping("/registrarEdne")
	public OutResponse<?> registrarEdne(@RequestBody EdneRegistrarRequest req) {
		log.info("[REGISTRAR EDNE][CONTROLLER][INICIO]");
		OutResponse<?> out;
		try {
			out = edneService.registrarEdne(req);
			log.info("[REGISTRAR EDNE][CONTROLLER][EXITO]");
		} catch (Exception e) {
			log.info("[REGISTRAR EDNE][CONTROLLER][EXCEPTION][" + e.getMessage() + "]");
			out = new OutResponse<>();
			out.setRCodigo(500);
			out.setRMensaje(e.getMessage());
		}
		log.info("[REGISTRAR EDNE][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/modificarEdne")
	public OutResponse<?> modificarEdne(@RequestBody EdneModificarRequest req) {
		log.info("[MODIFICAR EDNE][CONTROLLER][INICIO]");
		OutResponse<?> out = edneService.modificarEdne(req);
		log.info("[MODIFICAR EDNE][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/eliminarEdne")
	public OutResponse<?> eliminarEdne(@RequestBody EdneEliminarRequest req) {
		log.info("[ELIMINAR EDNE][CONTROLLER][INICIO]");
		OutResponse<?> out = edneService.eliminarEdne(req);
		log.info("[ELIMINAR EDNE][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarParamEstructura")
	public OutResponse<List<EdneListarParamEstructuraResponse>> listarParamEstructura(
			@RequestBody EdneListarParamEstructuraRequest req) {
		log.info("[LISTAR PARAMETRO ESTRUCTURA][CONTROLLER][INICIO]");
		OutResponse<List<EdneListarParamEstructuraResponse>> out = edneService.listarParamEstructura(req);
		log.info("[LISTAR PARAMETRO ESTRUCTURA][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarUsuarioXCodigo")
	public OutResponse<List<EdneListarUsuarioXCodigoResponse>> listarUsuarioXCodigo(
			@RequestBody EdneListarUsuarioXCodigoRequest req) {
		log.info("[LISTAR USUARIO X CODIGO][CONTROLLER][INICIO]");
		OutResponse<List<EdneListarUsuarioXCodigoResponse>> out = edneService.listarUsuarioXCodigo(req);
		log.info("[LISTAR USUARIO X CODIGO][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarUsuarioXDocumento")
	public OutResponse<List<EdneListarUsuarioXDocumentoResponse>> listarUsuarioXDocumento(
			@RequestBody EdneListarUsuarioXDocumentoRequest req) {
		log.info("[LISTAR USUARIO X DOCUMENTO][CONTROLLER][INICIO]");
		OutResponse<List<EdneListarUsuarioXDocumentoResponse>> out = edneService.listarUsuarioXDocumento(req);
		log.info("[LISTAR USUARIO X DOCUMENTO][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarUsuariosEdne")
	public OutResponse<List<Map<String, Object>>> listarUsuariosEdne(
			@RequestBody EdneModificarListarUsuarioRequest req) {
		log.info("[LISTAR USUARIOS EDNE][CONTROLLER][INICIO]");
		OutResponse<List<Map<String, Object>>> out = edneService.listarUsuariosEdne(req);
		log.info("[LISTAR USUARIOS EDNE][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/exportarListaEdneXlsx")
	public OutResponse<FileResponse> exportarListaEdneXlsx(@RequestBody EdneListarRequest c) {
		log.info("[EXPORTAR LISTA EDNE][CONTROLLER][INICIO]");
		OutResponse<FileResponse> out = edneService.exportarListaEdneXlsx(c);
		log.info("[EXPORTAR LISTA EDNE][CONTROLLER][FIN]");
		return out;
	}
	
	@PostMapping("/descargarPlantillaRENEXlsx")
	public OutResponse<FileResponse> descargarPlantillaRENEXlsx(@RequestBody EdneDescargarPlantillaRequest c) {
		log.info("[DESCARGAR PLANTILLA RENE][CONTROLLER][INICIO]");
		OutResponse<FileResponse> out = edneService.descargarPlantillaRENEXlsx(c);
		log.info("[DESCARGAR PLANTILLA RENE][CONTROLLER][FIN]");
		return out;
	}
}
