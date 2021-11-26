package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ReporteIntervencionListarDetRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private String nomCampoExcel;
	private Integer campoEsFk;
	private String campoIdMaestra;
	private String tipoDato;
	private Integer longitudDato;
	private Integer precisionDato;
	private Integer escalaDato;

}
