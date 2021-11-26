package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ReporteIntervencionXUsuarioListarRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private String sqlFields;
	private String sqlTables;
	private List<ReporteIntervencionXUsuarioListarDetRequest> listaMapeo;
	private String tipDocUsu;
	private String nroDocUsu;
	private String codUsu;

}
