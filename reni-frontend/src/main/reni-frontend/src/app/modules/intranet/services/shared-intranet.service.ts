import { AutenticacionService } from "../../sesion/service/autenticacion.service";
import { AdministracionBdService } from "./administracion-bd.service";
import { CentroAtencionService } from "./centro-atencion.service";
import { CuentaSistemaService } from "./cuenta-sistema.service";
import { EdneService } from "./edne.service";
import { EntidadService } from "./entidad.service";
import { EstructuraService } from "./estructura.service";
import { LineaIntervencionService } from "./linea-intervencion.service";
import { MaestraService } from "./maestra.service";
import { PerfilService } from "./perfil.service";
import { RecursosSeguridadService } from "./recursos-seguridad.service";
import { ReporteService } from "./reporte.service";
import { ServicioService } from "./servicio.service";
import { TipoCentroService } from "./tipo-centro.service";
import { UbigeoService } from "./ubigeo.service";
import { UsuarioReniService } from "./usuario-reni.service";

export const SharedIntranetService = [
    AutenticacionService,
    ReporteService,
    MaestraService,
    EntidadService,
    LineaIntervencionService,
    ServicioService,
    CentroAtencionService,
    UbigeoService,
    EstructuraService,
    AdministracionBdService,
    EdneService,
    PerfilService,
    CuentaSistemaService,
    RecursosSeguridadService,
    UsuarioReniService,
    TipoCentroService,
];