package pe.gob.mimp.reni.dto.response.mapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.jdbc.core.RowMapper;

import pe.gob.mimp.reni.dto.request.ReporteIntervencionXUsuarioListarMaestraResponse;
import pe.gob.mimp.reni.dto.request.ReporteIntervencionXUsuarioListarXlsxDetRequest;
import pe.gob.mimp.reni.util.ConstanteUtil;

public class ReporteIntervencionXUsuarioListarXlsxResponseMapper implements RowMapper<Map<String, Object>> {

	List<ReporteIntervencionXUsuarioListarXlsxDetRequest> listaMapeo;
	List<ReporteIntervencionXUsuarioListarMaestraResponse> listaMaestra;

	public ReporteIntervencionXUsuarioListarXlsxResponseMapper(
			List<ReporteIntervencionXUsuarioListarXlsxDetRequest> listaMapeo,
			List<ReporteIntervencionXUsuarioListarMaestraResponse> listaMaestra) {
		this.listaMapeo = listaMapeo;
		this.listaMaestra = listaMaestra;
	}

	public Map<String, Object> mapRow(ResultSet rs, int rowNum) throws SQLException {
		Map<String, Object> o = new HashMap<>();

		for (ReporteIntervencionXUsuarioListarXlsxDetRequest ob : listaMapeo) {
			if (ob.getTipoDato().equals(ConstanteUtil.T_VARCHAR2)) {
				o.put(ob.getNomCampoExcel(), rs.getString(ob.getNomCampoExcel()));
			}
			if (ob.getTipoDato().equals(ConstanteUtil.T_NUMBER)) {
				if (ob.getPrecisionDato() > 0) {
					o.put(ob.getNomCampoExcel(), rs.getDouble(ob.getNomCampoExcel()));
				} else {
					o.put(ob.getNomCampoExcel(), rs.getInt(ob.getNomCampoExcel()));
				}
			}
			if (ob.getTipoDato().equals(ConstanteUtil.T_DATE)) {
				o.put(ob.getNomCampoExcel(), rs.getDate(ob.getNomCampoExcel()));
			}

			// ADICION DE DESCRIPCION A CODIGOS MAESTRA
			if (ob.getCampoEsFk() == 1) {
				String val = o.get(ob.getNomCampoExcel()) != null ? o.get(ob.getNomCampoExcel()).toString() : null;
				if (val != null) {
					List<ReporteIntervencionXUsuarioListarMaestraResponse> lMaeFil = this.listaMaestra.stream()
							.filter(e -> {
								return e.getIdTabla().equals(ob.getCampoIdMaestra()) && e.getCodigo() != null;
							}).collect(Collectors.toList());

					for (ReporteIntervencionXUsuarioListarMaestraResponse mae : lMaeFil) {
						if (mae.getCodigo().equals(val)) {
							o.put(ob.getNomCampoExcel(), val + "." + mae.getNombre());
						}
					}
				}
			}
		}
		return o;
	}

}
