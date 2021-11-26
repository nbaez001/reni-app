package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class EdneListarRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private String nomEstructura;
	private String nomEntidad;
	private Long idLineaInter;
	private String nomServicio;
	private Integer flgActivo;
	private Date fecInicio;
	private Date fecFin;
}
