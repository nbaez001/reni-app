package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;

import lombok.Getter;
import lombok.ToString;
import lombok.Setter;

@Getter
@Setter
@ToString
public class EstructuraListarResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idEstructura;
	private String nombre;
	private String descripcion;
	private Long idServicio;
	private String nomServicio;
	private Long idEntidad;
	private String nomEntidad;
	private Long idLineaIntervencion;
	private String nomLineaIntervencion;
	private Integer flgActivo;
}
