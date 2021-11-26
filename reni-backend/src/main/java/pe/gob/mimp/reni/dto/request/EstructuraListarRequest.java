package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class EstructuraListarRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private String nombre;
	private String nomEntidad;
	private Long idLineaInter;
	private String nomServicio;
	private Integer flgActivo;
}
