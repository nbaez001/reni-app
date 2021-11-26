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

import pe.gob.mimp.reni.dao.EstructuraDao;
import pe.gob.mimp.reni.dto.request.EstructuraBuscarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraEliminarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraListarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraModificarParametroRequest;
import pe.gob.mimp.reni.dto.request.EstructuraModificarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraParametroListarRequest;
import pe.gob.mimp.reni.dto.request.EstructuraRegistrarParametroRequest;
import pe.gob.mimp.reni.dto.request.EstructuraRegistrarRequest;
import pe.gob.mimp.reni.dto.response.EstructuraBuscarParametroResponse;
import pe.gob.mimp.reni.dto.response.EstructuraBuscarResponse;
import pe.gob.mimp.reni.dto.response.EstructuraListarResponse;
import pe.gob.mimp.reni.dto.response.EstructuraParametroListarResponse;
import pe.gob.mimp.reni.dto.response.EstructuraRegistrarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.mapper.EstructuraBuscarParametroResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.EstructuraListarResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.EstructuraParametroListarResponseMapper;
import pe.gob.mimp.reni.util.AdressUtil;
import pe.gob.mimp.reni.util.ConstanteUtil;
import pe.gob.mimp.reni.util.MapUtil;

@Repository
public class EstructuraDaoImpl implements EstructuraDao {

	private static final Logger log = LoggerFactory.getLogger(EstructuraDaoImpl.class);

	@Autowired
	DataSource dataSource;

	@Autowired
	private HttpServletRequest httpRequest;

	@Override
	public OutResponse<List<EstructuraListarResponse>> listarEstructura(EstructuraListarRequest req) {
		log.info("[LISTAR ESTRUCTURA][DAO][INICIO]");
		OutResponse<List<EstructuraListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_ESTRUCTURA).withProcedureName("SP_L_ESTRUCTURA")
					.returningResultSet(ConstanteUtil.R_LISTA, new EstructuraListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_TXT_NOMBRE", req.getNombre(), Types.VARCHAR);
			in.addValue("P_NOM_ENTIDAD", req.getNomEntidad(), Types.VARCHAR);
			in.addValue("P_ID_LINEA_INTER", req.getIdLineaInter(), Types.NUMERIC);
			in.addValue("P_NOM_SERVICIO", req.getNomServicio(), Types.VARCHAR);
			in.addValue("P_FLG_ACTIVO", req.getFlgActivo(), Types.NUMERIC);
			log.info("[LISTAR ESTRUCTURA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR ESTRUCTURA][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR ESTRUCTURA][DAO][EXITO]");
				List<EstructuraListarResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR ESTRUCTURA][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR ESTRUCTURA][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR ESTRUCTURA][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<EstructuraRegistrarResponse> registrarEstructura(EstructuraRegistrarRequest req, String lista,
			Integer total) {
		log.info("[REGISTRAR ESTRUCTURA][DAO][INICIO]");
		OutResponse<EstructuraRegistrarResponse> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_ESTRUCTURA).withProcedureName("SP_I_ESTRUCTURA");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_TXT_NOMBRE", req.getNombre(), Types.VARCHAR);
			in.addValue("P_TXT_DESCRIPCION", req.getDescripcion(), Types.VARCHAR);
			in.addValue("P_IDT_TIPO_USUARIO", req.getIdtTipoUsuario(), Types.VARCHAR);
			in.addValue("P_ID_SERVICIO", req.getIdServicio(), Types.NUMERIC);
			in.addValue("P_ID_ESTRUCTURA_REPL", req.getIdEstructuraRepl(), Types.NUMERIC);
			in.addValue("P_L_LISTA_PARAMETRO", lista, Types.CLOB);
			in.addValue("P_T_LISTA_PARAMETRO", total, Types.NUMERIC);
			in.addValue("P_NID_USUARIO_CREACION", req.getIdUsuarioCrea(), Types.NUMERIC);
			in.addValue("P_TXT_PC_CREACION", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_CREACION", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[REGISTRAR ESTRUCTURA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[REGISTRAR ESTRUCTURA][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[REGISTRAR ESTRUCTURA][DAO][EXITO]");
				EstructuraRegistrarResponse res = new EstructuraRegistrarResponse();
				res.setIdEstructura(MapUtil.getLong(out.get("R_ID")));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[REGISTRAR ESTRUCTURA][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[REGISTRAR ESTRUCTURA][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[REGISTRAR ESTRUCTURA][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> modificarEstructura(EstructuraModificarRequest req) throws Exception {
		log.info("[MODIFICAR ESTRUCTURA][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";

		SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
				.withCatalogName(ConstanteUtil.BD_PKG_RENI_ESTRUCTURA).withProcedureName("SP_U_ESTRUCTURA");

		MapSqlParameterSource in = new MapSqlParameterSource();
		in.addValue("P_ID_ESTRUCTURA", req.getIdEstructura(), Types.NUMERIC);
		in.addValue("P_TXT_NOMBRE", req.getNombre(), Types.VARCHAR);
		in.addValue("P_TXT_DESCRIPCION", req.getDescripcion(), Types.VARCHAR);
		in.addValue("P_IDT_TIPO_USUARIO", req.getIdtTipoUsuario(), Types.VARCHAR);
		in.addValue("P_ID_SERVICIO", req.getIdServicio(), Types.NUMERIC);
		in.addValue("P_ID_ESTRUCTURA_REPL", req.getIdEstructuraRepl(), Types.NUMERIC);
		in.addValue("P_NID_USUARIO_MODIF", req.getIdUsuarioModif(), Types.NUMERIC);
		in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
		in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
		log.info("[MODIFICAR ESTRUCTURA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

		Map<String, Object> out = jdbcCall.execute(in);
		log.info("[MODIFICAR ESTRUCTURA][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

		rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
		rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

		if (rCodigo == ConstanteUtil.R_COD_EXITO) {
			log.info("[MODIFICAR ESTRUCTURA][DAO][EXITO]");
			outResponse.setRCodigo(rCodigo);
			outResponse.setRMensaje(rMensaje);
		} else {
			log.info("[MODIFICAR ESTRUCTURA][DAO][ERROR]");
			outResponse.setRCodigo(rCodigo);
			outResponse.setRMensaje(rMensaje);
			throw new SQLException(rMensaje);
		}
		log.info("[MODIFICAR ESTRUCTURA][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> eliminarEstructura(EstructuraEliminarRequest req) {
		log.info("[ELIMINAR ESTRUCTURA][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_ESTRUCTURA).withProcedureName("SP_D_ESTRUCTURA");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_ESTRUCTURA", req.getIdEstructura(), Types.NUMERIC);
			in.addValue("P_NID_USUARIO_MODIF", req.getIdUsuarioModif(), Types.NUMERIC);
			in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
			in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
			log.info("[ELIMINAR ESTRUCTURA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[ELIMINAR ESTRUCTURA][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[ELIMINAR ESTRUCTURA][DAO][EXITO]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[ELIMINAR ESTRUCTURA][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[ELIMINAR ESTRUCTURA][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[ELIMINAR ESTRUCTURA][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> registrarParametro(EstructuraRegistrarParametroRequest req, Long idEstructura,
			Long idUsuarioCrea) throws Exception {
		log.info("[REGISTRAR PARAMETRO][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";

		SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
				.withCatalogName(ConstanteUtil.BD_PKG_RENI_ESTRUCTURA).withProcedureName("SP_I_PARAMETRO");

		MapSqlParameterSource in = new MapSqlParameterSource();
		in.addValue("P_ID_ESTRUCTURA", idEstructura, Types.NUMERIC);
		in.addValue("P_TXT_NOM_CAMPO_EXCEL", req.getNomCampoExcel(), Types.VARCHAR);
		in.addValue("P_NUM_ORDEN_CAMPO_EXCEL", req.getOrdenCampoExcel(), Types.NUMERIC);
		in.addValue("P_TXT_NOM_TABLA_BD", req.getNomTablaBd(), Types.VARCHAR);
		in.addValue("P_TXT_NOM_CAMPO_BD", req.getNomCampoBd(), Types.VARCHAR);
		in.addValue("P_NUM_CAMPO_ES_FK", req.getCampoEsFk(), Types.NUMERIC);
		in.addValue("P_TXT_CAMPO_ID_MAESTRA", req.getCampoIdmaestra(), Types.VARCHAR);
		in.addValue("P_TXT_DESCRIPCION", req.getDescripcion(), Types.VARCHAR);
		in.addValue("P_NID_USUARIO_CREA", idUsuarioCrea, Types.NUMERIC);
		in.addValue("P_TXT_PC_CREA", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
		in.addValue("P_TXT_IP_CREA", AdressUtil.getIP(httpRequest), Types.VARCHAR);
		log.info("[REGISTRAR PARAMETRO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

		Map<String, Object> out = jdbcCall.execute(in);
		log.info("[REGISTRAR PARAMETRO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

		rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
		rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

		if (rCodigo == ConstanteUtil.R_COD_EXITO) {
			log.info("[REGISTRAR PARAMETRO][DAO][EXITO]");
			outResponse.setRCodigo(rCodigo);
			outResponse.setRMensaje(rMensaje);
		} else {
			log.info("[REGISTRAR PARAMETRO][DAO][ERROR]");
			outResponse.setRCodigo(rCodigo);
			outResponse.setRMensaje(rMensaje);
			throw new SQLException(rMensaje);
		}
		log.info("[REGISTRAR PARAMETRO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> modificarParametro(EstructuraModificarParametroRequest req, Long idUsuarioModif)
			throws Exception {
		log.info("[MODIFICAR PARAMETRO][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";

		SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
				.withCatalogName(ConstanteUtil.BD_PKG_RENI_ESTRUCTURA).withProcedureName("SP_U_PARAMETRO");

		MapSqlParameterSource in = new MapSqlParameterSource();
		in.addValue("P_ID_PARAMETRO", req.getIdParametro(), Types.NUMERIC);
		in.addValue("P_TXT_NOM_CAMPO_EXCEL", req.getNomCampoExcel(), Types.VARCHAR);
		in.addValue("P_NUM_ORDEN_CAMPO_EXCEL", req.getOrdenCampoExcel(), Types.NUMERIC);
		in.addValue("P_TXT_NOM_TABLA_BD", req.getNomTablaBd(), Types.VARCHAR);
		in.addValue("P_TXT_NOM_CAMPO_BD", req.getNomCampoBd(), Types.VARCHAR);
		in.addValue("P_NUM_CAMPO_ES_FK", req.getCampoEsFk(), Types.NUMERIC);
		in.addValue("P_TXT_CAMPO_ID_MAESTRA", req.getCampoIdmaestra(), Types.VARCHAR);
		in.addValue("P_TXT_DESCRIPCION", req.getDescripcion(), Types.VARCHAR);
		in.addValue("P_NID_USUARIO_MODIF", idUsuarioModif, Types.NUMERIC);
		in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
		in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
		log.info("[MODIFICAR PARAMETRO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

		Map<String, Object> out = jdbcCall.execute(in);
		log.info("[MODIFICAR PARAMETRO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

		rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
		rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

		if (rCodigo == ConstanteUtil.R_COD_EXITO) {
			log.info("[MODIFICAR PARAMETRO][DAO][EXITO]");
			outResponse.setRCodigo(rCodigo);
			outResponse.setRMensaje(rMensaje);
		} else {
			log.info("[MODIFICAR PARAMETRO][DAO][ERROR]");
			outResponse.setRCodigo(rCodigo);
			outResponse.setRMensaje(rMensaje);
			throw new SQLException(rMensaje);
		}
		log.info("[MODIFICAR PARAMETRO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> eliminarParametro(Long idParametro, Long idUsuarioModif) throws Exception {
		log.info("[ELIMINAR PARAMETRO][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";

		SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
				.withCatalogName(ConstanteUtil.BD_PKG_RENI_ESTRUCTURA).withProcedureName("SP_D_PARAMETRO");

		MapSqlParameterSource in = new MapSqlParameterSource();
		in.addValue("P_ID_PARAMETRO", idParametro, Types.NUMERIC);
		in.addValue("P_NID_USUARIO_MODIF", idUsuarioModif, Types.NUMERIC);
		in.addValue("P_TXT_PC_MODIF", AdressUtil.getHostname(httpRequest), Types.VARCHAR);
		in.addValue("P_TXT_IP_MODIF", AdressUtil.getIP(httpRequest), Types.VARCHAR);
		log.info("[ELIMINAR PARAMETRO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

		Map<String, Object> out = jdbcCall.execute(in);
		log.info("[ELIMINAR PARAMETRO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

		rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
		rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

		if (rCodigo == ConstanteUtil.R_COD_EXITO) {
			log.info("[ELIMINAR PARAMETRO][DAO][EXITO]");
			outResponse.setRCodigo(rCodigo);
			outResponse.setRMensaje(rMensaje);
		} else {
			log.info("[ELIMINAR PARAMETRO][DAO][ERROR]");
			outResponse.setRCodigo(rCodigo);
			outResponse.setRMensaje(rMensaje);
			throw new SQLException(rMensaje);
		}
		log.info("[ELIMINAR PARAMETRO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<EstructuraParametroListarResponse>> listarParametroEstructura(
			EstructuraParametroListarRequest req) {
		log.info("[LISTAR PARAMETROS ESTRUCTURA][DAO][INICIO]");
		OutResponse<List<EstructuraParametroListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_ESTRUCTURA).withProcedureName("SP_L_PARAM_ESTRUCTURA")
					.returningResultSet(ConstanteUtil.R_LISTA, new EstructuraParametroListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_ESTRUCTURA", req.getIdEstructura(), Types.NUMERIC);
			log.info("[LISTAR PARAMETROS ESTRUCTURA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR PARAMETROS ESTRUCTURA][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR PARAMETROS ESTRUCTURA][DAO][EXITO]");
				List<EstructuraParametroListarResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR PARAMETROS ESTRUCTURA][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR PARAMETROS ESTRUCTURA][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR PARAMETROS ESTRUCTURA][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<EstructuraBuscarResponse> buscarEstructura(EstructuraBuscarRequest req) {
		log.info("[BUSCAR ESTRUCTURA][DAO][INICIO]");
		OutResponse<EstructuraBuscarResponse> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_ESTRUCTURA).withProcedureName("SP_S_ESTRUCTURA")
					.returningResultSet(ConstanteUtil.R_LISTA, new EstructuraBuscarParametroResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_ESTRUCTURA", req.getIdEstructura(), Types.NUMERIC);
			log.info("[BUSCAR ESTRUCTURA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[BUSCAR ESTRUCTURA][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[BUSCAR ESTRUCTURA][DAO][EXITO]");
				EstructuraBuscarResponse res = new EstructuraBuscarResponse();
				res.setNombre(MapUtil.getString(out.get("P_TXT_NOMBRE")));
				res.setDescripcion(MapUtil.getString(out.get("P_TXT_DESCRIPCION")));
				res.setIdTipoUsuario(MapUtil.getString(out.get("P_IDT_TIPO_USUARIO")));
				res.setIdServicio(MapUtil.getLong(out.get("P_ID_SERVICIO")));
				res.setNomServicio(MapUtil.getString(out.get("P_NOM_SERVICIO")));
				res.setIdEntidad(MapUtil.getLong(out.get("P_ID_ENTIDAD")));
				res.setNomEntidad(MapUtil.getString(out.get("P_NOM_ENTIDAD")));
				res.setIdLineaInter(MapUtil.getLong(out.get("P_ID_LINEA_INTER")));
				res.setNomLineaInter(MapUtil.getString(out.get("P_NOM_LINEA_INTER")));
				res.setIdEstructuraRepl(MapUtil.getLong(out.get("P_ID_ESTRUCTURA_REPL")));
				res.setNomEstructuraRepl(MapUtil.getString(out.get("P_NOM_ESTRUCTURA_REPL")));
				List<EstructuraBuscarParametroResponse> resLista = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));
				res.setListaParametro(resLista);

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[BUSCAR ESTRUCTURA][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[BUSCAR ESTRUCTURA][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[BUSCAR ESTRUCTURA][DAO][FIN]");
		return outResponse;
	}
}
