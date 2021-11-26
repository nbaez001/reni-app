package pe.gob.mimp.reni.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pe.gob.mimp.reni.dao.AreaDao;
import pe.gob.mimp.reni.dto.request.AreaBuscarRequest;
import pe.gob.mimp.reni.dto.request.AreaListarRequest;
import pe.gob.mimp.reni.dto.response.AreaBuscarResponse;
import pe.gob.mimp.reni.dto.response.AreaListarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.service.AreaService;

@Service
public class AreaServiceImpl implements AreaService {

	private static final Logger log = LoggerFactory.getLogger(AreaServiceImpl.class);

	@Autowired
	AreaDao areaDao;

	@Override
	public OutResponse<List<AreaListarResponse>> listarArea(AreaListarRequest req) {
		log.info("[LISTAR AREA][SERVICE][INICIO]");
		OutResponse<List<AreaListarResponse>> out = areaDao.listarArea(req);
		log.info("[LISTAR AREA][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<AreaBuscarResponse> buscarArea(AreaBuscarRequest req) {
		log.info("[BUSCAR AREA][SERVICE][INICIO]");
		OutResponse<AreaBuscarResponse> out = areaDao.buscarArea(req);
		log.info("[BUSCAR AREA][SERVICE][FIN]");
		return out;
	}

}
