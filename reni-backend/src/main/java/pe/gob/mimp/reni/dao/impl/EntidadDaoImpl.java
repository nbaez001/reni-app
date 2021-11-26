package pe.gob.mimp.reni.dao.impl;

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

import pe.gob.mimp.reni.dao.EntidadDao;
import pe.gob.mimp.reni.dto.request.EntidadEliminarRequest;
import pe.gob.mimp.reni.dto.request.EntidadListarRequest;
import pe.gob.mimp.reni.dto.request.EntidadModificarRequest;
import pe.gob.mimp.reni.dto.request.EntidadRegistrarRequest;
import pe.gob.mimp.reni.dto.response.EntidadListarResponse;
import pe.gob.mimp.reni.dto.response.EntidadRegistrarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.mapper.EntidadListarResponseMapper;
import pe.gob.mimp.reni.util.AdressUtil;
import pe.gob.mimp.reni.util.ConstanteUtil;
import pe.gob.mimp.reni.util.MapUtil;

@Repository
public class EntidadDaoImpl implements EntidadDao {

	private static final Logger log = LoggerFactory.getLogger(EntidadDaoImpl.class);

	@Autowired
	DataSource dataSource;

	@Autowired
	private HttpServletRequest httpRequest;

	@Override
	public OutResponse<List<EntidadListarResponse>> listarEntidad(EntidadListarRequest req) {
		log.info("[LISTAR ENTIDAD][DAO][INICIO]");
		OutResponse<List<EntidadListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_ENTIDAD).withProcedureName("SP_L_ENTIDAD")
					.returningResultSet(ConstanteUtil.R_LISTA, new EntidadListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_FLG_ACTIVO", req.getFlgActivo(), Types.NUMERIC);
			in.addValue("P_TXT_NOMBRE", req.getNombre(), Types.VARCHAR);
			log.info("[LISTAR ENTIDAD][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR ENTIDAD][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR ENTIDAD][DAO][EXITO]");
				List<EntidadListarResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR ENTIDAD][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR ENTIDAD][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR ENTIDAD][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<EntidadRegistrarResponse> registrarEntidad(EntidadRegistrarRequest req) {
		log.info("[REGISTRAR ENTIDAD][DAO][INICIO]");
		OutResponse<EntidadRegistrarResponse> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_ENTIDAD).withProcedureName("SP_I_ENTIDAD");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_TXT_NOMBRE", req.getNombre(), Types.VARCHAR);
			in.addValue("P_TXT_SIGLAS", req.getSiglas(), Types.VARCHAR);
			in.addValue("P_TXT_CODIGO", req.getCodigo(), Types.VARCHAR);
			in.addValue("P_NID_AREA_SEGURIDAD", req.getIdAreaSeguridad(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_CREACION", req.getIdUsuarioCrea(), Types.NUMERIC);
			in.addValue("P_TXT_PC_CREACION", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_CREACION", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[REGISTRAR ENTIDAD][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[REGISTRAR ENTIDAD][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[REGISTRAR ENTIDAD][DAO][EXITO]");
				EntidadRegistrarResponse res = new EntidadRegistrarResponse();
				res.setIdEntidad(MapUtil.getLong(out.get("R_ID")));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[REGISTRAR ENTIDAD][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[REGISTRAR ENTIDAD][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[REGISTRAR ENTIDAD][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> modificarEntidad(EntidadModificarRequest req) {
		log.info("[MODIFICAR ENTIDAD][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_ENTIDAD).withProcedureName("SP_U_ENTIDAD");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_ENTIDAD", req.getIdEntidad(), Types.NUMERIC);
			in.addValue("P_TXT_NOMBRE", req.getNombre(), Types.VARCHAR);
			in.addValue("P_TXT_SIGLAS", req.getSiglas(), Types.VARCHAR);
			in.addValue("P_TXT_CODIGO", req.getCodigo(), Types.VARCHAR);
			in.addValue("P_NID_AREA_SEGURIDAD", req.getIdAreaSeguridad(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_MODIF", req.getIdUsuarioModif(), Types.NUMERIC);
			in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[MODIFICAR ENTIDAD][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[MODIFICAR ENTIDAD][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[MODIFICAR ENTIDAD][DAO][EXITO]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[MODIFICAR ENTIDAD][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[MODIFICAR ENTIDAD][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[MODIFICAR ENTIDAD][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> eliminarEntidad(EntidadEliminarRequest req) {
		log.info("[ELIMINAR ENTIDAD][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_ENTIDAD).withProcedureName("SP_D_ENTIDAD");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_ENTIDAD", req.getIdEntidad(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_MODIF", req.getIdUsuarioModif(), Types.NUMERIC);
			in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[ELIMINAR ENTIDAD][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[ELIMINAR ENTIDAD][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[ELIMINAR ENTIDAD][DAO][EXITO]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[ELIMINAR ENTIDAD][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[ELIMINAR ENTIDAD][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[ELIMINAR ENTIDAD][DAO][FIN]");
		return outResponse;
	}

//	@Override
//	public OutResponse<?> alterTable(String nombre) {
//		log.info("[ELIMINAR ENTIDAD][DAO][INICIO]");
//		OutResponse<?> outResponse = new OutResponse<>();
//
//		Integer rCodigo = 0;
//		String rMensaje = "";
//		try {
//			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
//					.withCatalogName(ConstanteUtil.BD_PKG_RENI_ENTIDAD).withProcedureName("SP_N_TABLA");
//
//			MapSqlParameterSource in = new MapSqlParameterSource();
//			in.addValue("P_CAMPO", nombre, Types.VARCHAR);
//			in.addValue("P_CAMPO_TIPO", "VARCHAR2(50)", Types.VARCHAR);
//			log.info("[ELIMINAR ENTIDAD][DAO][INPUT PROCEDURE][" + in.toString() + "]");
//
//			Map<String, Object> out = jdbcCall.execute(in);
//			log.info("[ELIMINAR ENTIDAD][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");
//
//			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
//			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));
//
//			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
//				log.info("[ELIMINAR ENTIDAD][DAO][EXITO]");
//				outResponse.setRCodigo(rCodigo);
//				outResponse.setRMensaje(rMensaje);
//			} else {
//				log.info("[ELIMINAR ENTIDAD][DAO][ERROR]");
//				outResponse.setRCodigo(rCodigo);
//				outResponse.setRMensaje(rMensaje);
//			}
//		} catch (Exception e) {
//			log.info("[ELIMINAR ENTIDAD][DAO][EXCEPCION][" + e.getMessage() + "]");
//			outResponse.setRCodigo(500);
//			outResponse.setRMensaje(e.getMessage());
//		}
//		log.info("[ELIMINAR ENTIDAD][DAO][FIN]");
//		return outResponse;
//	}

}
