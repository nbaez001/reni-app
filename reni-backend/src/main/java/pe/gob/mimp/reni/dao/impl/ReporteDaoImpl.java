package pe.gob.mimp.reni.dao.impl;

import java.sql.Types;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import pe.gob.mimp.reni.dao.ReporteDao;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarEntidadPermitidoRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarEstructuraPermitidoRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarServicioPermitidoRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarUsuarioXDatosRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionListarXlsxRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionXUsuarioListarMaestraResponse;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionXUsuarioListarRequest;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionXUsuarioListarXlsxRequest;
import pe.gob.mimp.reni.dto.request.ReporteParametroEstrucXUsuListarRequest;
import pe.gob.mimp.reni.dto.response.EntidadListarResponse;
import pe.gob.mimp.reni.dto.response.LineaIntervencionListarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.ReporteIntervencionListarEstructuraPermitidoResponse;
import pe.gob.mimp.reni.dto.response.ReporteIntervencionListarMaestraResponse;
import pe.gob.mimp.reni.dto.response.ReporteIntervencionListarParametroResponse;
import pe.gob.mimp.reni.dto.response.ReporteIntervencionListarUsuarioXDatosResponse;
import pe.gob.mimp.reni.dto.response.ReporteParametroEstrucListarResponse;
import pe.gob.mimp.reni.dto.response.ServicioListarResponse;
import pe.gob.mimp.reni.dto.response.mapper.EntidadListarResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.LineaIntervencionListarResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.ReporteExportarListaUsuariosXlsxResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.ReporteIntervencionListarEstructuraPermitidoResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.ReporteIntervencionListarMaestraResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.ReporteIntervencionListarParametroResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.ReporteIntervencionListarResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.ReporteIntervencionListarUsuarioXDatosResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.ReporteIntervencionXUsuarioListarMaestraResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.ReporteIntervencionXUsuarioListarResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.ReporteIntervencionXUsuarioListarXlsxResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.ReporteParametroEstrucListarResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.ServicioListarResponseMapper;
import pe.gob.mimp.reni.util.ConstanteUtil;
import pe.gob.mimp.reni.util.MapUtil;

@Repository
public class ReporteDaoImpl implements ReporteDao {

	private static final Logger log = LoggerFactory.getLogger(ReporteDaoImpl.class);

	@Autowired
	DataSource dataSource;

	@Override
	public OutResponse<List<ReporteParametroEstrucListarResponse>> listarParametroEstructura(String lEstructura) {
		log.info("[LISTAR PARAMETRO ESTRUCTURA][DAO][INICIO]");
		OutResponse<List<ReporteParametroEstrucListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_REPORTE).withProcedureName("SP_L_PARAMETRO_ESTRUC")
					.returningResultSet(ConstanteUtil.R_LISTA, new ReporteParametroEstrucListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_L_ID_ESTRUCTURA", lEstructura, Types.VARCHAR);
			log.info("[LISTAR PARAMETRO ESTRUCTURA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR PARAMETRO ESTRUCTURA][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR PARAMETRO ESTRUCTURA][DAO][EXITO]");
				List<ReporteParametroEstrucListarResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR PARAMETRO ESTRUCTURA][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR PARAMETRO ESTRUCTURA][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR PARAMETRO ESTRUCTURA][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<Map<String, Object>>> listarReporteIntervencion(ReporteIntervencionListarRequest req,
			List<ReporteIntervencionListarMaestraResponse> lMaestra) {
		log.info("[LISTAR REPORTE INTERVENCION][DAO][INICIO]");
		OutResponse<List<Map<String, Object>>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_REPORTE).withProcedureName("SP_L_REPORTE_INTERVENCION")
					.returningResultSet(ConstanteUtil.R_LISTA,
							new ReporteIntervencionListarResponseMapper(req.getListaMapeo(), lMaestra));

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_SQL_FIELDS", req.getSqlFields(), Types.CLOB);
			in.addValue("P_SQL_TABLES", req.getSqlTables(), Types.CLOB);
			log.info("[LISTAR REPORTE INTERVENCION][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR REPORTE INTERVENCION][DAO][OUTPUT PROCEDURE][" + out.size() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR REPORTE INTERVENCION][DAO][EXITO]");
				List<Map<String, Object>> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR REPORTE INTERVENCION][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR REPORTE INTERVENCION][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR REPORTE INTERVENCION][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<ReporteIntervencionListarMaestraResponse>> listarMaestraXEstructura(String req) {
		log.info("[LISTAR MAESTRA X ESTRUCTURA][DAO][INICIO]");
		OutResponse<List<ReporteIntervencionListarMaestraResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_REPORTE).withProcedureName("SP_L_MAESTRA_X_ESTRUCTURA")
					.returningResultSet(ConstanteUtil.R_LISTA, new ReporteIntervencionListarMaestraResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_L_ESTRUCTURA", req, Types.VARCHAR);
			log.info("[LISTAR MAESTRA X ESTRUCTURA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR MAESTRA X ESTRUCTURA][DAO][OUTPUT PROCEDURE][" + out.size() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR MAESTRA X ESTRUCTURA][DAO][EXITO]");
				List<ReporteIntervencionListarMaestraResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR MAESTRA X ESTRUCTURA][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR MAESTRA X ESTRUCTURA][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR MAESTRA X ESTRUCTURA][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<ReporteIntervencionListarParametroResponse>> listarParametroXEstructura(String req) {
		log.info("[LISTAR PARAMETRO X ESTRUCTURA][DAO][INICIO]");
		OutResponse<List<ReporteIntervencionListarParametroResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_REPORTE).withProcedureName("SP_L_PARAM_X_ESTRUCTURA")
					.returningResultSet(ConstanteUtil.R_LISTA, new ReporteIntervencionListarParametroResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_L_ESTRUCTURA", req, Types.VARCHAR);
			log.info("[LISTAR PARAMETRO X ESTRUCTURA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR PARAMETRO X ESTRUCTURA][DAO][OUTPUT PROCEDURE][" + out.size() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR PARAMETRO X ESTRUCTURA][DAO][EXITO]");
				List<ReporteIntervencionListarParametroResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR PARAMETRO X ESTRUCTURA][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR PARAMETRO X ESTRUCTURA][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR PARAMETRO X ESTRUCTURA][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<Map<String, Object>>> listarReporteIntervencionXlsx(ReporteIntervencionListarXlsxRequest c,
			List<ReporteIntervencionListarMaestraResponse> lMaestra) {
		log.info("[LISTAR REPORTE INTERVENCION XLSX][DAO][INICIO]");
		OutResponse<List<Map<String, Object>>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_REPORTE).withProcedureName("SP_L_REPORTE_INTERVENCION")
					.returningResultSet(ConstanteUtil.R_LISTA,
							new ReporteExportarListaUsuariosXlsxResponseMapper(c.getListaMapeo(), lMaestra));

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_SQL_FIELDS", c.getSqlFields(), Types.CLOB);
			in.addValue("P_SQL_TABLES", c.getSqlTables(), Types.CLOB);
			log.info("[LISTAR REPORTE INTERVENCION XLSX][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR REPORTE INTERVENCION XLSX][DAO][OUTPUT PROCEDURE][" + out + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR REPORTE INTERVENCION XLSX][DAO][EXITO]");
				List<Map<String, Object>> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR REPORTE INTERVENCION XLSX][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR REPORTE INTERVENCION XLSX][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR REPORTE INTERVENCION XLSX][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<EntidadListarResponse>> listarEntidadPermitido(
			ReporteIntervencionListarEntidadPermitidoRequest req, String lServicio) {
		log.info("[LISTAR ENTIDAD PERMITIDO][DAO][INICIO]");
		OutResponse<List<EntidadListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_REPORTE).withProcedureName("SP_L_ENTIDAD_PERMITIDO")
					.returningResultSet(ConstanteUtil.R_LISTA, new EntidadListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NOMBRE", req.getNombre(), Types.VARCHAR);
			in.addValue("P_L_SERVICIO", lServicio, Types.VARCHAR);
			log.info("[LISTAR ENTIDAD PERMITIDO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR ENTIDAD PERMITIDO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR ENTIDAD PERMITIDO][DAO][EXITO]");
				List<EntidadListarResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR ENTIDAD PERMITIDO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR ENTIDAD PERMITIDO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR ENTIDAD PERMITIDO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<LineaIntervencionListarResponse>> listarLineaInterPermitido(String lServicio) {
		log.info("[LISTAR LINEA INTER PERMITIDO][DAO][INICIO]");
		OutResponse<List<LineaIntervencionListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_REPORTE).withProcedureName("SP_L_LINEA_INTER_PERMITIDO")
					.returningResultSet(ConstanteUtil.R_LISTA, new LineaIntervencionListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_L_SERVICIO", lServicio, Types.VARCHAR);
			log.info("[LISTAR LINEA INTER PERMITIDO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR LINEA INTER PERMITIDO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR LINEA INTER PERMITIDO][DAO][EXITO]");
				List<LineaIntervencionListarResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR LINEA INTER PERMITIDO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR LINEA INTER PERMITIDO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR LINEA INTER PERMITIDO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<ServicioListarResponse>> listarServicioPermitido(
			ReporteIntervencionListarServicioPermitidoRequest req, String lServicio) {
		log.info("[LISTAR SERVICIO PERMITIDO][DAO][INICIO]");
		OutResponse<List<ServicioListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_REPORTE).withProcedureName("SP_L_SERVICIO_PERMITIDO")
					.returningResultSet(ConstanteUtil.R_LISTA, new ServicioListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_ID_ENTIDAD", req.getIdEntidad(), Types.NUMERIC);
			in.addValue("P_ID_LINEA_INTERV", req.getIdLineaIntervencion(), Types.NUMERIC);
			in.addValue("P_NOM_SERVICIO", req.getNomServicio(), Types.VARCHAR);
			in.addValue("P_L_SERVICIO", lServicio, Types.VARCHAR);
			log.info("[LISTAR SERVICIO PERMITIDO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR SERVICIO PERMITIDO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR SERVICIO PERMITIDO][DAO][EXITO]");
				List<ServicioListarResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR SERVICIO PERMITIDO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR SERVICIO PERMITIDO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR SERVICIO PERMITIDO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<ReporteIntervencionListarEstructuraPermitidoResponse>> listarEstructuraPermitido(
			ReporteIntervencionListarEstructuraPermitidoRequest req, String lServicio) {
		log.info("[LISTAR ESTRUCTURA PERMITIDO][DAO][INICIO]");
		OutResponse<List<ReporteIntervencionListarEstructuraPermitidoResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_REPORTE).withProcedureName("SP_L_ESTRUCTURA_PERMITIDO")
					.returningResultSet(ConstanteUtil.R_LISTA,
							new ReporteIntervencionListarEstructuraPermitidoResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_ID_ENTIDAD", req.getIdEntidad(), Types.NUMERIC);
			in.addValue("P_ID_LINEA_INTERV", req.getIdLineaIntervencion(), Types.NUMERIC);
			in.addValue("P_ID_SERVICIO", req.getIdServicio(), Types.NUMERIC);
			in.addValue("P_L_SERVICIO", lServicio, Types.VARCHAR);
			log.info("[LISTAR ESTRUCTURA PERMITIDO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR ESTRUCTURA PERMITIDO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR ESTRUCTURA PERMITIDO][DAO][EXITO]");
				List<ReporteIntervencionListarEstructuraPermitidoResponse> res = MapUtil
						.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR ESTRUCTURA PERMITIDO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR ESTRUCTURA PERMITIDO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR ESTRUCTURA PERMITIDO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<ReporteParametroEstrucListarResponse>> listarParametroEstructuraXUsuario(
			ReporteParametroEstrucXUsuListarRequest req) {
		log.info("[LISTAR PARAMETRO ESTRUCTURA USU][DAO][INICIO]");
		OutResponse<List<ReporteParametroEstrucListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_REPORTE).withProcedureName("SP_L_PARAMETRO_ESTRUC_X_USU")
					.returningResultSet(ConstanteUtil.R_LISTA, new ReporteParametroEstrucListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_TIP_DOC_USU", req.getTipDocUsu(), Types.VARCHAR);
			in.addValue("P_NRO_DOC_USU", req.getNroDocUsu(), Types.VARCHAR);
			in.addValue("P_COD_USU", req.getCodUsu(), Types.VARCHAR);
			log.info("[LISTAR PARAMETRO ESTRUCTURA USU][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR PARAMETRO ESTRUCTURA USU][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR PARAMETRO ESTRUCTURA USU][DAO][EXITO]");
				List<ReporteParametroEstrucListarResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR PARAMETRO ESTRUCTURA USU][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR PARAMETRO ESTRUCTURA USU][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR PARAMETRO ESTRUCTURA USU][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<ReporteIntervencionXUsuarioListarMaestraResponse>> listarMaestraXEstructurasUsuario(
			String tipDocUsu, String nroDocUsu, String codUsu) {
		log.info("[LISTAR MAESTRA X ESTRUCTURA USU][DAO][INICIO]");
		OutResponse<List<ReporteIntervencionXUsuarioListarMaestraResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_REPORTE)
					.withProcedureName("SP_L_MAESTRA_X_ESTRUCTURA_USU").returningResultSet(ConstanteUtil.R_LISTA,
							new ReporteIntervencionXUsuarioListarMaestraResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_TIP_DOC_USU", tipDocUsu, Types.VARCHAR);
			in.addValue("P_NRO_DOC_USU", nroDocUsu, Types.VARCHAR);
			in.addValue("P_COD_USU", codUsu, Types.VARCHAR);
			log.info("[LISTAR MAESTRA X ESTRUCTURA USU][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR MAESTRA X ESTRUCTURA USU][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR MAESTRA X ESTRUCTURA USU][DAO][EXITO]");
				List<ReporteIntervencionXUsuarioListarMaestraResponse> res = MapUtil
						.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR MAESTRA X ESTRUCTURA USU][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR MAESTRA X ESTRUCTURA USU][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR MAESTRA X ESTRUCTURA USU][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<Map<String, Object>>> listarReporteIntervencionXUsuario(
			ReporteIntervencionXUsuarioListarRequest req,
			List<ReporteIntervencionXUsuarioListarMaestraResponse> lMaestra) {
		log.info("[LISTAR REPORTE INTERVENCION X USUARIO][DAO][INICIO]");
		OutResponse<List<Map<String, Object>>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_REPORTE).withProcedureName("SP_L_REPORTE_INTERVEN_X_USU")
					.returningResultSet(ConstanteUtil.R_LISTA,
							new ReporteIntervencionXUsuarioListarResponseMapper(req.getListaMapeo(), lMaestra));

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_SQL_FIELDS", req.getSqlFields(), Types.CLOB);
			in.addValue("P_SQL_TABLES", req.getSqlTables(), Types.CLOB);
			log.info("[LISTAR REPORTE INTERVENCION X USUARIO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR REPORTE INTERVENCION X USUARIO][DAO][OUTPUT PROCEDURE][" + out + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR REPORTE INTERVENCION X USUARIO][DAO][EXITO]");
				List<Map<String, Object>> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR REPORTE INTERVENCION X USUARIO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR REPORTE INTERVENCION X USUARIO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR REPORTE INTERVENCION X USUARIO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<ReporteIntervencionListarUsuarioXDatosResponse>> listarUsuarioXDatos(
			ReporteIntervencionListarUsuarioXDatosRequest req) {
		log.info("[LISTAR USUARIO X DATOS][DAO][INICIO]");
		OutResponse<List<ReporteIntervencionListarUsuarioXDatosResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_REPORTE).withProcedureName("SP_L_USUARIO_X_DATOS")
					.returningResultSet(ConstanteUtil.R_LISTA,
							new ReporteIntervencionListarUsuarioXDatosResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_IDT_TIP_DOC", req.getTipDocumento(), Types.VARCHAR);
			in.addValue("P_NUMERO_DOC", req.getNroDocumento(), Types.VARCHAR);
			in.addValue("P_NOMBRE", req.getNombre(), Types.VARCHAR);
			in.addValue("P_APE_PATERNO", req.getApePaterno(), Types.VARCHAR);
			in.addValue("P_APE_MATERNO", req.getApeMaterno(), Types.VARCHAR);
			in.addValue("P_IDT_SEXO", req.getTipSexo(), Types.VARCHAR);
			log.info("[LISTAR USUARIO X DATOS][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR USUARIO X DATOS][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR USUARIO X DATOS][DAO][EXITO]");
				List<ReporteIntervencionListarUsuarioXDatosResponse> res = MapUtil
						.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR USUARIO X DATOS][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR USUARIO X DATOS][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR USUARIO X DATOS][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<Map<String, Object>>> listarReporteIntervencionXUsuarioXlsx(
			ReporteIntervencionXUsuarioListarXlsxRequest req,
			List<ReporteIntervencionXUsuarioListarMaestraResponse> lMaestra) {
		log.info("[LISTAR REPORTE INTERVENCION X USUARIO XLSX][DAO][INICIO]");
		OutResponse<List<Map<String, Object>>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_REPORTE)
					.withProcedureName("SP_L_REPORT_INTERV_X_USU_XLSX").returningResultSet(ConstanteUtil.R_LISTA,
							new ReporteIntervencionXUsuarioListarXlsxResponseMapper(req.getListaMapeo(), lMaestra));

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_SQL_FIELDS", req.getSqlFields(), Types.CLOB);
			in.addValue("P_SQL_TABLES", req.getSqlTables(), Types.CLOB);
			log.info("[LISTAR REPORTE INTERVENCION X USUARIO XLSX][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR REPORTE INTERVENCION X USUARIO XLSX][DAO][OUTPUT PROCEDURE][" + out + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR REPORTE INTERVENCION X USUARIO XLSX][DAO][EXITO]");
				List<Map<String, Object>> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR REPORTE INTERVENCION X USUARIO XLSX][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR REPORTE INTERVENCION X USUARIO XLSX][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR REPORTE INTERVENCION X USUARIO XLSX][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<ReporteIntervencionListarParametroResponse>> listarParametroXEstructura(String tipDocUsu,
			String nroDocUsu, String codUsu) {
		log.info("[LISTAR PARAMETRO X ESTRUCTURA USU][DAO][INICIO]");
		OutResponse<List<ReporteIntervencionListarParametroResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_REPORTE).withProcedureName("SP_L_PARAM_X_ESTRUC_USU")
					.returningResultSet(ConstanteUtil.R_LISTA, new ReporteIntervencionListarParametroResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_TIP_DOC_USU", tipDocUsu, Types.VARCHAR);
			in.addValue("P_NRO_DOC_USU", nroDocUsu, Types.VARCHAR);
			in.addValue("P_COD_USU", codUsu, Types.VARCHAR);
			log.info("[LISTAR PARAMETRO X ESTRUCTURA USU][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR PARAMETRO X ESTRUCTURA USU][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR PARAMETRO X ESTRUCTURA USU][DAO][EXITO]");
				List<ReporteIntervencionListarParametroResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR PARAMETRO X ESTRUCTURA USU][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR PARAMETRO X ESTRUCTURA USU][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR PARAMETRO X ESTRUCTURA USU][DAO][FIN]");
		return outResponse;
	}

}
