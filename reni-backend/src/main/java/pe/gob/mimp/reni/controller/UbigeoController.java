package pe.gob.mimp.reni.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pe.gob.mimp.reni.dto.request.UbigeoDistritoListarRequest;
import pe.gob.mimp.reni.dto.request.UbigeoDistritoListarXUbigeoRequest;
import pe.gob.mimp.reni.dto.request.UbigeoProvinciaListarRequest;
import pe.gob.mimp.reni.dto.request.UbigeoProvinciaListarXUbigeoRequest;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.UbigeoDepartamentoListarResponse;
import pe.gob.mimp.reni.dto.response.UbigeoDistritoListarResponse;
import pe.gob.mimp.reni.dto.response.UbigeoProvinciaListarResponse;
import pe.gob.mimp.reni.service.UbigeoService;

import io.swagger.annotations.Api;

@RestController
@RequestMapping("/ubigeo")
@Api(value = "API Ubigeo")
public class UbigeoController {

	private static final Logger log = LoggerFactory.getLogger(UbigeoController.class);

	@Autowired
	UbigeoService ubigeoService;

	@PostMapping("/listarDepartamento")
	public OutResponse<List<UbigeoDepartamentoListarResponse>> listarDepartamento() {
		log.info("[LISTAR DEPARTAMENTO][CONTROLLER][INICIO]");
		OutResponse<List<UbigeoDepartamentoListarResponse>> out = ubigeoService.listarDepartamento();
		log.info("[LISTAR DEPARTAMENTO][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarProvincia")
	public OutResponse<List<UbigeoProvinciaListarResponse>> listarProvincia(
			@RequestBody UbigeoProvinciaListarRequest req) {
		log.info("[LISTAR PROVINCIA][CONTROLLER][INICIO]");
		OutResponse<List<UbigeoProvinciaListarResponse>> out = ubigeoService.listarProvincia(req);
		log.info("[LISTAR PROVINCIA][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarDistrito")
	public OutResponse<List<UbigeoDistritoListarResponse>> listarDistrito(
			@RequestBody UbigeoDistritoListarRequest req) {
		log.info("[LISTAR DISTRITO][CONTROLLER][INICIO]");
		OutResponse<List<UbigeoDistritoListarResponse>> out = ubigeoService.listarDistrito(req);
		log.info("[LISTAR DISTRITO][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarProvinciaXUbigeo")
	public OutResponse<List<UbigeoProvinciaListarResponse>> listarProvinciaXUbigeo(
			@RequestBody UbigeoProvinciaListarXUbigeoRequest req) {
		log.info("[LISTAR PROVINCIA X UBIGEO][CONTROLLER][INICIO]");
		OutResponse<List<UbigeoProvinciaListarResponse>> out = ubigeoService.listarProvinciaXUbigeo(req);
		log.info("[LISTAR PROVINCIA X UBIGEO][CONTROLLER][FIN]");
		return out;
	}

	@PostMapping("/listarDistritoXUbigeo")
	public OutResponse<List<UbigeoDistritoListarResponse>> listarDistritoXUbigeo(
			@RequestBody UbigeoDistritoListarXUbigeoRequest req) {
		log.info("[LISTAR DISTRITO X UBIGEO][CONTROLLER][INICIO]");
		OutResponse<List<UbigeoDistritoListarResponse>> out = ubigeoService.listarDistritoXUbigeo(req);
		log.info("[LISTAR DISTRITO X UBIGEO][CONTROLLER][FIN]");
		return out;
	}
}
