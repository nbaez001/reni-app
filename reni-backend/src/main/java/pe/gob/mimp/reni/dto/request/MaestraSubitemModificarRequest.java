package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MaestraSubitemModificarRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idMaestra;
	private String idTabla;
	private String codigo;
	private String nombre;
	private Integer orden;
	private String descripcion;
	private Long idUsuarioModif;

}
