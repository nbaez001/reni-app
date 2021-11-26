package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;

import lombok.Getter;
import lombok.ToString;
import lombok.Setter;

@Getter
@Setter
@ToString
public class LineaIntervencionEliminarRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idLineaInter;
	private Long idUsuarioModif;
}
