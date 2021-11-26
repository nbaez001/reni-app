package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CentroAtencionServListarXCentroResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idCentroAtenServicio;
	private Long idServicio;
	private String codigo;
	private String nombre;
}
