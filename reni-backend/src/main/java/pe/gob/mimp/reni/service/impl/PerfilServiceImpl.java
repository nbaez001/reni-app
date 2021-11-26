package pe.gob.mimp.reni.service.impl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pe.gob.mimp.reni.dao.PerfilDao;
import pe.gob.mimp.reni.dto.request.PerfilEliminarRequest;
import pe.gob.mimp.reni.dto.request.PerfilFuncionalidadListarRequest;
import pe.gob.mimp.reni.dto.request.PerfilFuncionalidadPerfListarRequest;
import pe.gob.mimp.reni.dto.request.PerfilListarRequest;
import pe.gob.mimp.reni.dto.request.PerfilModificarRequest;
import pe.gob.mimp.reni.dto.request.PerfilRegistrarRequest;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.PerfilFuncionalidadListarResponse;
import pe.gob.mimp.reni.dto.response.PerfilFuncionalidadPerfListarResponse;
import pe.gob.mimp.reni.dto.response.PerfilListarResponse;
import pe.gob.mimp.reni.dto.response.PerfilRegistrarResponse;
import pe.gob.mimp.reni.service.PerfilService;
import pe.gob.mimp.reni.util.ConstanteUtil;

@Service
public class PerfilServiceImpl implements PerfilService {

	private static final Logger log = LoggerFactory.getLogger(PerfilServiceImpl.class);

	@Autowired
	PerfilDao perfilDao;

	@Override
	public OutResponse<List<PerfilListarResponse>> listarPerfil(PerfilListarRequest req) {
		log.info("[LISTAR PERFIL][SERVICE][INICIO]");
		OutResponse<List<PerfilListarResponse>> out = perfilDao.listarPerfil(req);
		log.info("[LISTAR PERFIL][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<PerfilRegistrarResponse> registrarPerfil(PerfilRegistrarRequest req) {
		log.info("[REGISTRAR PERFIL][SERVICE][INICIO]");
		OutResponse<PerfilRegistrarResponse> out = perfilDao.registrarPerfil(req,
				listaDetFuncionalidadToString(req.getListaFuncionalidad()));
		log.info("[REGISTRAR PERFIL][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> modificarPerfil(PerfilModificarRequest req) {
		log.info("[MODIFICAR PERFIL][SERVICE][INICIO]");
		OutResponse<?> out = perfilDao.modificarPerfil(req, listaDetFuncionalidadToString(req.getListaFuncionalidad()),
				listaDetFuncionalidadToString(req.getListaFuncionalidadMod()));
		log.info("[MODIFICAR PERFIL][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> eliminarPerfil(PerfilEliminarRequest req) {
		log.info("[ELIMINAR PERFIL][SERVICE][INICIO]");
		OutResponse<?> out = perfilDao.eliminarPerfil(req);
		log.info("[ELIMINAR PERFIL][SERVICE][FIN]");
		return out;
	}

	public String listaDetFuncionalidadToString(List<Long> req) {
		log.info("[REGISTRAR PERFIL][SERVICE][CONVERSION DETALLE][INICIO]");
		String listaDetalle = "";
		if (req != null && req.size() > 0) {
			log.info("[REGISTRAR PERFIL][SERVICE][CONVERSION DETALLE][CANT:" + req.size() + "]");
			for (Long rc : req) {
				listaDetalle = listaDetalle + (rc != null ? rc : 0) + "|";
			}
			listaDetalle = listaDetalle.substring(0, listaDetalle.length() - 1);
			log.info("[REGISTRAR PERFIL][SERVICE][CONVERSION DETALLE][" + listaDetalle + "]");
		} else {
			log.info("[REGISTRAR PERFIL][SERVICE][CONVERSION DETALLE][CANT:" + ((req != null) ? req.size() : "NULL")
					+ "]");
		}
		return listaDetalle;
	}

	@Override
	public OutResponse<List<PerfilFuncionalidadListarResponse>> listarFuncionalidad(
			PerfilFuncionalidadListarRequest req) {
		log.info("[LISTAR FUNCIONALIDAD][SERVICE][INICIO]");
		OutResponse<List<PerfilFuncionalidadListarResponse>> out = perfilDao.listarFuncionalidad(req);
		List<PerfilFuncionalidadListarResponse> lista = out.getObjeto().stream()
				.filter(obj -> (obj.getIdFuncionalidadPadre() == null || obj.getIdFuncionalidadPadre() == 0L))
				.collect(Collectors.toList());

		for (PerfilFuncionalidadListarResponse p : lista) {
			List<PerfilFuncionalidadListarResponse> listaChild = out.getObjeto().stream()
					.filter(obj -> obj.getIdFuncionalidadPadre().equals(p.getIdFuncionalidad()))
					.collect(Collectors.toList());
			p.setListaFuncionalidad(listaChild);
		}
		out.setObjeto(lista);
		log.info("[LISTAR FUNCIONALIDAD][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<List<PerfilFuncionalidadPerfListarResponse>> listarFuncionalidadPerfil(
			PerfilFuncionalidadPerfListarRequest req) {
		log.info("[LISTAR FUNCIONALIDAD PERFIL][SERVICE][INICIO]");
		OutResponse<List<PerfilFuncionalidadPerfListarResponse>> out = perfilDao.listarFuncionalidadPerfil(req);
		List<PerfilFuncionalidadPerfListarResponse> lista = out.getObjeto().stream()
				.filter(obj -> (obj.getIdFuncionalidadPadre() == null || obj.getIdFuncionalidadPadre() == 0L))
				.collect(Collectors.toList());

		for (PerfilFuncionalidadPerfListarResponse p : lista) {
			List<PerfilFuncionalidadPerfListarResponse> listaChild = out.getObjeto().stream()
					.filter(obj -> obj.getIdFuncionalidadPadre().equals(p.getIdFuncionalidad()))
					.collect(Collectors.toList());
			p.setListaFuncionalidad(listaChild);
		}
		out.setObjeto(lista);
		log.info("[LISTAR FUNCIONALIDAD PERFIL][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<FileResponse> exportarListaPerfilXlsx(PerfilListarRequest c) {
		log.info("[EXPORTAR LISTA PERFIL][SERVICE][INICIO]");
		OutResponse<List<PerfilListarResponse>> out = perfilDao.listarPerfil(c);

		OutResponse<FileResponse> outF = new OutResponse<>();
		if (out.getRCodigo() == ConstanteUtil.R_COD_EXITO) {
			try {
				String[] columns = { "Nro", "Nombre", "Estado" };
				int[] anchoColumns = { 1500, 10000, 4000 };

				Workbook workbook = new HSSFWorkbook();
				ByteArrayOutputStream stream = new ByteArrayOutputStream();

				Sheet sheet = workbook.createSheet("Perfiles");
				Row row = sheet.createRow(0);

				for (int i = 0; i < columns.length; i++) {
					Cell cell = row.createCell(i);
					cell.setCellValue(columns[i]);
					sheet.setColumnWidth(i, anchoColumns[i]);
				}

				int cont = 1;
				for (PerfilListarResponse obj : out.getObjeto()) {
					row = sheet.createRow(cont);
					row.createCell(0).setCellValue(cont);
					row.createCell(1).setCellValue(obj.getNombre());
					row.createCell(2)
							.setCellValue(obj.getFlgActivo() == ConstanteUtil.FLG_ACTVO ? ConstanteUtil.DESC_ACTIVO
									: ConstanteUtil.DESC_INACTIVO);
					cont++;
				}
				workbook.write(stream);
				workbook.close();

				FileResponse resp = new FileResponse();
				resp.setNombre("Lista Perfiles.xls");
				resp.setType("application/vnd.ms-excel");
				resp.setData(stream.toByteArray());

				outF.setRCodigo(0);
				outF.setRMensaje("EXITO");
				outF.setObjeto(resp);
			} catch (IOException e) {
				log.info(ExceptionUtils.getStackTrace(e));
				outF.setRCodigo(500);
				outF.setRMensaje(e.getMessage());
			}
		} else {
			outF.setRCodigo(out.getRCodigo());
			outF.setRMensaje(out.getRMensaje());
		}
		log.info("[EXPORTAR LISTA PERFIL][SERVICE][FIN]");
		return outF;
	}
}
