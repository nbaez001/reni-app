package pe.gob.mimp.reni.dao.impl;

import java.sql.SQLException;
import java.sql.Types;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import pe.gob.mimp.reni.dao.MaestraDao;
import pe.gob.mimp.reni.dto.request.MaestraCargaMasivaDetalleRequest;
import pe.gob.mimp.reni.dto.request.MaestraEliminarRequest;
import pe.gob.mimp.reni.dto.request.MaestraListarExportRequest;
import pe.gob.mimp.reni.dto.request.MaestraListarRequest;
import pe.gob.mimp.reni.dto.request.MaestraModificarRequest;
import pe.gob.mimp.reni.dto.request.MaestraRegistrarRequest;
import pe.gob.mimp.reni.dto.request.MaestraSubitemEliminarRequest;
import pe.gob.mimp.reni.dto.request.MaestraSubitemListarRequest;
import pe.gob.mimp.reni.dto.request.MaestraSubitemModificarRequest;
import pe.gob.mimp.reni.dto.request.MaestraSubitemRegistrarRequest;
import pe.gob.mimp.reni.dto.response.MaestraCargaMasivaListarMaeResponse;
import pe.gob.mimp.reni.dto.response.MaestraListarExportResponse;
import pe.gob.mimp.reni.dto.response.MaestraListarResponse;
import pe.gob.mimp.reni.dto.response.MaestraRegistrarResponse;
import pe.gob.mimp.reni.dto.response.MaestraSubitemListarResponse;
import pe.gob.mimp.reni.dto.response.MaestraSubitemRegistrarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.mapper.MaestraCargaMasivaListarMaeResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.MaestraListarExportResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.MaestraListarResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.MaestraSubitemListarResponseMapper;
import pe.gob.mimp.reni.util.AdressUtil;
import pe.gob.mimp.reni.util.ConstanteUtil;
import pe.gob.mimp.reni.util.MapUtil;

@Repository
public class MaestraDaoImpl implements MaestraDao {

	private static final Logger log = LoggerFactory.getLogger(MaestraDaoImpl.class);

	@Autowired
	DataSource dataSource;

	@Autowired
	private HttpServletRequest httpRequest;

	@Override
	public OutResponse<List<MaestraListarResponse>> listarMaestra(MaestraListarRequest req) {
		log.info("[LISTAR MAESTRA][DAO][INICIO]");
		OutResponse<List<MaestraListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_MAESTRA).withProcedureName("SP_L_MAESTRA")
					.returningResultSet(ConstanteUtil.R_LISTA, new MaestraListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_FLG_ACTIVO", req.getFlgActivo(), Types.NUMERIC);
			in.addValue("P_NOMBRE", req.getNombre(), Types.VARCHAR);
//			in.addValue("P_INDEX", req.getIndex(), Types.NUMERIC);
//			in.addValue("P_SIZE", req.getSize(), Types.NUMERIC);
//			in.addValue("P_LENGTH", req.getLength(), Types.NUMERIC);
			log.info("[LISTAR MAESTRA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR MAESTRA][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR MAESTRA][DAO][EXITO]");
				List<MaestraListarResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));
//				Long length = MapUtil.getLong(out.get("R_LENGTH"));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
//				outResponse.setLength(length);
			} else {
				log.info("[LISTAR MAESTRA][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR MAESTRA][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR MAESTRA][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<MaestraRegistrarResponse> registrarMaestra(MaestraRegistrarRequest req) {
		log.info("[REGISTRAR MAESTRA][DAO][INICIO]");
		OutResponse<MaestraRegistrarResponse> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_MAESTRA).withProcedureName("SP_I_MAESTRA");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_TXT_ID_TABLA", req.getIdTabla(), Types.VARCHAR);
			in.addValue("P_TXT_CODIGO", req.getCodigo(), Types.VARCHAR);
			in.addValue("P_TXT_NOMBRE", req.getNombre(), Types.VARCHAR);
			in.addValue("P_TXT_DESCRIPCION", req.getDescripcion(), Types.VARCHAR);
			in.addValue("P_NID_USUARIO_CREACION", req.getIdUsuarioCrea(), Types.NUMERIC);
			in.addValue("P_TXT_PC_CREACION", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_CREACION", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[REGISTRAR MAESTRA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[REGISTRAR MAESTRA][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[REGISTRAR MAESTRA][DAO][EXITO]");
				MaestraRegistrarResponse res = new MaestraRegistrarResponse();
				res.setIdMaestra(MapUtil.getLong(out.get("R_ID")));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[REGISTRAR MAESTRA][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[REGISTRAR MAESTRA][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[REGISTRAR MAESTRA][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> modificarMaestra(MaestraModificarRequest req) {
		log.info("[MODIFICAR MAESTRA][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_MAESTRA).withProcedureName("SP_U_MAESTRA");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_MAESTRA", req.getIdMaestra(), Types.NUMERIC);
			in.addValue("P_TXT_ID_TABLA", req.getIdTabla(), Types.VARCHAR);
			in.addValue("P_TXT_CODIGO", req.getCodigo(), Types.VARCHAR);
			in.addValue("P_TXT_NOMBRE", req.getNombre(), Types.VARCHAR);
			in.addValue("P_TXT_DESCRIPCION", req.getDescripcion(), Types.VARCHAR);
			in.addValue("P_NID_USUARIO_MODIF", req.getIdUsuarioModif(), Types.NUMERIC);
			in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[MODIFICAR MAESTRA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[MODIFICAR MAESTRA][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[MODIFICAR MAESTRA][DAO][EXITO]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[MODIFICAR MAESTRA][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[MODIFICAR MAESTRA][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[MODIFICAR MAESTRA][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> eliminarMaestra(MaestraEliminarRequest req) {
		log.info("[ELIMINAR MAESTRA][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_MAESTRA).withProcedureName("SP_D_MAESTRA");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_MAESTRA", req.getIdMaestra(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_MODIF", req.getIdUsuarioModif(), Types.NUMERIC);
			in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[ELIMINAR MAESTRA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[ELIMINAR MAESTRA][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[ELIMINAR MAESTRA][DAO][EXITO]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[ELIMINAR MAESTRA][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[ELIMINAR MAESTRA][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[ELIMINAR MAESTRA][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<MaestraSubitemListarResponse>> listarMaestraSubitem(MaestraSubitemListarRequest req) {
		log.info("[LISTAR MAESTRA SUBITEM][DAO][INICIO]");
		OutResponse<List<MaestraSubitemListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_MAESTRA).withProcedureName("SP_L_MAESTRA_SUBITEM")
					.returningResultSet(ConstanteUtil.R_LISTA, new MaestraSubitemListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_ID_TABLA", req.getIdTabla(), Types.VARCHAR);
			log.info("[LISTAR MAESTRA SUBITEM][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR MAESTRA SUBITEM][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR MAESTRA SUBITEM][DAO][EXITO]");
				List<MaestraSubitemListarResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR MAESTRA SUBITEM][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR MAESTRA SUBITEM][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR MAESTRA SUBITEM][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<MaestraSubitemRegistrarResponse> registrarMaestraSubitem(MaestraSubitemRegistrarRequest req) {
		log.info("[REGISTRAR MAESTRA SUBITEM][DAO][INICIO]");
		OutResponse<MaestraSubitemRegistrarResponse> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_MAESTRA).withProcedureName("SP_I_MAESTRA_SUBITEM");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_TXT_ID_TABLA", req.getIdTabla(), Types.VARCHAR);
			in.addValue("P_NID_MAESTRA_PADRE", req.getIdMaestraPadre(), Types.NUMERIC);
			in.addValue("P_TXT_CODIGO", req.getCodigo(), Types.VARCHAR);
			in.addValue("P_TXT_NOMBRE", req.getNombre(), Types.VARCHAR);
			in.addValue("P_TXT_DESCRIPCION", req.getDescripcion(), Types.VARCHAR);
			in.addValue("P_NUM_ORDEN", req.getOrden(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_CREACION", req.getIdUsuarioCrea(), Types.NUMERIC);
			in.addValue("P_TXT_PC_CREACION", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_CREACION", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[REGISTRAR MAESTRA SUBITEM][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[REGISTRAR MAESTRA SUBITEM][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[REGISTRAR MAESTRA SUBITEM][DAO][EXITO]");
				MaestraSubitemRegistrarResponse res = new MaestraSubitemRegistrarResponse();
				res.setIdMaestra(MapUtil.getLong(out.get("R_ID")));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[REGISTRAR MAESTRA SUBITEM][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[REGISTRAR MAESTRA SUBITEM][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[REGISTRAR MAESTRA SUBITEM][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> modificarMaestraSubitem(MaestraSubitemModificarRequest req) {
		log.info("[MODIFICAR MAESTRA SUBITEM][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_MAESTRA).withProcedureName("SP_U_MAESTRA_SUBITEM");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_MAESTRA", req.getIdMaestra(), Types.NUMERIC);
			in.addValue("P_TXT_ID_TABLA", req.getIdTabla(), Types.VARCHAR);
			in.addValue("P_TXT_CODIGO", req.getCodigo(), Types.VARCHAR);
			in.addValue("P_TXT_NOMBRE", req.getNombre(), Types.VARCHAR);
			in.addValue("P_NUM_ORDEN", req.getOrden(), Types.NUMERIC);
			in.addValue("P_TXT_DESCRIPCION", req.getDescripcion(), Types.VARCHAR);
			in.addValue("P_NID_USUARIO_MODIF", req.getIdUsuarioModif(), Types.NUMERIC);
			in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[MODIFICAR MAESTRA SUBITEM][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[MODIFICAR MAESTRA SUBITEM][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[MODIFICAR MAESTRA SUBITEM][DAO][EXITO]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[MODIFICAR MAESTRA SUBITEM][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[MODIFICAR MAESTRA SUBITEM][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[MODIFICAR MAESTRA SUBITEM][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> eliminarMaestraSubitem(MaestraSubitemEliminarRequest req) {
		log.info("[ELIMINAR MAESTRA SUBITEM][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_MAESTRA).withProcedureName("SP_D_MAESTRA_SUBITEM");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_MAESTRA", req.getIdMaestra(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_MODIF", req.getIdUsuarioModif(), Types.NUMERIC);
			in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[ELIMINAR MAESTRA SUBITEM][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[ELIMINAR MAESTRA SUBITEM][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[ELIMINAR MAESTRA SUBITEM][DAO][EXITO]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[ELIMINAR MAESTRA SUBITEM][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[ELIMINAR MAESTRA SUBITEM][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[ELIMINAR MAESTRA SUBITEM][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<MaestraCargaMasivaListarMaeResponse>> listarMaestraCargaMasiva(String listaMaestra) {
		log.info("[LISTAR MAESTRA CARGA MASIVA][DAO][INICIO]");
		OutResponse<List<MaestraCargaMasivaListarMaeResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_MAESTRA).withProcedureName("SP_L_MAESTRA_X_CARG_MASIV")
					.returningResultSet(ConstanteUtil.R_LISTA, new MaestraCargaMasivaListarMaeResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_L_MAESTRA", listaMaestra, Types.VARCHAR);
			log.info("[LISTAR MAESTRA CARGA MASIVA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR MAESTRA CARGA MASIVA][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR MAESTRA CARGA MASIVA][DAO][EXITO]");
				List<MaestraCargaMasivaListarMaeResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR MAESTRA CARGA MASIVA][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR MAESTRA CARGA MASIVA][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR MAESTRA CARGA MASIVA][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<Long> registrarMaestraCargaMasiva(MaestraCargaMasivaDetalleRequest req, Long idUsuarioCrea)
			throws Exception {
		log.info("[REGISTRAR MAESTRA CARGA MASIVA][DAO][INICIO]");
		OutResponse<Long> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";

		SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
				.withCatalogName(ConstanteUtil.BD_PKG_RENI_MAESTRA).withProcedureName("SP_I_MAESTRA_CARG_MASIV");

		MapSqlParameterSource in = new MapSqlParameterSource();
		in.addValue("P_TXT_ID_TABLA", req.getIdTabla(), Types.VARCHAR);
		in.addValue("P_TXT_CODIGO", req.getCodigo(), Types.VARCHAR);
		in.addValue("P_TXT_NOMBRE", req.getNombre(), Types.VARCHAR);
		in.addValue("P_TXT_DESCRIPCION", req.getDescripcion(), Types.VARCHAR);
		in.addValue("P_NID_USUARIO_CREACION", idUsuarioCrea, Types.NUMERIC);
		in.addValue("P_TXT_PC_CREACION", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
		in.addValue("P_TXT_IP_CREACION", AdressUtil.getIP(httpRequest), Types.VARCHAR);
		log.info("[REGISTRAR MAESTRA CARGA MASIVA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

		Map<String, Object> out = jdbcCall.execute(in);
		log.info("[REGISTRAR MAESTRA CARGA MASIVA][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

		rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
		rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

		if (rCodigo == ConstanteUtil.R_COD_EXITO) {
			log.info("[REGISTRAR MAESTRA CARGA MASIVA][DAO][EXITO]");
			Long res = MapUtil.getLong(out.get("R_ID"));

			outResponse.setRCodigo(rCodigo);
			outResponse.setRMensaje(rMensaje);
			outResponse.setObjeto(res);
		} else {
			log.info("[REGISTRAR MAESTRA CARGA MASIVA][DAO][ERROR]");
			outResponse.setRCodigo(rCodigo);
			outResponse.setRMensaje(rMensaje);
			throw new SQLException(rMensaje);
		}
		log.info("[REGISTRAR MAESTRA CARGA MASIVA][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<Long> registrarMaestraSubitemCargaMasiva(MaestraCargaMasivaDetalleRequest req,
			Long idMaestraPadre, Long idUsuarioCrea) throws Exception {
		log.info("[REGISTRAR MAESTRA SUBITEM CARGA MASIVA][DAO][INICIO]");
		OutResponse<Long> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";

		SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
				.withCatalogName(ConstanteUtil.BD_PKG_RENI_MAESTRA).withProcedureName("SP_I_MAESTRA_SUB_CARG_MASIV");

		MapSqlParameterSource in = new MapSqlParameterSource();
		in.addValue("P_TXT_ID_TABLA", req.getIdTabla(), Types.VARCHAR);
		in.addValue("P_NID_MAESTRA_PADRE", idMaestraPadre, Types.NUMERIC);
		in.addValue("P_TXT_CODIGO", req.getCodigo(), Types.VARCHAR);
		in.addValue("P_TXT_NOMBRE", req.getNombre(), Types.VARCHAR);
		in.addValue("P_TXT_DESCRIPCION", req.getDescripcion(), Types.VARCHAR);
		in.addValue("P_NUM_ORDEN", req.getNumOrden(), Types.NUMERIC);
		in.addValue("P_NID_USUARIO_CREACION", idUsuarioCrea, Types.NUMERIC);
		in.addValue("P_TXT_PC_CREACION", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
		in.addValue("P_TXT_IP_CREACION", AdressUtil.getIP(httpRequest), Types.VARCHAR);
		log.info("[REGISTRAR MAESTRA SUBITEM CARGA MASIVA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

		Map<String, Object> out = jdbcCall.execute(in);
		log.info("[REGISTRAR MAESTRA SUBITEM CARGA MASIVA][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

		rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
		rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

		if (rCodigo == ConstanteUtil.R_COD_EXITO) {
			log.info("[REGISTRAR MAESTRA SUBITEM CARGA MASIVA][DAO][EXITO]");
			Long res = MapUtil.getLong(out.get("R_ID"));

			outResponse.setRCodigo(rCodigo);
			outResponse.setRMensaje(rMensaje);
			outResponse.setObjeto(res);
		} else {
			log.info("[REGISTRAR MAESTRA SUBITEM CARGA MASIVA][DAO][ERROR]");
			outResponse.setRCodigo(rCodigo);
			outResponse.setRMensaje(rMensaje);
			throw new SQLException(rMensaje);
		}
		log.info("[REGISTRAR MAESTRA SUBITEM CARGA MASIVA][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<MaestraListarExportResponse>> exportarListaMaestraXlsx(MaestraListarExportRequest req) {
		log.info("[EXPORTAR LISTA MAESTRA][DAO][INICIO]");
		OutResponse<List<MaestraListarExportResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_MAESTRA).withProcedureName("SP_L_MAESTRA_EXPORT")
					.returningResultSet(ConstanteUtil.R_LISTA, new MaestraListarExportResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_FLG_ACTIVO", req.getFlgActivo(), Types.NUMERIC);
			in.addValue("P_NOMBRE", req.getNombre(), Types.VARCHAR);
			log.info("[EXPORTAR LISTA MAESTRA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[EXPORTAR LISTA MAESTRA][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[EXPORTAR LISTA MAESTRA][DAO][EXITO]");
				List<MaestraListarExportResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[EXPORTAR LISTA MAESTRA][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[EXPORTAR LISTA MAESTRA][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[EXPORTAR LISTA MAESTRA][DAO][FIN]");
		return outResponse;
	}
}
