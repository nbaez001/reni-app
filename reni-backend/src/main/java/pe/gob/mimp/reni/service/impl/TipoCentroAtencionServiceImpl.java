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

import pe.gob.mimp.reni.dao.TipoCentroAtencionDao;
import pe.gob.mimp.reni.dto.request.SubtipoCentroEliminarRequest;
import pe.gob.mimp.reni.dto.request.SubtipoCentroListarRequest;
import pe.gob.mimp.reni.dto.request.SubtipoCentroModificarRequest;
import pe.gob.mimp.reni.dto.request.SubtipoCentroRegistrarRequest;
import pe.gob.mimp.reni.dto.request.TipoCentroEliminarRequest;
import pe.gob.mimp.reni.dto.request.TipoCentroListarRequest;
import pe.gob.mimp.reni.dto.request.TipoCentroModificarRequest;
import pe.gob.mimp.reni.dto.request.TipoCentroRegistrarRequest;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.SubtipoCentroListarResponse;
import pe.gob.mimp.reni.dto.response.SubtipoCentroRegistrarResponse;
import pe.gob.mimp.reni.dto.response.TipoCentroListarResponse;
import pe.gob.mimp.reni.dto.response.TipoCentroRegistrarResponse;
import pe.gob.mimp.reni.service.TipoCentroAtencionService;
import pe.gob.mimp.reni.util.ConstanteUtil;

@Service
public class TipoCentroAtencionServiceImpl implements TipoCentroAtencionService {

	private static final Logger log = LoggerFactory.getLogger(EntidadServiceImpl.class);

	@Autowired
	TipoCentroAtencionDao tipoCentroAtencionDao;

	@Override
	public OutResponse<List<TipoCentroListarResponse>> listarTipoCentro(TipoCentroListarRequest req) {
		log.info("[LISTAR TIPO CENTRO ATENCION][SERVICE][INICIO]");
		OutResponse<List<TipoCentroListarResponse>> out = tipoCentroAtencionDao.listarTipoCentro(req);
		log.info("[LISTAR TIPO CENTRO ATENCION][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<TipoCentroRegistrarResponse> registrarTipoCentro(TipoCentroRegistrarRequest req) {
		log.info("[REGISTRAR TIPO CENTRO ATENCION][SERVICE][INICIO]");
		OutResponse<TipoCentroRegistrarResponse> out = tipoCentroAtencionDao.registrarTipoCentro(req);
		log.info("[REGISTRAR TIPO CENTRO ATENCION][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> modificarTipoCentro(TipoCentroModificarRequest req) {
		log.info("[MODIFICAR TIPO CENTRO ATENCION][SERVICE][INICIO]");
		OutResponse<?> out = tipoCentroAtencionDao.modificarTipoCentro(req);
		log.info("[MODIFICAR TIPO CENTRO ATENCION][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> eliminarTipoCentro(TipoCentroEliminarRequest req) {
		log.info("[ELIMINAR TIPO CENTRO ATENCION][SERVICE][INICIO]");
		OutResponse<?> out = tipoCentroAtencionDao.eliminarTipoCentro(req);
		log.info("[ELIMINAR TIPO CENTRO ATENCION][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<FileResponse> exportarListaTipoCentroXlsx(TipoCentroListarRequest c) {
		log.info("[EXPORTAR LISTA TIPO CENTRO][SERVICE][INICIO]");
		OutResponse<List<TipoCentroListarResponse>> out = tipoCentroAtencionDao.listarTipoCentro(c);

		OutResponse<FileResponse> outF = new OutResponse<>();
		if (out.getRCodigo() == ConstanteUtil.R_COD_EXITO) {
			try {
				String[] columns = { "Nro", "Codigo", "Nombre", "Abreviación", "Descripción", "Estado" };
				int[] anchoColumns = { 1500, 8000, 18000, 8000, 5000, 20000, 4000 };

				Workbook workbook = new HSSFWorkbook();
				ByteArrayOutputStream stream = new ByteArrayOutputStream();

				Sheet sheet = workbook.createSheet("Tipo centro atencion");
				Row row = sheet.createRow(0);

				for (int i = 0; i < columns.length; i++) {
					Cell cell = row.createCell(i);
					cell.setCellValue(columns[i]);
					sheet.setColumnWidth(i, anchoColumns[i]);
				}

				int cont = 1;
				for (TipoCentroListarResponse obj : out.getObjeto()) {
					row = sheet.createRow(cont);
					row.createCell(0).setCellValue(cont);
					row.createCell(1).setCellValue(obj.getCodigo());
					row.createCell(2).setCellValue(obj.getNombre());
					row.createCell(3).setCellValue(obj.getAbreviatura());
					row.createCell(4).setCellValue(obj.getDescripcion());
					row.createCell(5)
							.setCellValue(obj.getFlgActivo() == ConstanteUtil.FLG_ACTVO ? ConstanteUtil.DESC_ACTIVO
									: ConstanteUtil.DESC_INACTIVO);
					cont++;
				}
				workbook.write(stream);
				workbook.close();

				FileResponse resp = new FileResponse();
				resp.setNombre("Lista tipo centro.xls");
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
		log.info("[EXPORTAR LISTA TIPO CENTRO][SERVICE][FIN]");
		return outF;
	}

	@Override
	public OutResponse<List<SubtipoCentroListarResponse>> listarSubtipoCentro(SubtipoCentroListarRequest req) {
		log.info("[LISTAR SUBTIPO CENTRO ATENCION][SERVICE][INICIO]");
		OutResponse<List<SubtipoCentroListarResponse>> out = tipoCentroAtencionDao.listarSubtipoCentro(req);
		log.info("[LISTAR SUBTIPO CENTRO ATENCION][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<SubtipoCentroRegistrarResponse> registrarSubtipoCentro(SubtipoCentroRegistrarRequest req) {
		log.info("[REGISTRAR SUBTIPO CENTRO ATENCION][SERVICE][INICIO]");
		OutResponse<SubtipoCentroRegistrarResponse> out = tipoCentroAtencionDao.registrarSubtipoCentro(req);
		log.info("[REGISTRAR SUBTIPO CENTRO ATENCION][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> modificarSubtipoCentro(SubtipoCentroModificarRequest req) {
		log.info("[MODIFICAR SUBTIPO CENTRO ATENCION][SERVICE][INICIO]");
		OutResponse<?> out = tipoCentroAtencionDao.modificarSubtipoCentro(req);
		log.info("[MODIFICAR SUBTIPO CENTRO ATENCION][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> eliminarSubtipoCentro(SubtipoCentroEliminarRequest req) {
		log.info("[ELIMINAR SUBTIPO CENTRO ATENCION][SERVICE][INICIO]");
		OutResponse<?> out = tipoCentroAtencionDao.eliminarSubtipoCentro(req);
		log.info("[ELIMINAR SUBTIPO CENTRO ATENCION][SERVICE][FIN]");
		return out;
	}

}
