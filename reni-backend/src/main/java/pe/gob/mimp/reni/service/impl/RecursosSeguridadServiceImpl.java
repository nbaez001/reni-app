package pe.gob.mimp.reni.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pe.gob.mimp.reni.dao.RecursosSeguridadDao;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.RecursosSeguridadListarCargoResponse;
import pe.gob.mimp.reni.dto.response.RecursosSeguridadListarTipoDocumResponse;
import pe.gob.mimp.reni.service.RecursosSeguridadService;

@Service
public class RecursosSeguridadServiceImpl implements RecursosSeguridadService {

	private static final Logger log = LoggerFactory.getLogger(RecursosSeguridadServiceImpl.class);

	@Autowired
	RecursosSeguridadDao recursosSeguridadDao;

	@Override
	public OutResponse<List<RecursosSeguridadListarTipoDocumResponse>> listarTipoDocumento() {
		log.info("[LISTAR TIPO DOCUMENTO][SERVICE][INICIO]");
		OutResponse<List<RecursosSeguridadListarTipoDocumResponse>> out = recursosSeguridadDao.listarTipoDocumento();
		log.info("[LISTAR TIPO DOCUMENTO][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<List<RecursosSeguridadListarCargoResponse>> listarCargo() {
		log.info("[LISTAR CARGO][SERVICE][INICIO]");
		OutResponse<List<RecursosSeguridadListarCargoResponse>> out = recursosSeguridadDao.listarCargo();
		log.info("[LISTAR CARGO][SERVICE][FIN]");
		return out;
	}

}
