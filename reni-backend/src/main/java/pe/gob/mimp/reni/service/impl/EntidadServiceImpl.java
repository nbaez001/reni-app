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

import pe.gob.mimp.reni.dao.EntidadDao;
import pe.gob.mimp.reni.dto.request.EntidadEliminarRequest;
import pe.gob.mimp.reni.dto.request.EntidadListarRequest;
import pe.gob.mimp.reni.dto.request.EntidadModificarRequest;
import pe.gob.mimp.reni.dto.request.EntidadRegistrarRequest;
import pe.gob.mimp.reni.dto.response.EntidadListarResponse;
import pe.gob.mimp.reni.dto.response.EntidadRegistrarResponse;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.service.EntidadService;
import pe.gob.mimp.reni.util.ConstanteUtil;

@Service
public class EntidadServiceImpl implements EntidadService {

	private static final Logger log = LoggerFactory.getLogger(EntidadServiceImpl.class);

	@Autowired
	EntidadDao entidadDao;

	@Override
	public OutResponse<List<EntidadListarResponse>> listarEntidad(EntidadListarRequest req) {
		log.info("[LISTAR ENTIDAD][SERVICE][INICIO]");
		OutResponse<List<EntidadListarResponse>> out = entidadDao.listarEntidad(req);
		log.info("[LISTAR ENTIDAD][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<EntidadRegistrarResponse> registrarEntidad(EntidadRegistrarRequest req) {
		log.info("[REGISTRAR ENTIDAD][SERVICE][INICIO]");
		OutResponse<EntidadRegistrarResponse> out = entidadDao.registrarEntidad(req);
		log.info("[REGISTRAR ENTIDAD][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> modificarEntidad(EntidadModificarRequest req) {
		log.info("[MODIFICAR ENTIDAD][SERVICE][INICIO]");
		OutResponse<?> out = entidadDao.modificarEntidad(req);
		log.info("[MODIFICAR ENTIDAD][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> eliminarEntidad(EntidadEliminarRequest req) {
		log.info("[ELIMINAR ENTIDAD][SERVICE][INICIO]");
		OutResponse<?> out = entidadDao.eliminarEntidad(req);
		log.info("[ELIMINAR ENTIDAD][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<FileResponse> exportarListaEntidadXlsx(EntidadListarRequest c) {
		log.info("[EXPORTAR LISTA ENTIDAD][SERVICE][INICIO]");
		OutResponse<List<EntidadListarResponse>> out = entidadDao.listarEntidad(c);

		OutResponse<FileResponse> outF = new OutResponse<>();
		if (out.getRCodigo() == ConstanteUtil.R_COD_EXITO) {
			try {
				String[] columns = { "Nro", "Codigo", "Nombre", "Siglas", "Estado" };
				int[] anchoColumns = { 1500, 8000, 18000, 5000, 4000 };

				Workbook workbook = new HSSFWorkbook();
				ByteArrayOutputStream stream = new ByteArrayOutputStream();

				Sheet sheet = workbook.createSheet("Entidades");
				Row row = sheet.createRow(0);

				for (int i = 0; i < columns.length; i++) {
					Cell cell = row.createCell(i);
					cell.setCellValue(columns[i]);
					sheet.setColumnWidth(i, anchoColumns[i]);
				}

				int cont = 1;
				for (EntidadListarResponse obj : out.getObjeto()) {
					row = sheet.createRow(cont);
					row.createCell(0).setCellValue(cont);
					row.createCell(1).setCellValue(obj.getCodigo());
					row.createCell(2).setCellValue(obj.getNombre());
					row.createCell(3).setCellValue(obj.getSiglas());
					row.createCell(4)
							.setCellValue(obj.getFlgActivo() == ConstanteUtil.FLG_ACTVO ? ConstanteUtil.DESC_ACTIVO
									: ConstanteUtil.DESC_INACTIVO);
					cont++;
				}
				workbook.write(stream);
				workbook.close();

				FileResponse resp = new FileResponse();
				resp.setNombre("Lista Entidades.xls");
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
		log.info("[EXPORTAR LISTA ENTIDAD][SERVICE][FIN]");
		return outF;
	}

//	@Override
//	public OutResponse<?> alterTable(String nombre) {
//		log.info("[AGREGAR CAMPO ENTIDAD][SERVICE][INICIO]");
//		OutResponse<?> out = entidadDao.alterTable(nombre);
//		log.info("[AGREGAR CAMPO ENTIDAD][SERVICE][FIN]");
//		return out;
//	}
}
