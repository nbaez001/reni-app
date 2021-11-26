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

import pe.gob.mimp.reni.dao.AdministrarBDDao;
import pe.gob.mimp.reni.dto.request.BDCampoTablaListarRequest;
import pe.gob.mimp.reni.dto.request.BDCampoTablaRegistrarRequest;
import pe.gob.mimp.reni.dto.response.BDCampoTablaListarResponse;
import pe.gob.mimp.reni.dto.response.BDTablaListarResponse;
import pe.gob.mimp.reni.dto.response.OutResponse;
import pe.gob.mimp.reni.dto.response.mapper.BDCampoTablaListarResponseMapper;
import pe.gob.mimp.reni.dto.response.mapper.BDTablaListarResponseMapper;
import pe.gob.mimp.reni.util.ConstanteUtil;
import pe.gob.mimp.reni.util.MapUtil;

@Repository
public class AdministrarBDDaoImpl implements AdministrarBDDao {

	private static final Logger log = LoggerFactory.getLogger(AdministrarBDDaoImpl.class);

	@Autowired
	DataSource dataSource;

	@Override
	public OutResponse<List<BDTablaListarResponse>> listarTablasBD() {
		log.info("[LISTAR TABLAS BD][DAO][INICIO]");
		OutResponse<List<BDTablaListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_ADMIN_BD).withProcedureName("SP_L_TABLA_BD")
					.returningResultSet(ConstanteUtil.R_LISTA, new BDTablaListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			log.info("[LISTAR TABLAS BD][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR TABLAS BD][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR TABLAS BD][DAO][EXITO]");
				List<BDTablaListarResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR TABLAS BD][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR TABLAS BD][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR TABLAS BD][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<List<BDCampoTablaListarResponse>> listarCamposBD(BDCampoTablaListarRequest req) {
		log.info("[LISTAR CAMPOS BD][DAO][INICIO]");
		OutResponse<List<BDCampoTablaListarResponse>> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_ADMIN_BD).withProcedureName("SP_L_CAMPO_BD")
					.returningResultSet(ConstanteUtil.R_LISTA, new BDCampoTablaListarResponseMapper());

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NOM_TABLA", req.getNomTabla(), Types.VARCHAR);
			log.info("[LISTAR CAMPOS BD][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[LISTAR CAMPOS BD][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[LISTAR CAMPOS BD][DAO][EXITO]");
				List<BDCampoTablaListarResponse> res = MapUtil.getType(out.get(ConstanteUtil.R_LISTA));

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
				outResponse.setObjeto(res);
			} else {
				log.info("[LISTAR CAMPOS BD][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[LISTAR CAMPOS BD][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[LISTAR CAMPOS BD][DAO][FIN]");
		return outResponse;
	}

	@Override
	public OutResponse<?> registrarCamposBD(BDCampoTablaRegistrarRequest req) {
		log.info("[REGISTRAR CAMPO BD][DAO][INICIO]");
		OutResponse<?> outResponse = new OutResponse<>();

		Integer rCodigo = 0;
		String rMensaje = "";
		try {
			SimpleJdbcCall jdbcCall = new SimpleJdbcCall(dataSource).withSchemaName(ConstanteUtil.BD_SCHEMA_RENI)
					.withCatalogName(ConstanteUtil.BD_PKG_RENI_ADMIN_BD).withProcedureName("SP_I_CAMPO_BD");

			MapSqlParameterSource in = new MapSqlParameterSource();
			in.addValue("P_NOM_TABLA", req.getNomTabla(), Types.VARCHAR);
			in.addValue("P_NOM_COLUMNA", req.getNomColumna(), Types.VARCHAR);
			in.addValue("P_TIPO_DATO", req.getTipoDato(), Types.VARCHAR);
			in.addValue("P_LONGITUD", req.getLongitud(), Types.NUMERIC);
			in.addValue("P_ESCALA", req.getEscala(), Types.NUMERIC);
			log.info("[REGISTRAR CAMPO BD][DAO][INPUT PROCEDURE][" + in.toString() + "]");

			Map<String, Object> out = jdbcCall.execute(in);
			log.info("[REGISTRAR CAMPO BD][DAO][OUTPUT PROCEDURE][" + out.toString() + "]");

			rCodigo = MapUtil.getInt(out.get(ConstanteUtil.R_CODIGO));
			rMensaje = MapUtil.getString(out.get(ConstanteUtil.R_MENSAJE));

			if (rCodigo == ConstanteUtil.R_COD_EXITO) {
				log.info("[REGISTRAR CAMPO BD][DAO][EXITO]");

				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			} else {
				log.info("[REGISTRAR CAMPO BD][DAO][ERROR]");
				outResponse.setRCodigo(rCodigo);
				outResponse.setRMensaje(rMensaje);
			}
		} catch (Exception e) {
			log.info("[REGISTRAR CAMPO BD][DAO][EXCEPCION][" + e.getMessage() + "]");
			outResponse.setRCodigo(500);
			outResponse.setRMensaje(e.getMessage());
		}
		log.info("[REGISTRAR CAMPO BD][DAO][FIN]");
		return outResponse;
	}

}
