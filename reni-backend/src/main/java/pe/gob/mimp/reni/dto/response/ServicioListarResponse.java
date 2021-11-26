package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;

import lombok.Getter;
import lombok.ToString;
import lombok.Setter;

@Getter
@Setter
@ToString
public class ServicioListarResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idServicio;
	private String idtTipCentro;
	private String nomTipCentro;
	private String codigo;
	private String nombre;
	private Integer flgActivo;
	private Long idEntidad;
	private String nomEntidad;
	private Long idLineaIntervencion;
	private String nomLineaIntervencion;
}
