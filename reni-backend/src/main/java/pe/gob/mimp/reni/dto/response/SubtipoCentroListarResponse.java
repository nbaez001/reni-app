package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SubtipoCentroListarResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idSubtipoCentro;
	private String codigo;
	private String nombre;
	private String abreviatura;
	private String descripcion;
	private Integer flgActivo;
	private Integer orden;
}
