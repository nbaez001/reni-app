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
import pe.gob.mimp.reni.dto.request.BDCampoTablaListarRequest;
import pe.gob.mimp.reni.dto.request.BDCampoTablaRegistrarRequest;
import pe.gob.mimp.reni.dto.response.BDCampoTablaListarResponse;
import pe.gob.mimp.reni.dto.response.BDTablaListarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.service.AdministrarBDService;

@RestController
@RequestMapping("/administrar-bd")
@Api(value = "API Administrar BD")
public class AdministrarBDController {

	private static final Logger log = LoggerFactory.getLogger(AdministrarBDController.class);

	@Autowired
	AdministrarBDService administrarBDService;

	@PostMapping("/listarTablasBD")
	public OutResponse<List<BDTablaListarResponse>> listarTablasBD() {
		log.info("[LISTAR TABLAS BD][CONTROLLER][INICIO]");
		OutResponse<List<BDTablaListarResponse>> out = administrarBDService.listarTablasBD();
		log.info("[LISTAR TABLAS BD][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarCamposBD")
	public OutResponse<List<BDCampoTablaListarResponse>> listarCamposBD(@RequestBody BDCampoTablaListarRequest req) {
		log.info("[LISTAR CAMPOS BD][CONTROLLER][INICIO]");
		OutResponse<List<BDCampoTablaListarResponse>> out = administrarBDService.listarCamposBD(req);
		log.info("[LISTAR CAMPOS BD][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/registrarCampoBD")
	public OutResponse<?> registrarCamposBD(@RequestBody BDCampoTablaRegistrarRequest req) {
		log.info("[REGISTRAR CAMPO BD][CONTROLLER][INICIO]");
		OutResponse<?> out = administrarBDService.registrarCamposBD(req);
		log.info("[REGISTRAR CAMPO BD][CONTROLLER][FIN]");
		return out;
	}
}
