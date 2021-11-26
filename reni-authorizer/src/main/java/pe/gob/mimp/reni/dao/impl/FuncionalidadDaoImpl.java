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

import pe.gob.mimp.reni.dao.FuncionalidadDao;
import pe.gob.mimp.reni.dto.request.FuncionalidadListarRequest;
import pe.gob.mimp.reni.dto.response.FuncionalidadListarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.mapper.FuncionalidadListarResponseMapper;
import pe.gob.mimp.reni.util.ConstanteUtil;
import pe.gob.mimp.reni.util.MapUtil;

@Repository
public class FuncionalidadDaoImpl implements FuncionalidadDao {

	private static final Logger log = LoggerFactory.getLogger(UsuarioOauth2DaoImpl.class);

	@Autowired
	DataSource dataSource;

	@Override
	public OutResponse<List<FuncionalidadListarResponse>> listarFuncionalidad(FuncionalidadListarRequest req) {
		log.info("[LISTAR FUNCIONALIDAD][DAO][INICIO]");
		OutResponse<List<FuncionalidadListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = -1;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_SEGURIDAD)
					.withCatalogName(ConstanteUtil.BD_PCK_RENI_AUTENTICACION).withProcedureName("SP_L_FUNCIONALIDAD_PERFIL")
					.returningResultSet(ConstanteUtil.R_LISTA, new FuncionalidadListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_ID_PERFIL", req.getIdPerfil(), Types.NUMERIC);
			in.addValue("P_ID_MODULO", req.getIdModulo(), Types.NUMERIC);
			log.info("[LISTAR FUNCIONALIDAD][DAO][INPUT][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR FUNCIONALIDAD][DAO][OUTPUT][" + out.toString() + "]");

			rCodigo = Integer.parseInt(out.get(ConstanteUtil.R_CODIGO).toString());
			rMensaje = out.get(ConstanteUtil.R_MENSAJE).toString();

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR FUNCIONALIDAD][DAO][EXITO]");
				List<FuncionalidadListarResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR FUNCIONALIDAD][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
			log.info("[LISTAR FUNCIONALIDAD][DAO][EXCEPCION][" + ExceptionUtils.getStackTrace(e) + "]");
		}
		log.info("[LISTAR FUNCIONALIDAD][DAO][FIN]");
		return outResponse;
	}

}
