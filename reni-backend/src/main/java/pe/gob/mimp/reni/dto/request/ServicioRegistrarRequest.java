package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ServicioRegistrarRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private String idtTipCentro;
	private String nombre;
	private String codigo;
	private Long idEntidad;
	private Long idLineaIntervencion;
	private Long idUsuarioCrea;
}
