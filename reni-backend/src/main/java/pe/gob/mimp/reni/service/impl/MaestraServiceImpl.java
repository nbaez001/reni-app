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
import org.springframework.transaction.annotation.Transactional;

import pe.gob.mimp.reni.dao.MaestraDao;
import pe.gob.mimp.reni.dto.request.MaestraCargaMasivaDetalleRequest;
import pe.gob.mimp.reni.dto.request.MaestraCargaMasivaListarMaeRequest;
import pe.gob.mimp.reni.dto.request.MaestraCargaMasivaRequest;
import pe.gob.mimp.reni.dto.request.MaestraEliminarRequest;
import pe.gob.mimp.reni.dto.request.MaestraListarExportRequest;
import pe.gob.mimp.reni.dto.request.MaestraListarRequest;
import pe.gob.mimp.reni.dto.request.MaestraModificarRequest;
import pe.gob.mimp.reni.dto.request.MaestraRegistrarRequest;
import pe.gob.mimp.reni.dto.request.MaestraSubitemEliminarRequest;
import pe.gob.mimp.reni.dto.request.MaestraSubitemListarRequest;
import pe.gob.mimp.reni.dto.request.MaestraSubitemModificarRequest;
import pe.gob.mimp.reni.dto.request.MaestraSubitemRegistrarRequest;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.MaestraCargaMasivaListarMaeResponse;
import pe.gob.mimp.reni.dto.response.MaestraListarExportResponse;
import pe.gob.mimp.reni.dto.response.MaestraListarResponse;
import pe.gob.mimp.reni.dto.response.MaestraRegistrarResponse;
import pe.gob.mimp.reni.dto.response.MaestraSubitemListarResponse;
import pe.gob.mimp.reni.dto.response.MaestraSubitemRegistrarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.service.MaestraService;
import pe.gob.mimp.reni.util.ConstanteUtil;

@Service
public class MaestraServiceImpl implements MaestraService {

	private static final Logger log = LoggerFactory.getLogger(MaestraServiceImpl.class);

	@Autowired
	MaestraDao maestraDao;

	@Override
	public OutResponse<List<MaestraListarResponse>> listarMaestra(MaestraListarRequest req) {
		log.info("[LISTAR MAESTRA][SERVICE][INICIO]");
		OutResponse<List<MaestraListarResponse>> out = maestraDao.listarMaestra(req);
		log.info("[LISTAR MAESTRA][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<MaestraRegistrarResponse> registrarMaestra(MaestraRegistrarRequest req) {
		log.info("[REGISTRAR MAESTRA][SERVICE][INICIO]");
		OutResponse<MaestraRegistrarResponse> out = maestraDao.registrarMaestra(req);
		log.info("[REGISTRAR MAESTRA][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> modificarMaestra(MaestraModificarRequest req) {
		log.info("[MODIFICAR MAESTRA][SERVICE][INICIO]");
		OutResponse<?> out = maestraDao.modificarMaestra(req);
		log.info("[MODIFICAR MAESTRA][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> eliminarMaestra(MaestraEliminarRequest req) {
		log.info("[ELIMINAR MAESTRA][SERVICE][INICIO]");
		OutResponse<?> out = maestraDao.eliminarMaestra(req);
		log.info("[ELIMINAR MAESTRA][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<List<MaestraSubitemListarResponse>> listarMaestraSubitem(MaestraSubitemListarRequest req) {
		log.info("[LISTAR MAESTRA SUBITEM][SERVICE][INICIO]");
		OutResponse<List<MaestraSubitemListarResponse>> out = maestraDao.listarMaestraSubitem(req);
		log.info("[LISTAR MAESTRA SUBITEM][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<MaestraSubitemRegistrarResponse> registrarMaestraSubitem(MaestraSubitemRegistrarRequest req) {
		log.info("[REGISTRAR MAESTRA SUBITEM][SERVICE][INICIO]");
		OutResponse<MaestraSubitemRegistrarResponse> out = maestraDao.registrarMaestraSubitem(req);
		log.info("[REGISTRAR MAESTRA SUBITEM][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> modificarMaestraSubitem(MaestraSubitemModificarRequest req) {
		log.info("[MODIFICAR MAESTRA SUBITEM][SERVICE][INICIO]");
		OutResponse<?> out = maestraDao.modificarMaestraSubitem(req);
		log.info("[MODIFICAR MAESTRA SUBITEM][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> eliminarMaestraSubitem(MaestraSubitemEliminarRequest req) {
		log.info("[ELIMINAR MAESTRA SUBITEM][SERVICE][INICIO]");
		OutResponse<?> out = maestraDao.eliminarMaestraSubitem(req);
		log.info("[ELIMINAR MAESTRA SUBITEM][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<FileResponse> exportarListaMaestraXlsx(MaestraListarExportRequest c) {
		log.info("[EXPORTAR LISTA MAESTRA][SERVICE][INICIO]");
		OutResponse<List<MaestraListarExportResponse>> out = maestraDao.exportarListaMaestraXlsx(c);

		OutResponse<FileResponse> outF = new OutResponse<>();
		if (out.getRCodigo() == ConstanteUtil.R_COD_EXITO) {
			try {
				String[] columns = { "Nro", "ID Tabla", "Numero orden", "Codigo", "Nombre", "Descripcion", "Estado" };
				int[] anchoColumns = { 1500, 6000, 4000, 6000, 10000, 15000, 4000 };

				Workbook workbook = new HSSFWorkbook();
				ByteArrayOutputStream stream = new ByteArrayOutputStream();

				Sheet sheet = workbook.createSheet("Maestras");
				Row row = sheet.createRow(0);

				for (int i = 0; i < columns.length; i++) {
					Cell cell = row.createCell(i);
					cell.setCellValue(columns[i]);
					sheet.setColumnWidth(i, anchoColumns[i]);
				}

				int cont = 1;
				for (MaestraListarExportResponse obj : out.getObjeto()) {
					row = sheet.createRow(cont);
					row.createCell(0).setCellValue(cont);
					row.createCell(1).setCellValue(obj.getIdTabla());
					row.createCell(2).setCellValue(obj.getNumOrden());
					row.createCell(3).setCellValue(obj.getCodigo());
					row.createCell(4).setCellValue(obj.getNombre());
					row.createCell(5).setCellValue(obj.getDescripcion());
					row.createCell(6)
							.setCellValue(obj.getFlgActivo() == ConstanteUtil.FLG_ACTVO ? ConstanteUtil.DESC_ACTIVO
									: ConstanteUtil.DESC_INACTIVO);
					cont++;
				}
				workbook.write(stream);
				workbook.close();

				FileResponse resp = new FileResponse();
				resp.setNombre("Lista Maestras.xls");
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
		log.info("[EXPORTAR LISTA MAESTRA][SERVICE][FIN]");
		return outF;
	}

	@Override
	public OutResponse<List<MaestraCargaMasivaListarMaeResponse>> listarMaestraCargaMasiva(
			MaestraCargaMasivaListarMaeRequest req) {
		log.info("[LISTAR MAESTRA CARGA MASIVA][SERVICE][INICIO]");
		OutResponse<List<MaestraCargaMasivaListarMaeResponse>> out = maestraDao
				.listarMaestraCargaMasiva(listaMaestraToString(req.getListaMaestra()));
		log.info("[LISTAR MAESTRA CARGA MASIVA][SERVICE][FIN]");
		return out;
	}

	public String listaMaestraToString(List<String> req) {
		log.info("[LISTAR MAESTRA CARGA MASIVA][SERVICE][CONVERSION DETALLE][INICIO]");
		String listaMaes = "";
		if (req.size() > 0) {
			log.info("[LISTAR MAESTRA CARGA MASIVA][SERVICE][CONVERSION DETALLE][CANT:" + req.size() + "]");
			for (String rc : req) {
				listaMaes = listaMaes + ((rc != null) ? rc : "(NULL)") + "|";
			}
			listaMaes = listaMaes.substring(0, listaMaes.length() - 1);
			log.info("[LISTAR MAESTRA CARGA MASIVA][SERVICE][CONVERSION DETALLE][" + listaMaes + "]");
		} else {
			log.info("[LISTAR MAESTRA CARGA MASIVA][SERVICE][CONVERSION DETALLE][CANT:" + req.size() + "]");
		}
		return listaMaes;
	}

	@Override
	@Transactional(rollbackFor = { Exception.class })
	public OutResponse<?> cargaMasivaMaestras(MaestraCargaMasivaRequest req) throws Exception {
		log.info("[CARGA MASIVA MAESTRAS][SERVICE][INICIO]");
		OutResponse<?> out = new OutResponse<>();
		out.setRCodigo(0);
		out.setRMensaje("Exito");

		for (String IdTabla : req.getListaMaestraIds()) {
			List<MaestraCargaMasivaDetalleRequest> lista = req.getListaMaestra().stream()
					.filter(m -> (IdTabla.equals(m.getIdTabla()))).collect(Collectors.toList());

			MaestraCargaMasivaDetalleRequest principal = lista.stream().filter(m -> m.getNumOrden() == 0).findAny()
					.orElse(null);

			if (principal != null) {
				OutResponse<Long> out2 = maestraDao.registrarMaestraCargaMasiva(principal, req.getIdUsuarioCrea());
				List<MaestraCargaMasivaDetalleRequest> listaSecundarios = lista.stream()
						.filter(m -> (m.getNumOrden() != 0)).collect(Collectors.toList());

				for (MaestraCargaMasivaDetalleRequest secundario : listaSecundarios) {
					maestraDao.registrarMaestraSubitemCargaMasiva(secundario, out2.getObjeto(), req.getIdUsuarioCrea());
				}
			}
		}
		log.info("[CARGA MASIVA MAESTRAS][SERVICE][FIN]");
		return out;
	}

}
