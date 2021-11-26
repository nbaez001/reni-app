package pe.gob.mimp.reni.dao.impl;

import java.sql.Types;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import pe.gob.mimp.reni.dao.UbigeoDao;
import pe.gob.mimp.reni.dto.request.UbigeoDistritoListarRequest;
import pe.gob.mimp.reni.dto.request.UbigeoDistritoListarXUbigeoRequest;
import pe.gob.mimp.reni.dto.request.UbigeoProvinciaListarRequest;
import pe.gob.mimp.reni.dto.request.UbigeoProvinciaListarXUbigeoRequest;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.UbigeoDepartamentoListarResponse;
import pe.gob.mimp.reni.dto.response.UbigeoDistritoListarResponse;
import pe.gob.mimp.reni.dto.response.UbigeoObtenerDescUbigeoResponse;
import pe.gob.mimp.reni.dto.response.UbigeoProvinciaListarResponse;
import pe.gob.mimp.reni.dto.response.mapper.UbigeoDepartamentoListarResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.UbigeoDistritoListarResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.UbigeoProvinciaListarResponseMapper;
import pe.gob.mimp.reni.util.ConstanteUtil;
import pe.gob.mimp.reni.util.MapUtil;

@Repository
public class UbigeoDaoImpl implements UbigeoDao {

	private static final Logger log = LoggerFactory.getLogger(UbigeoDaoImpl.class);

	@Autowired
	@Qualifier("dataSourceGeneral")
	DataSource dataSource;

	@Override
	public OutResponse<List<UbigeoDepartamentoListarResponse>> listarDepartamento() {
		log.info("[LISTAR DEPARTAMENTO][DAO][INICIO]");
		OutResponse<List<UbigeoDepartamentoListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_GENERAL)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_UBIGEO).withProcedureName("SP_L_DEPARTAMENTO")
					.returningResultSet(ConstanteUtil.R_LISTA, new UbigeoDepartamentoListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			log.info("[LISTAR DEPARTAMENTO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR DEPARTAMENTO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = Integer.parseInt(out.get(ConstanteUtil.R_CODIGO).toString());
			rMensaje = out.get(ConstanteUtil.R_MENSAJE).toString();

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {// CONSULTA CORRECTA
				log.info("[LISTAR DEPARTAMENTO][DAO][EXITO]");
				List<UbigeoDepartamentoListarResponse> lista = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(lista);
			} else {
				log.info("[LISTAR DEPARTAMENTO][DAO][ERROR]");

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR DEPARTAMENTO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR DEPARTAMENTO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<UbigeoProvinciaListarResponse>> listarProvincia(UbigeoProvinciaListarRequest req) {
		log.info("[LISTAR PROVINCIA][DAO][INICIO]");
		OutResponse<List<UbigeoProvinciaListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_GENERAL)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_UBIGEO).withProcedureName("SP_L_PROVINCIA")
					.returningResultSet(ConstanteUtil.R_LISTA, new UbigeoProvinciaListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_DEPARTAMENTO", req.getIdDepartamento(), Types.NUMERIC);
			log.info("[LISTAR PROVINCIA][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR PROVINCIA][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = Integer.parseInt(out.get(ConstanteUtil.R_CODIGO).toString());
			rMensaje = out.get(ConstanteUtil.R_MENSAJE).toString();

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR PROVINCIA][DAO][EXITO]");
				List<UbigeoProvinciaListarResponse> lista = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(lista);
			} else {
				log.info("[LISTAR PROVINCIA][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR PROVINCIA][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR PROVINCIA][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<UbigeoDistritoListarResponse>> listarDistrito(UbigeoDistritoListarRequest req) {
		log.info("[LISTAR DISTRITO][DAO][INICIO]");
		OutResponse<List<UbigeoDistritoListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_GENERAL)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_UBIGEO).withProcedureName("SP_L_DISTRITO")
					.returningResultSet(ConstanteUtil.R_LISTA, new UbigeoDistritoListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_PROVINCIA", req.getIdProvincia(), Types.NUMERIC);
			log.info("[LISTAR DISTRITO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR DISTRITO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = Integer.parseInt(out.get(ConstanteUtil.R_CODIGO).toString());
			rMensaje = out.get(ConstanteUtil.R_MENSAJE).toString();

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR DISTRITO][DAO][EXITO]");
				List<UbigeoDistritoListarResponse> lista = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(lista);
			} else {
				log.info("[LISTAR DISTRITO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR DISTRITO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR DISTRITO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<UbigeoProvinciaListarResponse>> listarProvinciaXUbigeo(
			UbigeoProvinciaListarXUbigeoRequest req) {
		log.info("[LISTAR PROVINCIA X UBIGEO][DAO][INICIO]");
		OutResponse<List<UbigeoProvinciaListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_GENERAL)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_UBIGEO).withProcedureName("SP_L_PROVINCIA_X_UBIGEO")
					.returningResultSet(ConstanteUtil.R_LISTA, new UbigeoProvinciaListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_COD_UBIG_DEPART", req.getCodUbigeoDepartamento(), Types.VARCHAR);
			log.info("[LISTAR PROVINCIA X UBIGEO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR PROVINCIA X UBIGEO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = Integer.parseInt(out.get(ConstanteUtil.R_CODIGO).toString());
			rMensaje = out.get(ConstanteUtil.R_MENSAJE).toString();

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR PROVINCIA X UBIGEO][DAO][EXITO]");
				List<UbigeoProvinciaListarResponse> lista = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(lista);
			} else {
				log.info("[LISTAR PROVINCIA X UBIGEO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR PROVINCIA X UBIGEO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR PROVINCIA X UBIGEO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<UbigeoDistritoListarResponse>> listarDistritoXUbigeo(
			UbigeoDistritoListarXUbigeoRequest req) {
		log.info("[LISTAR DISTRITO X UBIGEO][DAO][INICIO]");
		OutResponse<List<UbigeoDistritoListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_GENERAL)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_UBIGEO).withProcedureName("SP_L_DISTRITO_X_UBIGEO")
					.returningResultSet(ConstanteUtil.R_LISTA, new UbigeoDistritoListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_COD_UBIG_PROVIN", req.getCodUbigeoProvincia(), Types.VARCHAR);
			log.info("[LISTAR DISTRITO X UBIGEO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR DISTRITO X UBIGEO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = Integer.parseInt(out.get(ConstanteUtil.R_CODIGO).toString());
			rMensaje = out.get(ConstanteUtil.R_MENSAJE).toString();

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR DISTRITO X UBIGEO][DAO][EXITO]");
				List<UbigeoDistritoListarResponse> lista = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(lista);
			} else {
				log.info("[LISTAR DISTRITO X UBIGEO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR DISTRITO X UBIGEO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR DISTRITO X UBIGEO][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<UbigeoObtenerDescUbigeoResponse> obtenerDescripcionUbigeo(String req) {
		log.info("[OBTENER DESCRIPCION UBIGEO][DAO][INICIO]");
		OutResponse<UbigeoObtenerDescUbigeoResponse> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_GENERAL)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_UBIGEO).withProcedureName("SP_S_OBTENER_DESC_UBIGEO");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_UBIGEO", req, Types.VARCHAR);
			log.info("[OBTENER DESCRIPCION UBIGEO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[OBTENER DESCRIPCION UBIGEO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = Integer.parseInt(out.get(ConstanteUtil.R_CODIGO).toString());
			rMensaje = out.get(ConstanteUtil.R_MENSAJE).toString();

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[OBTENER DESCRIPCION UBIGEO][DAO][EXITO]");
				UbigeoObtenerDescUbigeoResponse res = new UbigeoObtenerDescUbigeoResponse();
				res.setDesDepartamento(MapUtil.getString(out.get("R_DESC_DEPARTAMENTO")));
				res.setDesProvincia(MapUtil.getString(out.get("R_DESC_PROVINCIA")));
				res.setDesDistrito(MapUtil.getString(out.get("R_DESC_DISTRITO")));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[OBTENER DESCRIPCION UBIGEO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[OBTENER DESCRIPCION UBIGEO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[OBTENER DESCRIPCION UBIGEO][DAO][FIN]");
		return outResponse;
	}

}
