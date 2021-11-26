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

import pe.gob.mimp.reni.dao.LineaIntervencionDao;
import pe.gob.mimp.reni.dto.request.LineaIntervencionEliminarRequest;
import pe.gob.mimp.reni.dto.request.LineaIntervencionListarRequest;
import pe.gob.mimp.reni.dto.request.LineaIntervencionModificarRequest;
import pe.gob.mimp.reni.dto.request.LineaIntervencionRegistrarRequest;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.LineaIntervencionListarResponse;
import pe.gob.mimp.reni.dto.response.LineaIntervencionRegistrarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.service.LineaIntervencionService;
import pe.gob.mimp.reni.util.ConstanteUtil;

@Service
public class LineaIntervencionServiceImpl implements LineaIntervencionService {

	private static final Logger log = LoggerFactory.getLogger(LineaIntervencionServiceImpl.class);

	@Autowired
	LineaIntervencionDao lineaIntervencionDao;

	@Override
	public OutResponse<List<LineaIntervencionListarResponse>> listarLineaIntervencion(
			LineaIntervencionListarRequest req) {
		log.info("[LISTAR LINEA INTERVENCION][SERVICE][INICIO]");
		OutResponse<List<LineaIntervencionListarResponse>> out = lineaIntervencionDao.listarLineaIntervencion(req);
		log.info("[LISTAR LINEA INTERVENCION][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<LineaIntervencionRegistrarResponse> registrarLineaIntervencion(
			LineaIntervencionRegistrarRequest req) {
		log.info("[REGISTRAR LINEA INTERVENCION][SERVICE][INICIO]");
		OutResponse<LineaIntervencionRegistrarResponse> out = lineaIntervencionDao.registrarLineaIntervencion(req);
		log.info("[REGISTRAR LINEA INTERVENCION][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> modificarLineaIntervencion(LineaIntervencionModificarRequest req) {
		log.info("[MODIFICAR LINEA INTERVENCION][SERVICE][INICIO]");
		OutResponse<?> out = lineaIntervencionDao.modificarLineaIntervencion(req);
		log.info("[MODIFICAR LINEA INTERVENCION][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> eliminarLineaIntervencion(LineaIntervencionEliminarRequest req) {
		log.info("[ELIMINAR LINEA INTERVENCION][SERVICE][INICIO]");
		OutResponse<?> out = lineaIntervencionDao.eliminarLineaIntervencion(req);
		log.info("[ELIMINAR LINEA INTERVENCION][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<FileResponse> exportarListaLineaIntervencionXlsx(LineaIntervencionListarRequest c) {
		log.info("[EXPORTAR LISTA LINEA INTERVENCION][SERVICE][INICIO]");
		OutResponse<List<LineaIntervencionListarResponse>> out = lineaIntervencionDao.listarLineaIntervencion(c);

		OutResponse<FileResponse> outF = new OutResponse<>();
		if (out.getRCodigo() == ConstanteUtil.R_COD_EXITO) {
			try {
				String[] columns = { "Nro", "Codigo", "Nombre", "Estado" };
				int[] anchoColumns = { 1500, 6000, 10000, 4000 };

				Workbook workbook = new HSSFWorkbook();
				ByteArrayOutputStream stream = new ByteArrayOutputStream();

				Sheet sheet = workbook.createSheet("Linea Intervencion");
				Row row = sheet.createRow(0);

				for (int i = 0; i < columns.length; i++) {
					Cell cell = row.createCell(i);
					cell.setCellValue(columns[i]);
					sheet.setColumnWidth(i, anchoColumns[i]);
				}

				int cont = 1;
				for (LineaIntervencionListarResponse obj : out.getObjeto()) {
					row = sheet.createRow(cont);
					row.createCell(0).setCellValue(cont);
					row.createCell(1).setCellValue(obj.getCodigo());
					row.createCell(2).setCellValue(obj.getNombre());
					row.createCell(3)
							.setCellValue(obj.getFlgActivo() == ConstanteUtil.FLG_ACTVO ? ConstanteUtil.DESC_ACTIVO
									: ConstanteUtil.DESC_INACTIVO);
					cont++;
				}
				workbook.write(stream);
				workbook.close();

				FileResponse resp = new FileResponse();
				resp.setNombre("Lista Linea Intervencion.xls");
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
		log.info("[EXPORTAR LISTA LINEA INTERVENCION][SERVICE][FIN]");
		return outF;
	}
}
