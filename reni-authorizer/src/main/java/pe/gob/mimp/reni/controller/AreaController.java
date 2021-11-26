package pe.gob.mimp.reni.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pe.gob.mimp.reni.dto.request.AreaBuscarRequest;
import pe.gob.mimp.reni.dto.request.AreaListarRequest;
import pe.gob.mimp.reni.dto.response.AreaBuscarResponse;
import pe.gob.mimp.reni.dto.response.AreaListarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.service.AreaService;

@RestController
@RequestMapping("/area")
public class AreaController {

	private static final Logger log = LoggerFactory.getLogger(AreaController.class);

	@Autowired
	AreaService areaService;

	@PostMapping("/listarArea")
	public OutResponse<List<AreaListarResponse>> listarArea(@RequestBody AreaListarRequest req) {
		log.info("[LISTAR AREA][CONTROLLER][INICIO]");
		OutResponse<List<AreaListarResponse>> out = areaService.listarArea(req);
		log.info("[LISTAR AREA][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/buscarArea")
	public OutResponse<AreaBuscarResponse> buscarArea(@RequestBody AreaBuscarRequest req) {
		log.info("[BUSCAR AREA][CONTROLLER][INICIO]");
		OutResponse<AreaBuscarResponse> out = areaService.buscarArea(req);
		log.info("[BUSCAR AREA][CONTROLLER][FIN]");
		return out;
	}
}
