package pe.gob.mimp.reni.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pe.gob.mimp.reni.dao.UbigeoDao;
import pe.gob.mimp.reni.dto.request.UbigeoDistritoListarRequest;
import pe.gob.mimp.reni.dto.request.UbigeoDistritoListarXUbigeoRequest;
import pe.gob.mimp.reni.dto.request.UbigeoProvinciaListarRequest;
import pe.gob.mimp.reni.dto.request.UbigeoProvinciaListarXUbigeoRequest;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.UbigeoDepartamentoListarResponse;
import pe.gob.mimp.reni.dto.response.UbigeoDistritoListarResponse;
import pe.gob.mimp.reni.dto.response.UbigeoObtenerDescUbigeoResponse;
import pe.gob.mimp.reni.dto.response.UbigeoProvinciaListarResponse;
import pe.gob.mimp.reni.service.UbigeoService;

@Service
public class UbigeoServiceImpl implements UbigeoService {

	Logger log = LoggerFactory.getLogger(UbigeoServiceImpl.class);

	@Autowired
	UbigeoDao ubigeoDao;

	@Override
	public OutResponse<List<UbigeoDepartamentoListarResponse>> listarDepartamento() {
		log.info("[LISTAR DEPARTAMENTO][SERVICE][INICIO]");
		OutResponse<List<UbigeoDepartamentoListarResponse>> out = ubigeoDao.listarDepartamento();
		log.info("[LISTAR DEPARTAMENTO][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<List<UbigeoProvinciaListarResponse>> listarProvincia(UbigeoProvinciaListarRequest req) {
		log.info("[LISTAR PROVINCIA][SERVICE][INICIO]");
		OutResponse<List<UbigeoProvinciaListarResponse>> out = ubigeoDao.listarProvincia(req);
		log.info("[LISTAR PROVINCIA][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<List<UbigeoDistritoListarResponse>> listarDistrito(UbigeoDistritoListarRequest req) {
		log.info("[LISTAR DISTRITO][SERVICE][INICIO]");
		OutResponse<List<UbigeoDistritoListarResponse>> out = ubigeoDao.listarDistrito(req);
		log.info("[LISTAR DISTRITO][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<List<UbigeoProvinciaListarResponse>> listarProvinciaXUbigeo(
			UbigeoProvinciaListarXUbigeoRequest req) {
		log.info("[LISTAR PROVINCIA X UBIGEO][SERVICE][INICIO]");
		OutResponse<List<UbigeoProvinciaListarResponse>> out = ubigeoDao.listarProvinciaXUbigeo(req);
		log.info("[LISTAR PROVINCIA X UBIGEO][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<List<UbigeoDistritoListarResponse>> listarDistritoXUbigeo(
			UbigeoDistritoListarXUbigeoRequest req) {
		log.info("[LISTAR DISTRITO X UBIGEO][SERVICE][INICIO]");
		OutResponse<List<UbigeoDistritoListarResponse>> out = ubigeoDao.listarDistritoXUbigeo(req);
		log.info("[LISTAR DISTRITO X UBIGEO][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<UbigeoObtenerDescUbigeoResponse> obtenerDescripcionUbigeo(String req) {
		log.info("[OBTENER DESCRIPCION UBIGEO][SERVICE][INICIO]");
		OutResponse<UbigeoObtenerDescUbigeoResponse> out = ubigeoDao.obtenerDescripcionUbigeo(req);
		log.info("[OBTENER DESCRIPCION UBIGEO][SERVICE][FIN]");
		return out;
	}

}
