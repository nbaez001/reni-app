package pe.gob.mimp.reni.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pe.gob.mimp.reni.dao.AdministrarBDDao;
import pe.gob.mimp.reni.dto.request.BDCampoTablaListarRequest;
import pe.gob.mimp.reni.dto.request.BDCampoTablaRegistrarRequest;
import pe.gob.mimp.reni.dto.response.BDCampoTablaListarResponse;
import pe.gob.mimp.reni.dto.response.BDTablaListarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.service.AdministrarBDService;

@Service
public class AdministrarBDServiceImpl implements AdministrarBDService {

	private static final Logger log = LoggerFactory.getLogger(AdministrarBDServiceImpl.class);

	@Autowired
	AdministrarBDDao administrarBDDao;

	@Override
	public OutResponse<List<BDTablaListarResponse>> listarTablasBD() {
		log.info("[LISTAR TABLAS BD][SERVICE][INICIO]");
		OutResponse<List<BDTablaListarResponse>> out = administrarBDDao.listarTablasBD();
		log.info("[LISTAR TABLAS BD][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<List<BDCampoTablaListarResponse>> listarCamposBD(BDCampoTablaListarRequest req) {
		log.info("[LISTAR CAMPOS BD][SERVICE][INICIO]");
		OutResponse<List<BDCampoTablaListarResponse>> out = administrarBDDao.listarCamposBD(req);
		log.info("[LISTAR CAMPOS BD][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> registrarCamposBD(BDCampoTablaRegistrarRequest req) {
		log.info("[REGISTRAR CAMPO BD][SERVICE][INICIO]");
		OutResponse<?> out = administrarBDDao.registrarCamposBD(req);
		log.info("[REGISTRAR CAMPO BD][SERVICE][FIN]");
		return out;
	}

}
