package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;

import lombok.Getter;
import lombok.ToString;
import lombok.Setter;

@Getter
@Setter
@ToString
public class CentroAtencionServListarXTipCenResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idServicio;
	private String codigo;
	private String nombre;
}
