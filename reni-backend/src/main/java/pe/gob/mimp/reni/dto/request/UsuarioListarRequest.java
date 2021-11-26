package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;
import java.util.Date;

import lombok.Getter;
import lombok.ToString;
import lombok.Setter;

@Getter
@Setter
@ToString
public class UsuarioListarRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private Integer flgActivo;
	private String idtTieneDoc;
	private Date fecInicio;
	private Date fecFin;
}
