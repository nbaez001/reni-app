package pe.gob.mimp.reni.service.impl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

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
import org.springframework.transaction.annotation.Transactional;

import pe.gob.mimp.reni.dao.EstructuraDao;
import pe.gob.mimp.reni.dto.request.EstructuraBuscarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraEliminarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraListarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraModificarParametroRequest;
import pe.gob.mimp.reni.dto.request.EstructuraModificarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraParametroListarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraRegistrarParametroRequest;
import pe.gob.mimp.reni.dto.request.EstructuraRegistrarRequest;
import pe.gob.mimp.reni.dto.response.EstructuraBuscarResponse;
import pe.gob.mimp.reni.dto.response.EstructuraListarResponse;
import pe.gob.mimp.reni.dto.response.EstructuraParametroListarResponse;
import pe.gob.mimp.reni.dto.response.EstructuraRegistrarResponse;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.service.EstructuraService;
import pe.gob.mimp.reni.util.ConstanteUtil;
import pe.gob.mimp.reni.util.StringUtil;

@Service
public class EstructuraServiceImpl implements EstructuraService {

	private static final Logger log = LoggerFactory.getLogger(EstructuraServiceImpl.class);

	@Autowired
	EstructuraDao estructuraDao;

	@Override
	public OutResponse<List<EstructuraListarResponse>> listarEstructura(EstructuraListarRequest req) {
		log.info("[LISTAR ESTRUCTURA][SERVICE][INICIO]");
		OutResponse<List<EstructuraListarResponse>> out = estructuraDao.listarEstructura(req);
		log.info("[LISTAR ESTRUCTURA][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<EstructuraRegistrarResponse> registrarEstructura(EstructuraRegistrarRequest req) {
		log.info("[REGISTRAR ESTRUCTURA][SERVICE][INICIO]");
		OutResponse<EstructuraRegistrarResponse> out = estructuraDao.registrarEstructura(req,
				listaParametrosToString(req.getListaParametro()), req.getListaParametro().size());
		log.info("[REGISTRAR ESTRUCTURA][SERVICE][FIN]");
		return out;
	}

	@Override
	@Transactional(rollbackFor = { Exception.class })
	public OutResponse<?> modificarEstructura(EstructuraModificarRequest req) throws Exception {
		log.info("[MODIFICAR ESTRUCTURA][SERVICE][INICIO]");
		OutResponse<?> out = estructuraDao.modificarEstructura(req);

		for (EstructuraRegistrarParametroRequest parNuv : req.getListaParametro()) {
			estructuraDao.registrarParametro(parNuv, req.getIdEstructura(), req.getIdUsuarioModif());
		}

		for (EstructuraModificarParametroRequest parMod : req.getListaParametroMod()) {
			estructuraDao.modificarParametro(parMod, req.getIdUsuarioModif());
		}

		for (Long parElim : req.getListaParametroElim()) {
			estructuraDao.eliminarParametro(parElim, req.getIdUsuarioModif());
		}

		log.info("[MODIFICAR ESTRUCTURA][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> eliminarEstructura(EstructuraEliminarRequest req) {
		log.info("[ELIMINAR ESTRUCTURA][SERVICE][INICIO]");
		OutResponse<?> out = estructuraDao.eliminarEstructura(req);
		log.info("[ELIMINAR ESTRUCTURA][SERVICE][FIN]");
		return out;
	}

	public String listaParametrosToString(List<EstructuraRegistrarParametroRequest> req) {
		log.info("[REGISTRAR/MODIFICAR ESTRUCTURA][SERVICE][CONVERSION DETALLE][INICIO]");
		String listaEstructura = "";
		if (req.size() > 0) {
			log.info("[REGISTRAR/MODIFICAR ESTRUCTURA][SERVICE][CONVERSION DETALLE][CANT:" + req.size() + "]");
			for (EstructuraRegistrarParametroRequest rc : req) {
				listaEstructura = listaEstructura
						+ ((!StringUtil.isNullOrBlank(rc.getNomCampoExcel())) ? rc.getNomCampoExcel() : "(NULL)") + "#"
						+ ((rc.getOrdenCampoExcel() != null) ? rc.getOrdenCampoExcel() : "(NULL)") + "#"
						+ ((!StringUtil.isNullOrBlank(rc.getNomTablaBd())) ? rc.getNomTablaBd() : "(NULL)") + "#"
						+ ((!StringUtil.isNullOrBlank(rc.getNomCampoBd())) ? rc.getNomCampoBd() : "(NULL)") + "#"
						+ ((rc.getCampoEsFk() != null) ? rc.getCampoEsFk() : "(NULL)") + "#"
						+ ((!StringUtil.isNullOrBlank(rc.getCampoIdmaestra())) ? rc.getCampoIdmaestra() : "(NULL)")
						+ "#" + ((!StringUtil.isNullOrBlank(rc.getDescripcion())) ? rc.getDescripcion() : "(NULL)")
						+ "|";
			}
			listaEstructura = listaEstructura.substring(0, listaEstructura.length() - 1);
			log.info("[REGISTRAR/MODIFICAR ESTRUCTURA][SERVICE][CONVERSION DETALLE][" + listaEstructura + "]");
		} else {
			log.info("[REGISTRAR/MODIFICAR ESTRUCTURA][SERVICE][CONVERSION DETALLE][CANT:" + req.size() + "]");
		}
		return listaEstructura;
	}

//	public String listaParametrosModifToString(List<EstructuraModificarParametroRequest> req) {
//		log.info("[MODIFICAR ESTRUCTURA][SERVICE][CONVERSION DETALLE][INICIO]");
//		String listaEstructura = "";
//		if (req.size() > 0) {
//			log.info("[MODIFICAR ESTRUCTURA][SERVICE][CONVERSION DETALLE][CANT:" + req.size() + "]");
//			for (EstructuraModificarParametroRequest rc : req) {
//				listaEstructura = listaEstructura + ((rc.getIdParametro() != null) ? rc.getIdParametro() : "(NULL)")
//						+ "#" + ((!StringUtil.isNullOrBlank(rc.getNomCampoExcel())) ? rc.getNomCampoExcel() : "(NULL)")
//						+ "#" + ((rc.getOrdenCampoExcel() != null) ? rc.getOrdenCampoExcel() : "(NULL)") + "#"
//						+ ((!StringUtil.isNullOrBlank(rc.getNomTablaBd())) ? rc.getNomTablaBd() : "(NULL)") + "#"
//						+ ((!StringUtil.isNullOrBlank(rc.getNomCampoBd())) ? rc.getNomCampoBd() : "(NULL)") + "#"
//						+ ((rc.getCampoEsFk() != null) ? rc.getCampoEsFk() : "(NULL)") + "#"
//						+ ((!StringUtil.isNullOrBlank(rc.getCampoIdmaestra())) ? rc.getCampoIdmaestra() : "(NULL)")
//						+ "#" + ((!StringUtil.isNullOrBlank(rc.getDescripcion())) ? rc.getDescripcion() : "(NULL)")
//						+ "|";
//			}
//			listaEstructura = listaEstructura.substring(0, listaEstructura.length() - 1);
//			log.info("[MODIFICAR ESTRUCTURA][SERVICE][CONVERSION DETALLE][" + listaEstructura + "]");
//		} else {
//			log.info("[MODIFICAR ESTRUCTURA][SERVICE][CONVERSION DETALLE][CANT:" + req.size() + "]");
//		}
//		return listaEstructura;
//	}

//	public String listaParametrosElimToString(List<Long> req) {
//		log.info("[MODIFICAR ESTRUCTURA][SERVICE][CONVERSION DETALLE ELIMINAR][INICIO]");
//		String listaEstructura = "";
//		if (req.size() > 0) {
//			log.info("[MODIFICAR ESTRUCTURA][SERVICE][CONVERSION DETALLE ELIMINAR][CANT:" + req.size() + "]");
//			for (Long rc : req) {
//				listaEstructura = listaEstructura + ((rc != null) ? rc : "") + "#";
//			}
//			listaEstructura = listaEstructura.substring(0, listaEstructura.length() - 1);
//			log.info("[MODIFICAR ESTRUCTURA][SERVICE][CONVERSION DETALLE ELIMINAR][" + listaEstructura + "]");
//		} else {
//			log.info("[MODIFICAR ESTRUCTURA][SERVICE][CONVERSION DETALLE ELIMINAR][CANT:" + req.size() + "]");
//		}
//		return listaEstructura;
//	}

	@Override
	public OutResponse<List<EstructuraParametroListarResponse>> listarParametroEstructura(
			EstructuraParametroListarRequest req) {
		log.info("[LISTAR PARAMETROS ESTRUCTURA][SERVICE][INICIO]");
		OutResponse<List<EstructuraParametroListarResponse>> out = estructuraDao.listarParametroEstructura(req);
		log.info("[LISTAR PARAMETROS ESTRUCTURA][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<EstructuraBuscarResponse> buscarEstructura(EstructuraBuscarRequest req) {
		log.info("[BUSCAR ESTRUCTURA][SERVICIO][INICIO]");
		OutResponse<EstructuraBuscarResponse> out = estructuraDao.buscarEstructura(req);
		log.info("[BUSCAR ESTRUCTURA][SERVICIO][FIN]");
		return out;
	}

	@Override
	public OutResponse<FileResponse> exportarListaEstructuraXlsx(EstructuraListarRequest c) {
		log.info("[EXPORTAR LISTA ESTRUCTURA][SERVICE][INICIO]");
		OutResponse<List<EstructuraListarResponse>> out = estructuraDao.listarEstructura(c);

		OutResponse<FileResponse> outF = new OutResponse<>();
		if (out.getRCodigo() == ConstanteUtil.R_COD_EXITO) {
			try {
				String[] columns = { "Nro", "Nombre", "Entidad", "Linea de intervencion", "Servicio", "Estado" };
				int[] anchoColumns = { 1500, 13000, 13000, 8000, 13000, 4000 };

				Workbook workbook = new HSSFWorkbook();
				ByteArrayOutputStream stream = new ByteArrayOutputStream();

				Sheet sheet = workbook.createSheet("Estructuras");
				Row row = sheet.createRow(0);

				for (int i = 0; i < columns.length; i++) {
					Cell cell = row.createCell(i);
					cell.setCellValue(columns[i]);
					sheet.setColumnWidth(i, anchoColumns[i]);
				}

				int cont = 1;
				for (EstructuraListarResponse obj : out.getObjeto()) {
					row = sheet.createRow(cont);
					row.createCell(0).setCellValue(cont);
					row.createCell(1).setCellValue(obj.getNombre());
					row.createCell(2).setCellValue(obj.getNomEntidad());
					row.createCell(3).setCellValue(obj.getNomLineaIntervencion());
					row.createCell(4).setCellValue(obj.getNomServicio());
					row.createCell(5)
							.setCellValue(obj.getFlgActivo() == ConstanteUtil.FLG_ACTVO ? ConstanteUtil.DESC_ACTIVO
									: ConstanteUtil.DESC_INACTIVO);
					cont++;
				}
				workbook.write(stream);
				workbook.close();

				FileResponse resp = new FileResponse();
				resp.setNombre("Lista Estructuras.xls");
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
		log.info("[EXPORTAR LISTA ESTRUCTURA][SERVICE][FIN]");
		return outF;
	}
}
