package pe.gob.mimp.reni.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pe.gob.mimp.reni.dao.FuncionalidadDao;
import pe.gob.mimp.reni.dto.request.FuncionalidadListarRequest;
import pe.gob.mimp.reni.dto.response.FuncionalidadListarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.service.FuncionalidadService;

@Service
public class FuncionalidadServiceImpl implements FuncionalidadService {

	private static final Logger log = LoggerFactory.getLogger(FuncionalidadServiceImpl.class);

	@Autowired
	FuncionalidadDao funcionalidadDao;

	@Override
	public OutResponse<List<FuncionalidadListarResponse>> listarFuncionalidad(FuncionalidadListarRequest req) {
		log.info("[LISTAR FUNCIONALIDAD][SERVICE][INICIO]");
		OutResponse<List<FuncionalidadListarResponse>> out = funcionalidadDao.listarFuncionalidad(req);
		List<FuncionalidadListarResponse> lista = out.getObjeto().stream()
				.filter(obj -> (obj.getIdFuncionalidadPadre() == null || obj.getIdFuncionalidadPadre() == 0L))
				.collect(Collectors.toList());

		for (FuncionalidadListarResponse p : lista) {
			List<FuncionalidadListarResponse> listaChild = out.getObjeto().stream()
					.filter(obj -> obj.getIdFuncionalidadPadre().equals(p.getIdFuncionalidad())).collect(Collectors.toList());
			p.setListaFuncionalidad(listaChild);
		}
		out.setObjeto(lista);
		log.info("[LISTAR FUNCIONALIDAD][SERVICE][FIN]");
		return out;
	}

}
