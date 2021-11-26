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

import pe.gob.mimp.reni.dao.ServicioDao;
import pe.gob.mimp.reni.dto.request.ServicioEliminarRequest;
import pe.gob.mimp.reni.dto.request.ServicioListarRequest;
import pe.gob.mimp.reni.dto.request.ServicioModificarRequest;
import pe.gob.mimp.reni.dto.request.ServicioRegistrarRequest;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.ServicioListarResponse;
import pe.gob.mimp.reni.dto.response.ServicioRegistrarResponse;
import pe.gob.mimp.reni.service.ServicioService;
import pe.gob.mimp.reni.util.ConstanteUtil;

@Service
public class ServicioServiceImpl implements ServicioService {

	private static final Logger log = LoggerFactory.getLogger(ServicioServiceImpl.class);

	@Autowired
	ServicioDao entidadDao;

	@Override
	public OutResponse<List<ServicioListarResponse>> listarServicio(ServicioListarRequest req) {
		log.info("[LISTAR SERVICIO][SERVICE][INICIO]");
		OutResponse<List<ServicioListarResponse>> out = entidadDao.listarServicio(req);
		log.info("[LISTAR SERVICIO][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<ServicioRegistrarResponse> registrarServicio(ServicioRegistrarRequest req) {
		log.info("[REGISTRAR SERVICIO][SERVICE][INICIO]");
		OutResponse<ServicioRegistrarResponse> out = entidadDao.registrarServicio(req);
		log.info("[REGISTRAR SERVICIO][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> modificarServicio(ServicioModificarRequest req) {
		log.info("[MODIFICAR SERVICIO][SERVICE][INICIO]");
		OutResponse<?> out = entidadDao.modificarServicio(req);
		log.info("[MODIFICAR SERVICIO][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> eliminarServicio(ServicioEliminarRequest req) {
		log.info("[ELIMINAR SERVICIO][SERVICE][INICIO]");
		OutResponse<?> out = entidadDao.eliminarServicio(req);
		log.info("[ELIMINAR SERVICIO][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<FileResponse> exportarListaServicioXlsx(ServicioListarRequest c) {
		log.info("[EXPORTAR LISTA SERVICIO][SERVICE][INICIO]");
		OutResponse<List<ServicioListarResponse>> out = entidadDao.listarServicio(c);

		OutResponse<FileResponse> outF = new OutResponse<>();
		if (out.getRCodigo() == ConstanteUtil.R_COD_EXITO) {
			try {
				String[] columns = { "Nro", "Codigo", "Nombre", "Tipo Centro", "Entidad", "Linea intervencion",
						"Estado" };
				int[] anchoColumns = { 1500, 6000, 13000, 13000, 13000, 7000, 4000 };

				Workbook workbook = new HSSFWorkbook();
				ByteArrayOutputStream stream = new ByteArrayOutputStream();

				Sheet sheet = workbook.createSheet("Servicio");
				Row row = sheet.createRow(0);

				for (int i = 0; i < columns.length; i++) {
					Cell cell = row.createCell(i);
					cell.setCellValue(columns[i]);
					sheet.setColumnWidth(i, anchoColumns[i]);
				}

				int cont = 1;
				for (ServicioListarResponse obj : out.getObjeto()) {
					row = sheet.createRow(cont);
					row.createCell(0).setCellValue(cont);
					row.createCell(1).setCellValue(obj.getCodigo());
					row.createCell(2).setCellValue(obj.getNombre());
					row.createCell(3).setCellValue(obj.getNomTipCentro());
					row.createCell(4).setCellValue(obj.getNomEntidad());
					row.createCell(5).setCellValue(obj.getNomLineaIntervencion());
					row.createCell(6)
							.setCellValue(obj.getFlgActivo() == ConstanteUtil.FLG_ACTVO ? ConstanteUtil.DESC_ACTIVO
									: ConstanteUtil.DESC_INACTIVO);
					cont++;
				}
				workbook.write(stream);
				workbook.close();

				FileResponse resp = new FileResponse();
				resp.setNombre("Lista Servicio.xls");
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
		log.info("[EXPORTAR LISTA SERVICIO][SERVICE][FIN]");
		return outF;
	}
}
