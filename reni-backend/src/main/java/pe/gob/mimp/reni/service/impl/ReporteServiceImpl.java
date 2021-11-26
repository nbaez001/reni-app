package pe.gob.mimp.reni.service.impl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pe.gob.mimp.reni.dao.ReporteDao;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListaXlsxDetRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarXlsxRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarEntidadPermitidoRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarUsuarioXDatosRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionXUsuarioListarMaestraResponse;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionXUsuarioListarRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionXUsuarioListarXlsxDetRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionXUsuarioListarXlsxRequest;
import pe.gob.mimp.reni.dto.request.ReporteParametroEstrucListarRequest;
import pe.gob.mimp.reni.dto.request.ReporteParametroEstrucXUsuListarRequest;
import pe.gob.mimp.reni.dto.request.ReportePlantillaRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarEstructuraPermitidoRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarLineaInterPermitidoRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarServicioPermitidoRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarRequest;
import pe.gob.mimp.reni.dto.response.EntidadListarResponse;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.LineaIntervencionListarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.ReporteIntervencionListarUsuarioXDatosResponse;
import pe.gob.mimp.reni.dto.response.ReporteParametroEstrucListarResponse;
import pe.gob.mimp.reni.dto.response.ReporteIntervencionListarMaestraResponse;
import pe.gob.mimp.reni.dto.response.ServicioListarResponse;
import pe.gob.mimp.reni.dto.response.ReporteIntervencionListarEstructuraPermitidoResponse;
import pe.gob.mimp.reni.dto.response.ReporteIntervencionListarParametroResponse;
import pe.gob.mimp.reni.service.ReporteService;
import pe.gob.mimp.reni.util.ConstanteUtil;
import pe.gob.mimp.reni.util.PlantillaProperties;

@Service
public class ReporteServiceImpl implements ReporteService {

	private static final Logger log = LoggerFactory.getLogger(ReporteServiceImpl.class);

	@Autowired
	ReporteDao reporteDao;

	@Autowired
	PlantillaProperties plantillaProperties;

	@Override
	public OutResponse<List<ReporteParametroEstrucListarResponse>> listarParametroEstructura(
			ReporteParametroEstrucListarRequest req) {
		log.info("[LISTAR PARAMETRO ESTRUCTURA][SERVICE][INICIO]");
		OutResponse<List<ReporteParametroEstrucListarResponse>> out = reporteDao
				.listarParametroEstructura(listaEstructuraToString(req.getListaEstructura()));
		log.info("[LISTAR PARAMETRO ESTRUCTURA][SERVICE][FIN]");
		return out;
	}

	public String listaEstructuraToString(List<Long> req) {
		log.info("[LISTAR PARAMETRO ESTRUCTURA][SERVICE][CONVERSION DETALLE][INICIO]");
		String listaDetalle = "";
		if (req != null && req.size() > 0) {
			log.info("[LISTAR PARAMETRO ESTRUCTURA][SERVICE][CONVERSION DETALLE][CANT:" + req.size() + "]");
			for (Long rc : req) {
				listaDetalle = listaDetalle + ((rc != null) ? rc : "0") + "|";
			}
			listaDetalle = listaDetalle.substring(0, listaDetalle.length() - 1);
			log.info("[LISTAR PARAMETRO ESTRUCTURA][SERVICE][CONVERSION DETALLE][" + listaDetalle + "]");
		} else {
			log.info("[LISTAR PARAMETRO ESTRUCTURA][SERVICE][CONVERSION DETALLE][CANT:"
					+ ((req != null) ? req.size() : "NULL") + "]");
		}
		return listaDetalle;
	}

	@Override
	public OutResponse<List<Map<String, Object>>> listarReporteIntervencion(ReporteIntervencionListarRequest req) {
		log.info("[LISTAR REPORTE INTERVENCION][SERVICE][INICIO]");
		OutResponse<List<ReporteIntervencionListarMaestraResponse>> out = reporteDao
				.listarMaestraXEstructura(req.getListaEstructura());

		OutResponse<List<Map<String, Object>>> outF = new OutResponse<>();
		if (out.getRCodigo() == ConstanteUtil.R_COD_EXITO) {
			outF = reporteDao.listarReporteIntervencion(req, out.getObjeto());
		} else {
			outF.setRCodigo(out.getRCodigo());
			outF.setRMensaje(out.getRMensaje());
		}

		log.info("[LISTAR REPORTE INTERVENCION][SERVICE][FIN]");
		return outF;
	}

	@Override
	public OutResponse<FileResponse> listarReporteIntervencionXlsx(ReporteIntervencionListarXlsxRequest c) {
		log.info("[LISTAR REPORTE INTERVENCION XLSX][SERVICE][INICIO]");

		OutResponse<List<ReporteIntervencionListarMaestraResponse>> out = reporteDao
				.listarMaestraXEstructura(c.getListaEstructura());

		OutResponse<List<Map<String, Object>>> outU = new OutResponse<>();
		if (out.getRCodigo() == ConstanteUtil.R_COD_EXITO) {
			outU = reporteDao.listarReporteIntervencionXlsx(c, out.getObjeto());
		} else {
			outU.setRCodigo(out.getRCodigo());
			outU.setRMensaje(out.getRMensaje());
		}

		OutResponse<FileResponse> outF = new OutResponse<>();
		if (outU.getRCodigo() == ConstanteUtil.R_COD_EXITO) {
			try {
				List<String> columns = new ArrayList<>();
				List<String> descColumns = new ArrayList<>();
				List<Integer> anchoColumns = new ArrayList<>();

				columns.add("NRO");
				descColumns.add("Número");
				anchoColumns.add(3000);
				for (ReporteIntervencionListaXlsxDetRequest map : c.getListaMapeo()) {
					columns.add(map.getNomCampoExcel());
					descColumns.add(map.getDescCampoExcel());
					anchoColumns.add(7000);
				}

				Workbook workbook = new HSSFWorkbook();
				ByteArrayOutputStream stream = new ByteArrayOutputStream();

				Sheet sheet = workbook.createSheet("Usuarios");

				// FILA 1: DESCRIPCION TITULO
				Row row = sheet.createRow(0);
				for (int i = 0; i < descColumns.size(); i++) {
					Cell cell = row.createCell(i);
					cell.setCellValue(descColumns.get(i));
				}

				// FILA 0: TITULOS
				row = sheet.createRow(1);
				for (int i = 0; i < columns.size(); i++) {
					Cell cell = row.createCell(i);
					cell.setCellValue(columns.get(i));
					sheet.setColumnWidth(i, anchoColumns.get(i));
				}

				// FILAS N: DETALLE
				int cont = 2;
				for (Map<String, Object> obj : outU.getObjeto()) {
					row = sheet.createRow(cont);

					row.createCell(0).setCellValue(cont - 1);
					int cont2 = 1;
					for (ReporteIntervencionListaXlsxDetRequest mpa : c.getListaMapeo()) {
						row.createCell(cont2)
								.setCellValue(obj.get(mpa.getNomCampoExcel()) != null
										? obj.get(mpa.getNomCampoExcel()).toString()
										: "");
						cont2++;
					}
					cont++;
				}

				// HOJA DICCIONARIO
				OutResponse<List<ReporteIntervencionListarParametroResponse>> outDic = reporteDao
						.listarParametroXEstructura(c.getListaEstructura());
				Sheet sheetD = workbook.createSheet("DICCIONARIO");
				if (outDic.getRCodigo() == ConstanteUtil.R_COD_EXITO) {
					String[] columnsD = { "Nombre campo", "Descripcion campo", "Descripcion categorias",
							"¿Campo categorizado?", "Identificativo de categorias", "Servicio" };
					int[] anchoColumnsD = { 5000, 20000, 20000, 5000, 7000, 20000 };

					// FILA 1: TITULO
					Row rowD = sheetD.createRow(0);
					Cell cell = rowD.createCell(0);
					cell.setCellValue("DICCIONARIO DE DATOS");
					sheetD.addMergedRegion(new CellRangeAddress(0, 0, 0, 5));// MESCLA CELDAS

					// FILA 0: TITULOS
					rowD = sheetD.createRow(1);
					for (int i = 0; i < columnsD.length; i++) {
						Cell cellD = rowD.createCell(i);
						cellD.setCellValue(columnsD[i]);
						sheetD.setColumnWidth(i, anchoColumnsD[i]);
					}

					// FILAS N: DETALLE
					int contD = 2;
					for (ReporteIntervencionListarParametroResponse obj : outDic.getObjeto()) {
						rowD = sheetD.createRow(contD);
						rowD.createCell(0).setCellValue(obj.getNomCampoExcel());
						rowD.createCell(1).setCellValue(obj.getDescripcion());
						rowD.createCell(2).setCellValue(obj.getDescripcionMaestra());
						rowD.createCell(3).setCellValue(obj.getCampoEsFk() == 1 ? "SI" : "NO");
						rowD.createCell(4).setCellValue(obj.getCampoIdmaestra());
						rowD.createCell(5).setCellValue(obj.getNomServicio());

						contD++;
					}
				} else {
					// FILA 1: TITULO
					Row rowD = sheetD.createRow(0);
					Cell cell = rowD.createCell(0);
					cell.setCellValue("DICCIONARIO DE DATOS");
					sheetD.addMergedRegion(new CellRangeAddress(0, 0, 0, 5));// MESCLA CELDAS

					// FILA 0: TITULOS
					rowD = sheetD.createRow(1);
					cell = rowD.createCell(0);
					cell.setCellValue("NO PUDO SER POSIBLE CARGAR EL DICCIONARIO, INTENTELO NUEVAMENTE MAS TARDE");
					sheetD.addMergedRegion(new CellRangeAddress(1, 1, 0, 5));// MESCLA CELDAS
				}

				workbook.write(stream);
				workbook.close();

				FileResponse resp = new FileResponse();
				resp.setNombre("Lista Intervenciones.xls");
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
			outF.setRCodigo(outU.getRCodigo());
			outF.setRMensaje(outU.getRMensaje());
		}
		log.info("[LISTAR REPORTE INTERVENCION XLSX][SERVICE][FIN]");
		return outF;
	}

	@Override
	public OutResponse<List<EntidadListarResponse>> listarEntidadPermitido(
			ReporteIntervencionListarEntidadPermitidoRequest req) {
		log.info("[LISTAR ENTIDAD PERMITIDO][SERVICE][INICIO]");
		OutResponse<List<EntidadListarResponse>> out = reporteDao.listarEntidadPermitido(req,
				listaServiciosToString(req.getListaServicioPermitido()));
		log.info("[LISTAR ENTIDAD PERMITIDO][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<List<LineaIntervencionListarResponse>> listarLineaInterPermitido(
			ReporteIntervencionListarLineaInterPermitidoRequest req) {
		log.info("[LISTAR LINEA INTER PERMITIDO][SERVICE][INICIO]");
		OutResponse<List<LineaIntervencionListarResponse>> out = reporteDao
				.listarLineaInterPermitido(listaServiciosToString(req.getListaServicioPermitido()));
		log.info("[LISTAR LINEA INTER PERMITIDO][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<List<ServicioListarResponse>> listarServicioPermitido(
			ReporteIntervencionListarServicioPermitidoRequest req) {
		log.info("[LISTAR SERVICIO PERMITIDO][SERVICE][INICIO]");
		OutResponse<List<ServicioListarResponse>> out = reporteDao.listarServicioPermitido(req,
				listaServiciosToString(req.getListaServicioPermitido()));
		log.info("[LISTAR SERVICIO PERMITIDO][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<List<ReporteIntervencionListarEstructuraPermitidoResponse>> listarEstructuraPermitido(
			ReporteIntervencionListarEstructuraPermitidoRequest req) {
		log.info("[LISTAR ESTRUCTURA PERMITIDO][SERVICE][INICIO]");
		OutResponse<List<ReporteIntervencionListarEstructuraPermitidoResponse>> out = reporteDao
				.listarEstructuraPermitido(req, listaServiciosToString(req.getListaServicioPermitido()));
		log.info("[LISTAR ESTRUCTURA PERMITIDO][SERVICE][FIN]");
		return out;
	}

	public String listaServiciosToString(List<Long> req) {
		log.info("[CONCATENAR LISTA SERVICIO][SERVICE][CONVERSION DETALLE][INICIO]");
		String listaServicio = "";
		if (req.size() > 0) {
			log.info("[CONCATENAR LISTA SERVICIO][SERVICE][CONVERSION DETALLE][CANT:" + req.size() + "]");
			for (Long rc : req) {
				listaServicio = listaServicio + ((rc != null) ? rc : "0") + ",";
			}
			listaServicio = listaServicio.substring(0, listaServicio.length() - 1);
			log.info("[CONCATENAR LISTA SERVICIO][SERVICE][CONVERSION DETALLE][" + listaServicio + "]");
		} else {
			log.info("[CONCATENAR LISTA SERVICIO][SERVICE][CONVERSION DETALLE][CANT:" + req.size() + "]");
		}
		return listaServicio;
	}

	@Override
	public OutResponse<List<ReporteParametroEstrucListarResponse>> listarParametroEstructuraXUsuario(
			ReporteParametroEstrucXUsuListarRequest req) {
		log.info("[LISTAR PARAMETRO ESTRUCTURA X USU][SERVICE][INICIO]");
		OutResponse<List<ReporteParametroEstrucListarResponse>> out = reporteDao.listarParametroEstructuraXUsuario(req);
		log.info("[LISTAR PARAMETRO ESTRUCTURA X USU][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<List<Map<String, Object>>> listarReporteIntervencionXUsuario(
			ReporteIntervencionXUsuarioListarRequest req) {
		log.info("[LISTAR REPORTE INTERVENCION X USUARIO][SERVICE][INICIO]");
		OutResponse<List<ReporteIntervencionXUsuarioListarMaestraResponse>> out = reporteDao
				.listarMaestraXEstructurasUsuario(req.getTipDocUsu(), req.getNroDocUsu(), req.getCodUsu());

		OutResponse<List<Map<String, Object>>> outF = new OutResponse<>();
		if (out.getRCodigo() == ConstanteUtil.R_COD_EXITO) {
			outF = reporteDao.listarReporteIntervencionXUsuario(req, out.getObjeto());
		} else {
			outF.setRCodigo(out.getRCodigo());
			outF.setRMensaje(out.getRMensaje());
		}

		log.info("[LISTAR REPORTE INTERVENCION X USUARIO][SERVICE][FIN]");
		return outF;
	}

	@Override
	public OutResponse<List<ReporteIntervencionListarUsuarioXDatosResponse>> listarUsuarioXDatos(
			ReporteIntervencionListarUsuarioXDatosRequest req) {
		log.info("[LISTAR USUARIO X DATOS][SERVICE][INICIO]");
		OutResponse<List<ReporteIntervencionListarUsuarioXDatosResponse>> out = reporteDao.listarUsuarioXDatos(req);
		log.info("[LISTAR USUARIO X DATOS][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<FileResponse> listarReporteIntervencionXUsuarioXlsx(
			ReporteIntervencionXUsuarioListarXlsxRequest req) {
		log.info("[LISTAR INTERVENCION X USUARIO XLSX][SERVICE][INICIO]");

		OutResponse<List<ReporteIntervencionXUsuarioListarMaestraResponse>> out = reporteDao
				.listarMaestraXEstructurasUsuario(req.getTipDocUsu(), req.getNroDocUsu(), req.getCodUsu());

		OutResponse<List<Map<String, Object>>> outU = new OutResponse<>();
		if (out.getRCodigo() == ConstanteUtil.R_COD_EXITO) {
			outU = reporteDao.listarReporteIntervencionXUsuarioXlsx(req, out.getObjeto());
		} else {
			outU.setRCodigo(out.getRCodigo());
			outU.setRMensaje(out.getRMensaje());
		}

		OutResponse<FileResponse> outF = new OutResponse<>();
		if (outU.getRCodigo() == ConstanteUtil.R_COD_EXITO) {
			try {
				List<String> columns = new ArrayList<>();
				List<String> descColumns = new ArrayList<>();
				List<Integer> anchoColumns = new ArrayList<>();

				columns.add("NRO");
				descColumns.add("Número");
				anchoColumns.add(3000);
				for (ReporteIntervencionXUsuarioListarXlsxDetRequest map : req.getListaMapeo()) {
					columns.add(map.getNomCampoExcel());
					descColumns.add(map.getDescCampoExcel());
					anchoColumns.add(7000);
				}

				Workbook workbook = new HSSFWorkbook();
				ByteArrayOutputStream stream = new ByteArrayOutputStream();

				Sheet sheet = workbook.createSheet("Usuarios");

				// FILA 1: DESCRIPCION TITULO
				Row row = sheet.createRow(0);
				for (int i = 0; i < descColumns.size(); i++) {
					Cell cell = row.createCell(i);
					cell.setCellValue(descColumns.get(i));
				}

				// FILA 0: TITULOS
				row = sheet.createRow(1);
				for (int i = 0; i < columns.size(); i++) {
					Cell cell = row.createCell(i);
					cell.setCellValue(columns.get(i));
					sheet.setColumnWidth(i, anchoColumns.get(i));
				}

				// FILAS N: DETALLE
				int cont = 2;
				for (Map<String, Object> obj : outU.getObjeto()) {
					row = sheet.createRow(cont);

					row.createCell(0).setCellValue(cont - 1);
					int cont2 = 1;
					for (ReporteIntervencionXUsuarioListarXlsxDetRequest mpa : req.getListaMapeo()) {
						row.createCell(cont2)
								.setCellValue(obj.get(mpa.getNomCampoExcel()) != null
										? obj.get(mpa.getNomCampoExcel()).toString()
										: "");
						cont2++;
					}
					cont++;
				}

				// HOJA DICCIONARIO
				OutResponse<List<ReporteIntervencionListarParametroResponse>> outDic = reporteDao
						.listarParametroXEstructura(req.getTipDocUsu(), req.getNroDocUsu(), req.getCodUsu());
				Sheet sheetD = workbook.createSheet("DICCIONARIO");
				if (outDic.getRCodigo() == ConstanteUtil.R_COD_EXITO) {
					String[] columnsD = { "Nombre campo", "Descripcion campo", "Descripcion categorias",
							"¿Campo categorizado?", "Identificativo de categorias", "Servicio" };
					int[] anchoColumnsD = { 5000, 20000, 20000, 5000, 7000, 20000 };

					// FILA 1: TITULO
					Row rowD = sheetD.createRow(0);
					Cell cell = rowD.createCell(0);
					cell.setCellValue("DICCIONARIO DE DATOS");
					sheetD.addMergedRegion(new CellRangeAddress(0, 0, 0, 5));// MESCLA CELDAS

					// FILA 0: TITULOS
					rowD = sheetD.createRow(1);
					for (int i = 0; i < columnsD.length; i++) {
						Cell cellD = rowD.createCell(i);
						cellD.setCellValue(columnsD[i]);
						sheetD.setColumnWidth(i, anchoColumnsD[i]);
					}

					// FILAS N: DETALLE
					int contD = 2;
					for (ReporteIntervencionListarParametroResponse obj : outDic.getObjeto()) {
						rowD = sheetD.createRow(contD);
						rowD.createCell(0).setCellValue(obj.getNomCampoExcel());
						rowD.createCell(1).setCellValue(obj.getDescripcion());
						rowD.createCell(2).setCellValue(obj.getDescripcionMaestra());
						rowD.createCell(3).setCellValue(obj.getCampoEsFk() == 1 ? "SI" : "NO");
						rowD.createCell(4).setCellValue(obj.getCampoIdmaestra());
						rowD.createCell(5).setCellValue(obj.getNomServicio());

						contD++;
					}
				} else {
					// FILA 1: TITULO
					Row rowD = sheetD.createRow(0);
					Cell cell = rowD.createCell(0);
					cell.setCellValue("DICCIONARIO DE DATOS");
					sheetD.addMergedRegion(new CellRangeAddress(0, 0, 0, 5));// MESCLA CELDAS

					// FILA 0: TITULOS
					rowD = sheetD.createRow(1);
					cell = rowD.createCell(0);
					cell.setCellValue("NO PUDO SER POSIBLE CARGAR EL DICCIONARIO, INTENTELO NUEVAMENTE MAS TARDE");
					sheetD.addMergedRegion(new CellRangeAddress(1, 1, 0, 5));// MESCLA CELDAS
				}

				workbook.write(stream);
				workbook.close();

				FileResponse resp = new FileResponse();
				resp.setNombre("Lista Intervenciones Individual.xls");
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
			outF.setRCodigo(outU.getRCodigo());
			outF.setRMensaje(outU.getRMensaje());
		}
		log.info("[LISTAR INTERVENCION X USUARIO XLSX][SERVICE][FIN]");
		return outF;
	}

	@Override
	public OutResponse<FileResponse> descargarPlantilla(ReportePlantillaRequest req) {
		log.info("[DESCARGAR PLANTILLA XLSX][SERVICE][INICIO]");

		OutResponse<FileResponse> out = new OutResponse<>();
		try {
			InputStream targetStream = this.getClass().getClassLoader()
					.getResourceAsStream(plantillaProperties.getExcel().get(req.getIdPlantilla()));

			if (targetStream != null) {
				FileResponse resp = new FileResponse();
				resp.setNombre("plantilla.xlsx");
				resp.setType("application/vnd.ms-excel");
				resp.setData(IOUtils.toByteArray(targetStream));

				out.setRCodigo(0);
				out.setRMensaje("EXITO");
				out.setObjeto(resp);
			} else {
				out.setRCodigo(1);
				out.setRMensaje("Archivo no existe");
				out.setObjeto(null);
			}
		} catch (IOException e) {
			log.info(ExceptionUtils.getStackTrace(e));
			out.setRCodigo(500);
			out.setRMensaje(e.getMessage());
		}
		log.info("[DESCARGAR PLANTILLA XLSX][SERVICE][FIN]");
		return out;
	}

}
