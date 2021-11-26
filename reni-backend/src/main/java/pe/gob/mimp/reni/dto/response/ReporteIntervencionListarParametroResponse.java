package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ReporteIntervencionListarParametroResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private String nomCampoExcel;
	private String descripcion;
	private String descripcionMaestra;
	private Integer ordenCampoExcel;
	private Integer campoEsFk;
	private String campoIdmaestra;
	private String nomServicio;

}
