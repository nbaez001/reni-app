package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MaestraSubitemListarResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idMaestra;
	private String codigo;
	private String nombre;
	private String descripcion;
	private Integer flgActivo;
	private Integer orden;
}
