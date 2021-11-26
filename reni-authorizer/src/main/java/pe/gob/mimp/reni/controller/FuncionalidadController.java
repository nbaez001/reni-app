package pe.gob.mimp.reni.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pe.gob.mimp.reni.dto.request.FuncionalidadListarRequest;
import pe.gob.mimp.reni.dto.response.FuncionalidadListarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.service.FuncionalidadService;

@RestController
@RequestMapping("/funcionalidad")
public class FuncionalidadController {

	private static final Logger log = LoggerFactory.getLogger(FuncionalidadController.class);

	@Autowired
	FuncionalidadService funcionalidadService;

	@PostMapping("/listarFuncionalidad")
	public OutResponse<List<FuncionalidadListarResponse>> listarFuncionalidad(@RequestBody FuncionalidadListarRequest req) {
		log.info("[LISTAR FUNCIONALIDAD][CONTROLLER][INICIO]");
		OutResponse<List<FuncionalidadListarResponse>> out = funcionalidadService.listarFuncionalidad(req);
		log.info("[LISTAR FUNCIONALIDAD][CONTROLLER][FIN]");
		return out;
	}
}
