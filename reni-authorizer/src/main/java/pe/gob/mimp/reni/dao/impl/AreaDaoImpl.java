package pe.gob.mimp.reni.dao.impl;

import java.sql.Types;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import pe.gob.mimp.reni.dao.AreaDao;
import pe.gob.mimp.reni.dto.request.AreaBuscarRequest;
import pe.gob.mimp.reni.dto.request.AreaListarRequest;
import pe.gob.mimp.reni.dto.response.AreaBuscarResponse;
import pe.gob.mimp.reni.dto.response.AreaListarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.mapper.AreaListarResponseMapper;
import pe.gob.mimp.reni.util.ConstanteUtil;
import pe.gob.mimp.reni.util.MapUtil;

@Repository
public class AreaDaoImpl implements AreaDao {

	private static final Logger log = LoggerFactory.getLogger(AreaDaoImpl.class);

	@Autowired
	DataSource dataSource;

	@Override
	public OutResponse<List<AreaListarResponse>> listarArea(AreaListarRequest req) {
		log.info("[LISTAR AREA][DAO][INICIO]");
		OutResponse<List<AreaListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = -1;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_SEGURIDAD)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_RECURSOS).withProcedureName("SP_L_AREAS")
					.returningResultSet(ConstanteUtil.R_LISTA, new AreaListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_TXT_AREA", req.getNombre(), Types.VARCHAR);
			log.info("[LISTAR AREA][DAO][INPUT][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR AREA][DAO][OUTPUT][" + out.toString() + "]");

			rCodigo = Integer.parseInt(out.get(ConstanteUtil.R_CODIGO).toString());
			rMensaje = out.get(ConstanteUtil.R_MENSAJE).toString();

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR AREA][DAO][EXITO]");
				List<AreaListarResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR AREA][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
			log.info("[LISTAR AREA][DAO][EXCEPCION][" + ExceptionUtils.getStackTrace(e) + "]");
		}
		log.info("[LISTAR AREA][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<AreaBuscarResponse> buscarArea(AreaBuscarRequest req) {
		log.info("[BUSCAR AREA][DAO][INICIO]");
		OutResponse<AreaBuscarResponse> outResponse = new OutResponse<>();

		Integer rCodigo = -1;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_SEGURIDAD)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_RECURSOS).withProcedureName("SP_S_BUSCAR_AREA");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NID_AREA", req.getIdArea(), Types.NUMERIC);
			log.info("[BUSCAR AREA][DAO][INPUT][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[BUSCAR AREA][DAO][OUTPUT][" + out.toString() + "]");

			rCodigo = Integer.parseInt(out.get(ConstanteUtil.R_CODIGO).toString());
			rMensaje = out.get(ConstanteUtil.R_MENSAJE).toString();

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[BUSCAR AREA][DAO][EXITO]");
				AreaBuscarResponse res = new AreaBuscarResponse();
				res.setIdArea(req.getIdArea());
				res.setNombre(MapUtil.getString(out.get("R_TXT_AREA")));
				res.setSigla(MapUtil.getString(out.get("R_TXT_SIGLA")));
				res.setFlgActivo(MapUtil.getInt(out.get("R_FLG_ACTIVO")));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[BUSCAR AREA][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
			log.info("[BUSCAR AREA][DAO][EXCEPCION][" + ExceptionUtils.getStackTrace(e) + "]");
		}
		log.info("[BUSCAR AREA][DAO][FIN]");
		return outResponse;
	}

}
