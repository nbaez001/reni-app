package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ServicioModificarRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idServicio;
	private String idtTipCentro;
	private String nombre;
	private String codigo;
	private Long idEntidad;
	private Long idLineaIntervencion;
	private Long idUsuarioModif;
}
