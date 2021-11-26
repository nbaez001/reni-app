package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class EdneModificarRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idEdne;
	private Date fecImportacion;
	private Date fecPeriodo;
	private String idtEstado;
	private Long idUsuarioModif;
}
