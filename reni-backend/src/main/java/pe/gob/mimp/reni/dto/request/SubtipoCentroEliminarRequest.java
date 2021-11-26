package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SubtipoCentroEliminarRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idSubtipoCentro;
	private Long idUsuarioModif;

}
