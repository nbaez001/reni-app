package pe.gob.mimp.reni.dto.request;

import java.io.Serializable;
import java.util.List;

import lombok.Getter;
import lombok.ToString;
import lombok.Setter;

@Getter
@Setter
@ToString
public class MaestraCargaMasivaListarMaeRequest implements Serializable {
	private static final long serialVersionUID = 1L;

	private List<String> listaMaestra;
}
