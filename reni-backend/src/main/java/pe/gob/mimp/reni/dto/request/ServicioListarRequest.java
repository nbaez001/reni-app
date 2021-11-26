package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ServicioListarRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private Integer flgActivo;
	private String nomServicio;
	private String nomEntidad;
	private Long idLineaIntervencion;
	private String idtTipCentro;
}
