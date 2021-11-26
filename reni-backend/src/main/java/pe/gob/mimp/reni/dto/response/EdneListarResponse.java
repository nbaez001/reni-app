package pe.gob.mimp.reni.dto.response;

import java.io.Serializable;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class EdneListarResponse implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idEdne;
	private String nomArchivo;
	private Date fecImportacion;
	private Date fecPeriodo;
	private Long idEstructura;
	private String nomEstructura;
	private Long idServicio;
	private String nomServicio;
	private Long idEntidad;
	private String nomEntidad;
	private Long idLineaInter;
	private String nomLineaInter;
	private String idtEstado;
	private String nomEstado;
	private Integer flgActivo;
}
