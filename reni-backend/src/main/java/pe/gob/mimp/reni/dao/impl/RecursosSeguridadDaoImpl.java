package pe.gob.mimp.reni.dao.impl;

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

import pe.gob.mimp.reni.dao.RecursosSeguridadDao;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.RecursosSeguridadListarCargoResponse;
import pe.gob.mimp.reni.dto.response.RecursosSeguridadListarTipoDocumResponse;
import pe.gob.mimp.reni.dto.response.mapper.RecursosSeguridadListarCargoResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.RecursosSeguridadListarTipoDocumResponseMapper;
import pe.gob.mimp.reni.util.ConstanteUtil;
import pe.gob.mimp.reni.util.MapUtil;

@Repository
public class RecursosSeguridadDaoImpl implements RecursosSeguridadDao {

	private static final Logger log = LoggerFactory.getLogger(RecursosSeguridadDaoImpl.class);

	@Autowired
	@Qualifier("dataSourceSeguridad")
	DataSource dataSource;

	@Override
	public OutResponse<List<RecursosSeguridadListarTipoDocumResponse>> listarTipoDocumento() {
		log.info("[LISTAR TIPO DOCUMENTO][DAO][INICIO]");
		OutResponse<List<RecursosSeguridadListarTipoDocumResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_SEGURIDAD)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_RECURSOS).withProcedureName("SP_L_TIPO_DOCUMENTO")
					.returningResultSet(ConstanteUtil.R_LISTA, new RecursosSeguridadListarTipoDocumResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			log.info("[LISTAR TIPO DOCUMENTO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR TIPO DOCUMENTO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR TIPO DOCUMENTO][DAO][EXITO]");
				List<RecursosSeguridadListarTipoDocumResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR TIPO DOCUMENTO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR TIPO DOCUMENTO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR TIPO DOCUMENTO][DAO][FIN]");
		return outResponse;
	}

	public OutResponse<List<RecursosSeguridadListarCargoResponse>> listarCargo() {
		log.info("[LISTAR CARGO][DAO][INICIO]");
		OutResponse<List<RecursosSeguridadListarCargoResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_SEGURIDAD)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_RECURSOS).withProcedureName("SP_L_CARGO")
					.returningResultSet(ConstanteUtil.R_LISTA, new RecursosSeguridadListarCargoResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			log.info("[LISTAR CARGO][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR CARGO][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR CARGO][DAO][EXITO]");
				List<RecursosSeguridadListarCargoResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR CARGO][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR CARGO][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR CARGO][DAO][FIN]");
		return outResponse;
	}
}
