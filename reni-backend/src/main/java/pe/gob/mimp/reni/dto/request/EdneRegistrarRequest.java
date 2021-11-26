package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import pe.gob.mimp.reni.dto.response.EdneListarParamEstructuraResponse;

@Getter
@Setter
@ToString
public class EdneRegistrarRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long idEstructura;
	private String nomArchivo;
	private Date fecImportacion;
	private Date fecPeriodo;
	private String idtEstado;
	private List<EdneListarParamEstructuraResponse> listaParametro;
	private List<Map<String, Object>> listaUsuario;
//	private List<EdneRegistrarDetUsuarioRequest> listaUsuarioIdentificado;
//	private List<EdneRegistrarDetUsuarioRequest> listaUsuarioNoIdentificado;
//	private String queryUsuario;
//	private String queryUsuarioDetalle;
//	private String queryUsuarioIngreso;
//	private String queryAgenteExterno;
//	private String queryUsuarioActividad;
//	private String queryUsuarioSituacion;
	private Long idUsuarioCrea;
}
