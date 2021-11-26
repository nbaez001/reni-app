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

import pe.gob.mimp.reni.dao.UsuarioDao;
import pe.gob.mimp.reni.dto.request.UsuarioAsociarRequest;
import pe.gob.mimp.reni.dto.request.UsuarioBuscarRequest;
import pe.gob.mimp.reni.dto.request.UsuarioEliminarRequest;
import pe.gob.mimp.reni.dto.request.UsuarioListarRequest;
import pe.gob.mimp.reni.dto.request.UsuarioModificarRequest;
import pe.gob.mimp.reni.dto.response.FileResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.UsuarioBuscarResponse;
import pe.gob.mimp.reni.dto.response.UsuarioListarResponse;
import pe.gob.mimp.reni.service.UsuarioService;
import pe.gob.mimp.reni.util.ConstanteUtil;

@Service
public class UsuarioServiceImpl implements UsuarioService {

	private static final Logger log = LoggerFactory.getLogger(UsuarioServiceImpl.class);

	@Autowired
	UsuarioDao usuarioDao;

	@Override
	public OutResponse<List<UsuarioListarResponse>> listarUsuario(UsuarioListarRequest req) {
		log.info("[LISTAR USUARIO][SERVICE][INICIO]");
		OutResponse<List<UsuarioListarResponse>> out = usuarioDao.listarUsuario(req);
		log.info("[LISTAR USUARIO][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> modificarUsuario(UsuarioModificarRequest req) {
		log.info("[MODIFICAR USUARIO][SERVICE][INICIO]");
		OutResponse<?> out = usuarioDao.modificarUsuario(req);
		log.info("[MODIFICAR USUARIO][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> eliminarUsuario(UsuarioEliminarRequest req) {
		log.info("[ELIMINAR USUARIO][SERVICE][INICIO]");
		OutResponse<?> out = usuarioDao.eliminarUsuario(req);
		log.info("[ELIMINAR USUARIO][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<UsuarioBuscarResponse> buscarUsuario(UsuarioBuscarRequest req) {
		log.info("[BUSCAR USUARIO][SERVICE][INICIO]");
		OutResponse<UsuarioBuscarResponse> out = usuarioDao.buscarUsuario(req);
		log.info("[BUSCAR USUARIO][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<?> asociarUsuario(UsuarioAsociarRequest req) {
		log.info("[ASOCIAR USUARIO][SERVICE][INICIO]");
		OutResponse<?> out = usuarioDao.asociarUsuario(req);
		log.info("[ASOCIAR USUARIO][SERVICE][FIN]");
		return out;
	}

	@Override
	public OutResponse<FileResponse> exportarListaUsuarioXlsx(UsuarioListarRequest c) {
		log.info("[EXPORTAR LISTA USUARIO][SERVICE][INICIO]");
		OutResponse<List<UsuarioListarResponse>> out = usuarioDao.listarUsuario(c);

		OutResponse<FileResponse> outF = new OutResponse<>();
		if (out.getRCodigo() == ConstanteUtil.R_COD_EXITO) {
			try {
				String[] columns = { "Nro", "Tiene documento", "Tipo documento", "Nro documento", "Nombre",
						"Apellido paterno", "Apellido materno", "Sexo", "Fecha nacimiento", "Estado" };
				int[] anchoColumns = { 1500, 5000, 5000, 7000, 10000, 10000, 10000, 4000, 7000, 4000 };

				Workbook workbook = new HSSFWorkbook();
				ByteArrayOutputStream stream = new ByteArrayOutputStream();

				Sheet sheet = workbook.createSheet("Usuarios");
				Row row = sheet.createRow(0);

				for (int i = 0; i < columns.length; i++) {
					Cell cell = row.createCell(i);
					cell.setCellValue(columns[i]);
					sheet.setColumnWidth(i, anchoColumns[i]);
				}

				SimpleDateFormat sdf = new SimpleDateFormat(ConstanteUtil.slash_ddMMyyyy);
				int cont = 1;
				for (UsuarioListarResponse obj : out.getObjeto()) {
					row = sheet.createRow(cont);
					row.createCell(0).setCellValue(cont);
					row.createCell(1).setCellValue(obj.getTieneDocIdent());
					row.createCell(2).setCellValue(obj.getTipDocumento());
					row.createCell(3).setCellValue(obj.getNroDocumento());
					row.createCell(4).setCellValue(obj.getNombre());
					row.createCell(5).setCellValue(obj.getApePaterno());
					row.createCell(6).setCellValue(obj.getApeMaterno());
					row.createCell(7).setCellValue(obj.getSexo());
					row.createCell(8)
							.setCellValue(obj.getFecNacimiento() != null ? sdf.format(obj.getFecNacimiento()) : "");
					row.createCell(9)
							.setCellValue(obj.getFlgActivo() == ConstanteUtil.FLG_ACTVO ? ConstanteUtil.DESC_ACTIVO
									: ConstanteUtil.DESC_INACTIVO);
					cont++;
				}
				workbook.write(stream);
				workbook.close();

				FileResponse resp = new FileResponse();
				resp.setNombre("Lista Usuarios.xls");
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
		log.info("[EXPORTAR LISTA USUARIO][SERVICE][FIN]");
		return outF;
	}

}
