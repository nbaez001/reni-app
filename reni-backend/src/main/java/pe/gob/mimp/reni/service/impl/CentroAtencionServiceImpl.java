package pe.gob.mimp.reni.service.impl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
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

import pe.gob.mimp.reni.dao.CentroAtencionDao;
import pe.gob.mimp.reni.dao.UbigeoDao;
import pe.gob.mimp.reni.dto.request.CentroAtencionAsociarServicioRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionCargaMasivaCentroListarRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionCargaMasivaDetalleRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionCargaMasivaRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionCargaMasivaServListarRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionCargaMasivaServicioRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionEliminarRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionEliminarServicioAsocRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionListarRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionModificarRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionRegistrarRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionServListarXCentroRequest;
import pe.gob.mimp.reni.dto.request.CentroAtencionServListarXTipCenRequest;
import pe.gob.mimp.reni.dto.response.CentroAtencionAsociarServicioResponse;
import pe.gob.mimp.reni.dto.response.CentroAtencionCargaMasivaCentroListarResponse;
import pe.gob.mimp.reni.dto.response.CentroAtencionCargaMasivaServListarResponse;
import pe.gob.mimp.reni.dto.response.CentroAtencionListarResponse;
import pe.gob.mimp.reni.dto.response.CentroAtencionRegistrarResponse;
import pe.gob.mimp.reni.dto.response.CentroAtencionServListarXCentroResponse;
import pe.gob.mimp.reni.dto.response.CentroAtencionServListarXTipCenResponse;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.UbigeoObtenerDescUbigeoResponse;
import pe.gob.mimp.reni.service.CentroAtencionService;
import pe.gob.mimp.reni.util.ConstanteUtil;
import pe.gob.mimp.reni.util.StringUtil;

@Service
public class CentroAtencionServiceImpl implements CentroAtencionService {

	private static final Logger log = LoggerFactory.getLogger(CentroAtencionServiceImpl.class);

	@Autowired
	CentroAtencionDao centroAtencionDao;

	@Autowired
	UbigeoDao ubigeoDao;

	@Override
	public OutResponse<List<CentroAtencionListarResponse>> listarCentroAtencion(CentroAtencionListarRequest req) {
		log.info("[LISTAR CENTRO ATENCION][SERVICE][INICIO]");
		OutResponse<List<CentroAtencionListarResponse>> out = centroAtencionDao.listarCentroAtencion(req);
		log.info("[LISTAR CENTRO ATENCION][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<List<CentroAtencionListarResponse>> listarCentroAtencionLigero(CentroAtencionListarRequest req) {
		log.info("[LISTAR CENTRO ATENCION][SERVICE][INICIO]");
		OutResponse<List<CentroAtencionListarResponse>> out = centroAtencionDao.listarCentroAtencion(req);
		log.info("[LISTAR CENTRO ATENCION][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<CentroAtencionRegistrarResponse> registrarCentroAtencion(CentroAtencionRegistrarRequest req) {
		log.info("[REGISTRAR CENTRO ATENCION][SERVICE][INICIO]");
		OutResponse<CentroAtencionRegistrarResponse> out = centroAtencionDao.registrarCentroAtencion(req);
		log.info("[REGISTRAR CENTRO ATENCION][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> modificarCentroAtencion(CentroAtencionModificarRequest req) {
		log.info("[MODIFICAR CENTRO ATENCION][SERVICE][INICIO]");
		OutResponse<?> out = centroAtencionDao.modificarCentroAtencion(req);
		log.info("[MODIFICAR CENTRO ATENCION][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> eliminarCentroAtencion(CentroAtencionEliminarRequest req) {
		log.info("[ELIMINAR CENTRO ATENCION][SERVICE][INICIO]");
		OutResponse<?> out = centroAtencionDao.eliminarCentroAtencion(req);
		log.info("[ELIMINAR CENTRO ATENCION][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<List<CentroAtencionServListarXTipCenResponse>> listarServicioXTipoCentro(
			CentroAtencionServListarXTipCenRequest req) {
		log.info("[LISTAR SERVICIO X TIPO CENTRO][SERVICE][INICIO]");
		OutResponse<List<CentroAtencionServListarXTipCenResponse>> out = centroAtencionDao
				.listarServicioXTipoCentro(req);
		log.info("[LISTAR SERVICIO X TIPO CENTRO][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<List<CentroAtencionServListarXCentroResponse>> listarServicioXCentro(
			CentroAtencionServListarXCentroRequest req) {
		log.info("[LISTAR SERVICIO X CENTRO][SERVICE][INICIO]");
		OutResponse<List<CentroAtencionServListarXCentroResponse>> out = centroAtencionDao.listarServicioXCentro(req);
		log.info("[LISTAR SERVICIO X CENTRO][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<CentroAtencionAsociarServicioResponse> registrarServicioCentroAtencion(
			CentroAtencionAsociarServicioRequest req) {
		log.info("[ASOCIAR SERVICIO A CENTRO][SERVICE][INICIO]");
		OutResponse<CentroAtencionAsociarServicioResponse> out = centroAtencionDao.registrarServicioCentroAtencion(req);
		log.info("[ASOCIAR SERVICIO A CENTRO][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> eliminarServicioCentroAtencion(CentroAtencionEliminarServicioAsocRequest req) {
		log.info("[ELIMINAR SERVICIO DE CENTRO][SERVICE][INICIO]");
		OutResponse<?> out = centroAtencionDao.eliminarServicioCentroAtencion(req);
		log.info("[ELIMINAR SERVICIO DE CENTRO][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<List<CentroAtencionCargaMasivaServListarResponse>> listarServicio(
			CentroAtencionCargaMasivaServListarRequest req) {
		log.info("[LISTAR SERVICIO][SERVICE][INICIO]");
		OutResponse<List<CentroAtencionCargaMasivaServListarResponse>> out = centroAtencionDao
				.listarServicio(listaServiciosToString(req.getListaServicio()));
		log.info("[LISTAR SERVICIO][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<List<CentroAtencionCargaMasivaCentroListarResponse>> listarCentro(
			CentroAtencionCargaMasivaCentroListarRequest req) {
		log.info("[LISTAR CENTRO ATENCION][SERVICE][INICIO]");
		OutResponse<List<CentroAtencionCargaMasivaCentroListarResponse>> out = centroAtencionDao
				.listarCentro(listaCentrosToString(req.getListaCentro()));
		log.info("[LISTAR CENTRO ATENCION][SERVICE][FIN]");
		return out;
	}

	public String listaServiciosToString(List<String> req) {
		log.info("[LISTAR SERVICIO][SERVICE][CONVERSION DETALLE][INICIO]");
		String listaServicio = "";
		if (req.size() > 0) {
			log.info("[LISTAR SERVICIO][SERVICE][CONVERSION DETALLE][CANT:" + req.size() + "]");
			for (String rc : req) {
				listaServicio = listaServicio + ((rc != null) ? rc : "(NULL)") + "|";
			}
			listaServicio = listaServicio.substring(0, listaServicio.length() - 1);
			log.info("[LISTAR SERVICIO][SERVICE][CONVERSION DETALLE][" + listaServicio + "]");
		} else {
			log.info("[LISTAR SERVICIO][SERVICE][CONVERSION DETALLE][CANT:" + req.size() + "]");
		}
		return listaServicio;
	}

	public String listaCentrosToString(List<String> req) {
		log.info("[LISTAR CENTRO ATENCION][SERVICE][CONVERSION DETALLE][INICIO]");
		String listaServicio = "";
		if (req.size() > 0) {
			log.info("[LISTAR CENTRO ATENCION][SERVICE][CONVERSION DETALLE][CANT:" + req.size() + "]");
			for (String rc : req) {
				listaServicio = listaServicio + ((rc != null) ? rc : "(NULL)") + "|";
			}
			listaServicio = listaServicio.substring(0, listaServicio.length() - 1);
			log.info("[LISTAR CENTRO ATENCION][SERVICE][CONVERSION DETALLE][" + listaServicio + "]");
		} else {
			log.info("[LISTAR CENTRO ATENCION][SERVICE][CONVERSION DETALLE][CANT:" + req.size() + "]");
		}
		return listaServicio;
	}

	@Override
	@Transactional(rollbackFor = { Exception.class })
	public OutResponse<?> cargaMasivaCentro(CentroAtencionCargaMasivaRequest req) throws Exception {
		log.info("[CARGA MASIVA CENTRO ATENCION][SERVICE][INICIO]");
		OutResponse<?> out = new OutResponse<>();
		out.setRCodigo(0);
		out.setRMensaje("Exito");

		for (CentroAtencionCargaMasivaDetalleRequest obj : req.getListaCentro()) {
			OutResponse<Long> out2 = centroAtencionDao.cargaMasivaCentroAtencion(obj, req.getIdUsuarioCrea());
			if (obj.getListaServicio().size() > 0) {
				for (CentroAtencionCargaMasivaServicioRequest se : obj.getListaServicio()) {
					centroAtencionDao.cargaMasivaCentroAtencionAsocServicio(out2.getObjeto(), se.getIdServicio(),
							req.getIdUsuarioCrea());
				}
			}
		}
		log.info("[CARGA MASIVA CENTRO ATENCION][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<FileResponse> exportarListaCentroAtencionXlsx(CentroAtencionListarRequest c) {
		log.info("[EXPORTAR LISTA SERVICIO][SERVICE][INICIO]");
		OutResponse<List<CentroAtencionListarResponse>> out = listarCentroAtencion(c);

		OutResponse<FileResponse> outF = new OutResponse<>();
		if (out.getRCodigo() == ConstanteUtil.R_COD_EXITO) {
			try {
				String[] columns = { "Nro", "Codigo", "Nombre", "Tipo Centro", "Fecha creacion", "Ubigeo",
						"Departamento", "Provincia", "Distrito", "Area residencia", "Direccion", "Telefono", "Estado" };
				int[] anchoColumns = { 1500, 6000, 13000, 13000, 5000, 5000, 9000, 9000, 9000, 13000, 13000, 6000,
						4000 };

				Workbook workbook = new HSSFWorkbook();
				ByteArrayOutputStream stream = new ByteArrayOutputStream();

				Sheet sheet = workbook.createSheet("Centro atencion");
				Row row = sheet.createRow(0);

				for (int i = 0; i < columns.length; i++) {
					Cell cell = row.createCell(i);
					cell.setCellValue(columns[i]);
					sheet.setColumnWidth(i, anchoColumns[i]);
				}

				SimpleDateFormat sdf = new SimpleDateFormat(ConstanteUtil.slash_ddMMyyyy);

				int cont = 1;
				for (CentroAtencionListarResponse obj : out.getObjeto()) {
					row = sheet.createRow(cont);
					row.createCell(0).setCellValue(cont);
					row.createCell(1).setCellValue(obj.getCodigo());
					row.createCell(2).setCellValue(obj.getNombre());
					row.createCell(3).setCellValue(obj.getNomTipoCentro());
					row.createCell(4)
							.setCellValue((obj.getFechaCreacion() != null) ? sdf.format(obj.getFechaCreacion()) : "");
					row.createCell(5).setCellValue(obj.getUbigeo());
					row.createCell(6).setCellValue(obj.getNomDepartamento());
					row.createCell(7).setCellValue(obj.getNomProvincia());
					row.createCell(8).setCellValue(obj.getNomDistrito());
					row.createCell(9).setCellValue(obj.getAreaResid());
					row.createCell(10).setCellValue(obj.getDireccion());
					row.createCell(11).setCellValue(obj.getNroTelefono());
					row.createCell(12)
							.setCellValue(obj.getFlgActivo() == ConstanteUtil.FLG_ACTVO ? ConstanteUtil.DESC_ACTIVO
									: ConstanteUtil.DESC_INACTIVO);
					cont++;
				}
				workbook.write(stream);
				workbook.close();

				FileResponse resp = new FileResponse();
				resp.setNombre("Lista Centro atencion.xls");
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

	@Override
	public OutResponse<?> actUbigeosCentroAtencion() {
		log.info("[ACTUALIZAR UBIGEO CENTRO ATENCION][SERVICE][INICIO]");
		CentroAtencionListarRequest req = new CentroAtencionListarRequest();
		OutResponse<List<CentroAtencionListarResponse>> out = listarCentroAtencion(req);

		for (CentroAtencionListarResponse ce : out.getObjeto()) {
			if (!StringUtil.isNullOrBlank(ce.getUbigeo())) {
				log.info("[ACTUALIZAR UBIGEO CENTRO ATENCION][SERVICE][CONSULTA UBIGEO]");
				OutResponse<UbigeoObtenerDescUbigeoResponse> out2 = ubigeoDao.obtenerDescripcionUbigeo(ce.getUbigeo());
				if (out2.getRCodigo() == ConstanteUtil.R_COD_EXITO) {
					centroAtencionDao.actUbigeosCentroAtencion(ce.getIdCentroAtencion(),
							out2.getObjeto().getDesDepartamento(), out2.getObjeto().getDesProvincia(),
							out2.getObjeto().getDesDistrito(), 1L);
				}
			}
		}

		out.setObjeto(null);
		log.info("[ACTUALIZAR UBIGEO ATENCION][SERVICE][FIN]");
		return out;
	}
	
}
