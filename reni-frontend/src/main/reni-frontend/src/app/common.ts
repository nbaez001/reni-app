import { ReporteParametroEstrucListarResponse } from "./modules/intranet/dto/response/reporte-parametro-estruc-listar.response";

export const MENSAJES_PANEL = {
    INTRANET: {
        MANTENIMIENTO: {
            MAESTRA: {
                REGISTRAR: {
                    TITLE: 'REGISTRAR MAESTRA'
                },
                MODIFICAR: {
                    TITLE: 'MODIFICAR MAESTRA'
                },
                BDJ_SUBITEM: {
                    TITLE(nomMaestra: string): string { return 'REGISTRAR SUB-ITEMS MAESTRA: "' + nomMaestra + '"' }
                },
                CARGA_MASIVA: {
                    TITLE: 'CARGA MASIVA DE MAESTRAS'
                },
                CARGA_MASIVA_PARAM_ERRORES: {
                    TITLE: 'LISTA DE ERRORES EN LOS DATOS'
                }

            },
            ENTIDAD: {
                REGISTRAR: {
                    TITLE: 'REGISTRAR ENTIDAD'
                },
                MODIFICAR: {
                    TITLE: 'MODIFICAR ENTIDAD'
                },
                BUSCAR_AREA_SEG: {
                    TITLE: 'BUSCAR ENTIDAD EN BD SEGURIDAD'
                }
            },
            LINEA_INTERVENCION: {
                REGISTRAR: {
                    TITLE: 'REGISTRAR LINEA INTERVENCION'
                },
                MODIFICAR: {
                    TITLE: 'MODIFICAR LINEA INTERVENCION'
                }
            },
            SERVICIO: {
                REGISTRAR: {
                    TITLE: 'REGISTRAR SERVICIO'
                },
                MODIFICAR: {
                    TITLE: 'MODIFICAR SERVICIO'
                },
                BUSCAR_ENTIDAD: {
                    TITLE: 'BUSCAR ENTIDAD'
                },
                BUSCAR_LINEA_INTERVENCION: {
                    TITLE: 'BUSCAR LINEA INTERVENCION'
                }
            },
            CENTRO_ATENCION: {
                REGISTRAR: {
                    TITLE: 'REGISTRAR CENTRO DE ATENCION'
                },
                MODIFICAR: {
                    TITLE: 'MODIFICAR CENTRO DE ATENCION'
                },
                SERVICIOS_CENTRO_ATEN: {
                    TITLE: 'SERVICIOS QUE PRESTA EL CENTRO DE ATENCION'
                },
                CARGA_MASIVA: {
                    TITLE: 'CARGA MASIVA DE CENTRO DE ATENCION'
                },
                CARGA_MASIVA_PARAM_ERRORES: {
                    TITLE: 'LISTA DE ERRORES EN LOS DATOS'
                }
            },
            ESTRUCTURA: {
                REGISTRAR: {
                    TITLE: 'REGISTRAR ESTRUCTURA'
                },
                MODIFICAR: {
                    TITLE: 'MODIFICAR ESTRUCTURA'
                },
                BUSCAR_SERVICIO: {
                    TITLE: 'BUSCAR SERVICIO'
                },
                BUSCAR_ESTRUCTURA_RPL: {
                    TITLE: 'BUSCAR ESTRUCTURA REPLICAR'
                },
                BUSCAR_TABLA_BD: {
                    TITLE: 'BUSCAR TABLA DE LA BASE DE DATOS'
                },
                BUSCAR_CAMPO_BD: {
                    TITLE(nomTabla: string): string { return 'BUSCAR CAMPO DE LA TABLA: "' + nomTabla + '"' }
                },
                BUSCAR_TABLA_MAE: {
                    TITLE: 'BUSCAR ID TABLA MAESTRA'
                },
                REGISTRAR_CAMPO_BD: {
                    TITLE(nomTabla: string): string { return 'REGISTRAR NUEVO CAMPO EN LA TABLA: "' + nomTabla + '"' }
                },
                CARGA_MASIVA_PARAM: {
                    TITLE: 'CARGAR PARAMETROS DE ESTRUCTURA MASIVAMENTE'
                },
                CARGA_MASIVA_PARAM_ERRORES: {
                    TITLE: 'LISTA DE ERRORES EN LOS DATOS'
                },
                REGISTRAR_CAMPO_BD_RAPIDO: {
                    TITLE(nomTabla: string): string { return 'REGISTRAR NUEVO CAMPO EN LA TABLA: "' + nomTabla + '"' }
                }
            },
            EDNE: {
                REGISTRAR: {
                    TITLE: 'REGISTRAR RENE'
                },
                MODIFICAR: {
                    TITLE: 'MODIFICAR RENE'
                },
                BUSCAR_ESTRUCTURA: {
                    TITLE: 'BUSCAR ESTRUCTURA'
                },
                ERRORES: {
                    TITLE: 'LISTA DE ERRORES EN LOS DATOS'
                }
            },
            TIPO_CENTRO: {
                REGISTRAR: {
                    TITLE: 'REGISTRAR TIPO CENTRO'
                },
                MODIFICAR: {
                    TITLE: 'MODIFICAR TIPO CENTRO'
                },
                SUB_TIPO_CENTRO: {
                    TITLE: 'SUBTIPO DE CENTRO'
                }
            },
        },
        ADMINISTRACION: {
            PRODUCTO: {
                REGISTRAR: {
                    TITLE: 'REGISTRAR PRODUCTO'
                },
                EDITAR: {
                    TITLE: 'MODIFICAR PRODUCTO'
                },
                CARGA_MASIVA: {
                    TITLE: 'CARGAR PRODUCTOS MASIVAMENTE'
                }
            },
            PROVEEDOR: {
                REGISTRAR: 'REGISTRAR PROVEEDOR',
                EDITAR: 'MODIFICAR PROVEEDOR',
                REGISTRAR_REP_LEGAL: 'REGISTRAR REPRESENTANTE LEGAL'
            },
            MARCA: {
                REGISTRAR: {
                    TITLE: 'REGISTRAR MARCA'
                },
                EDITAR: {
                    TITLE: 'MODIFICAR MARCA'
                }
            }
        },
        PROCESO: {
            USAURIO: {
                MODIFICAR: {
                    TITLE: 'MODIFICAR USUARIO'
                },
                ASOCIAR: {
                    TITLE: 'ASOCIAR USUARIO NO IDENTIFICADO'
                }
            }
        },
        REPORTES: {
            GENERAL: {

            },
            INDIVIDUAL: {
                BUSCAR_USUARIO: {
                    TITLE: 'BUSCAR USUARIO'
                }
            }
        },
        ACCESOS: {
            PERFIL: {
                REGISTRAR: {
                    TITLE: 'REGISTRAR PERFIL'
                },
                MODIFICAR: {
                    TITLE: 'MODIFICAR PERFIL'
                }
            },
            CUENTA_SISTEMA: {
                REGISTRAR: {
                    TITLE: 'REGISTRAR CUENTA SISTEMA'
                },
                MODIFICAR: {
                    TITLE: 'MODIFICAR CUENTA SISTEMA'
                }
            }
        }
    }
};

export const MENSAJES = {
    ERROR_FOREIGN_KEY: 'No se eliminar una categoria que tiene sub items',
    EXITO_OPERACION: 'Operacion exitosa',
    MSG_EXITO_OPERACION: 'Operacion exitosa',
    MSG_CONFIRMACION: '¿Esta seguro de continuar?',
    MSG_CONFIRMACION_DELETE: '¿Esta seguro que desea eliminar el registro seleccionado?',
    MSG_CONFIRMACION_AGREGAR_CAMPO_BD: '¿Esta seguro que desea agregar una nueva columna a la base de datos?',
    MSG_CONFIRMACION_AGREGAR_CAMPO_BD_DETALLE: 'Despues de agregarla no es posible eliminarla, sino con una solicitud al administrador de base de datos - DBA',
    MSG_CONFIRM_REPLICAR_ESTRUCTURA: '¿Esta seguro que desea replicar el mapeo de campos de la estructura seleccionada?',
    MSG_CONFIRM_REPLICAR_ESTRUCTURA_DETALLE: 'Se eliminaran todos los mapeos de campos previos registrados',
    MSG_ERROR_IMPORTACION: 'Lista de errores e importacion',
    MSG_CONFIRM_FUNC_VACIO: '¿Esta seguro de guardar este perfil?',
    MSG_CONFIRM_FUNC_VACIO_DETALLE: 'No se ha seleccionado ninguna funcionalidad diferente a "Home"'
};

export const CONSTANTES = {
    FLG_ACTIVO: 1,
    FLG_INACTIVO: 0,
    R_COD_EXITO: 0,

    PERFIL_OMEP: 'OMEP',

    COD_CONFIRMADO: 1,
    COD_NO_CONFIRMADO: 0,
};

export const CAMPOS_EXCEL = {
    COD_CEN: 'COD_CEN',
    COD_USU: 'COD_USU',
    TIP_DOC_USU: 'TIP_DOC_USU',
    NRO_DOC_USU: 'NRO_DOC_USU',
    EST_ACT: 'EST_ACT',
};

export const CAMPO_EXCEL_FIJOS = [
    'COD_ENT',
    'NOM_ENT',
    'COD_LIN',
    'NOM_LIN_INT',
    'COD_SER',
    'NOM_SER',
    'NOM_CEN',
    'UBI_CEN',
    'DEP_CEN',
    'PRO_CEN',
    'DIS_CEN',
    'ANO_REP',
    'FEC_COR_REP',
    'PER_INF'
];

export const TABLAS_BD = {
    EDNE: {
        NOMBRE: 'EDNE',
        CAMPOS: {
            FEC_IMPORTACION: 'FEC_IMPORTACION',
            FEC_PERIODO: 'FEC_PERIODO',
        },
        PREFIJO: 'ED'
    },
    ENTIDAD: {
        NOMBRE: 'ENTIDAD',
        CAMPOS: {
            NID_ENTIDAD: 'NID_ENTIDAD',
        },
        PREFIJO: 'E'
    },
    LINEA_INTERVENCION: {
        NOMBRE: 'LINEA_INTERVENCION',
        CAMPOS: {
            NID_LINEA_INTER: 'NID_LINEA_INTER',
        },
        PREFIJO: 'LI'
    },
    SERVICIO: {
        NOMBRE: 'SERVICIO',
        CAMPOS: {
            NID_CENTRO_ATEN: 'NID_SERVICIO',
        },
        PREFIJO: 'S'
    },
    CENTRO_ATENCION: {
        NOMBRE: 'CENTRO_ATENCION',
        CAMPOS: {
            NID_CENTRO_ATEN: 'NID_CENTRO_ATEN',
        },
        PREFIJO: 'CA'
    },
    USUARIO: {
        NOMBRE: 'USUARIO',
        CAMPOS: {
            NID_USUARIO: 'NID_USUARIO'
        },
        PREFIJO: 'U'
    },
    USUARIO_DETALLE: {
        NOMBRE: 'USUARIO_DETALLE',
        CAMPOS: {
            NID_USUARIO_DETALLE: 'NID_USUARIO_DETALLE',
            NID_USUARIO: 'NID_USUARIO',
            NID_EDNE: 'NID_EDNE',
            NID_CENTRO_ATEN: 'NID_CENTRO_ATEN',
        },
        PREFIJO: 'UD'
    },
    USUARIO_INGRESO: {
        NOMBRE: 'USUARIO_INGRESO',
        CAMPOS: {
            NID_USUARIO_INGRESO: 'NID_USUARIO_INGRESO',
            NID_USUARIO_DETALLE: 'NID_USUARIO_DETALLE',
        },
        PREFIJO: 'UI'
    },
    AGENTE_EXTERNO: {
        NOMBRE: 'AGENTE_EXTERNO',
        CAMPOS: {
            NID_AGENTE_EXTERNO: 'NID_AGENTE_EXTERNO',
            NID_USUARIO_INGRESO: 'NID_USUARIO_INGRESO',
        },
        PREFIJO: 'AE'
    },
    USUARIO_SITUACION: {
        NOMBRE: 'USUARIO_SITUACION',
        CAMPOS: {
            NID_USUARIO_SITUACION: 'NID_USUARIO_SITUACION',
            NID_USUARIO_DETALLE: 'NID_USUARIO_DETALLE',
        },
        PREFIJO: 'US'
    },
    USUARIO_ACTIVIDAD: {
        NOMBRE: 'USUARIO_ACTIVIDAD',
        CAMPOS: {
            NID_USUARIO_ACTIVIDAD: 'NID_USUARIO_ACTIVIDAD',
            NID_USUARIO_DETALLE: 'NID_USUARIO_DETALLE',
        },
        PREFIJO: 'UA'
    }
};

export const SQL_AUDITORIA = {
    QUERY: ',FLG_ACTIVO,NID_USUARIO_CREACION,FEC_CREACION,TXT_PC_CREACION,TXT_IP_CREACION) ',
    DATA: ',{FLG_ACTIVO},{NID_USUARIO_CREACION},{FEC_CREACION},{TXT_PC_CREACION},{TXT_IP_CREACION})'
}

export const ACTIVO_LISTA: any[] = [{ id: 1, nombre: 'ACTIVO' }, { id: 0, nombre: 'INACTIVO' }]
export const LISTA_CONFIRMACION: any[] = [{ id: 1, nombre: 'SI' }, { id: 0, nombre: 'NO' }]

export const MAESTRAS = {
    TIPO_DOCUMENTO: 'TIP_DOC_USU',
    TIPO_CENTRO: 'TIPO_CENTRO',
    SUBTIPO_CENTRO: 'SUB_TIPO_CENTRO',
    TIPO_USUARIO: 'TIPO_USUARIO',
    ESTADO_EDNE: 'ESTADO_EDNE',

    TIENE_DOC_IDE: 'TIE_DOC_IDE',
    SEXO_USU: 'SEX_USU',
};

export const ESTADO_EDNE = {
    PENDIENTE: '1',
    APROBADO: '2'
};

export const TIENE_DOC_IDE = {
    SI_TIENE: '1',
    NO_TIENE: '2',
    EN_PROCESO: '3',

    TIP_DOCUMENTO_NO_APLICA: '7',
};

export const TIPOS_DATO_BD = [
    { nombre: 'TEXTO', tipo: 'VARCHAR2', longitud: 1, presicion: 0, escala: 0, validacion: 'string' },
    { nombre: 'FECHA', tipo: 'DATE', longitud: 0, presicion: 0, escala: 0, validacion: 'date' },
    { nombre: 'NUMERICO', tipo: 'NUMBER', longitud: 0, presicion: 1, escala: 1, validacion: 'number' },
];

export const TIPOS_DATO = {
    VARCHAR2: { tipo: 'VARCHAR2', nombre: 'TEXTO', longitud: 1, presicion: 0, escala: 0, validacion: 'string' },
    NUMBER: { tipo: 'NUMBER', nombre: 'NUMERICO', longitud: 0, presicion: 0, escala: 0, validacion: 'date' },
    DATE: { tipo: 'DATE', nombre: 'FECHA', longitud: 0, presicion: 1, escala: 1, validacion: 'number' },
};

export const FILE = {
    FILE_UPLOAD_MAX_SIZE: 52428800,
    FILE_UPLOAD_MAX_SIZE_MSG: function (size: number) {
        return 'SOLO SE PERMITEN ARCHIVOS DE 50MB COMO MAXIMO\n TAMAÑO DE ARCHIVO: ' + parseFloat((size / 1024 / 1024) + '').toFixed(2) + 'MB';
    }
}

export const MENU_HOME = {
    REFERENCIA: '/intranet/home'
}

export const MY_FORMATS_RENI = {
    parse: {
        dateInput: 'DD/MM/YYYY'
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY'
    }
};

export const CAMPOS_EXCLUIR_DISOCIACION = [
    {
        nomCampoExcel: 'COD_USU',
        ordenCampoExcel: 0,
        nomTablaBd: 'USUARIO',
        nomCampoBd: 'TXT_B_001',
        campoEsFk: 0,
        campoIdMaestra: null,
        descCampoExcel: 'Codigo de usuario/a',
        tipoDato: 'VARCHAR2',
        longitudDato: 50,
        precisionDato: 0,
        escalaDato: 0,
    },
    {
        nomCampoExcel: 'NRO_DOC_USU',
        ordenCampoExcel: 0,
        nomTablaBd: 'USUARIO',
        nomCampoBd: 'TXT_B_004',
        campoEsFk: 0,
        campoIdMaestra: null,
        descCampoExcel: 'Número de Documento de Identidad',
        tipoDato: 'VARCHAR2',
        longitudDato: 15,
        precisionDato: 0,
        escalaDato: 0,
    },
    {
        nomCampoExcel: 'APE_PAT_USU',
        ordenCampoExcel: 0,
        nomTablaBd: 'USUARIO',
        nomCampoBd: 'TXT_B_007',
        campoEsFk: 0,
        campoIdMaestra: null,
        descCampoExcel: 'Apellido Paterno del Usuario',
        tipoDato: 'VARCHAR2',
        longitudDato: 100,
        precisionDato: 0,
        escalaDato: 0,
    },
    {
        nomCampoExcel: 'APE_MAT_USU',
        ordenCampoExcel: 0,
        nomTablaBd: 'USUARIO',
        nomCampoBd: 'TXT_B_008',
        campoEsFk: 0,
        campoIdMaestra: null,
        descCampoExcel: 'Apellido Materno del Usuario',
        tipoDato: 'VARCHAR2',
        longitudDato: 100,
        precisionDato: 0,
        escalaDato: 0,
    },
    {
        nomCampoExcel: 'NOM_USU',
        ordenCampoExcel: 0,
        nomTablaBd: 'USUARIO',
        nomCampoBd: 'TXT_B_006',
        campoEsFk: 0,
        campoIdMaestra: null,
        descCampoExcel: 'Nombre del Usuario',
        tipoDato: 'VARCHAR2',
        longitudDato: 100,
        precisionDato: 0,
        escalaDato: 0,
    },
    {
        nomCampoExcel: 'DIR_RES',
        ordenCampoExcel: 0,
        nomTablaBd: 'USUARIO_DETALLE',
        nomCampoBd: 'TXT_B_015',
        campoEsFk: 0,
        campoIdMaestra: null,
        descCampoExcel: 'Dirección donde reside el usuario/a',
        tipoDato: 'VARCHAR2',
        longitudDato: 100,
        precisionDato: 0,
        escalaDato: 0,
    }
];

export const CAMPOS_INCLUIR_DISOCIACION: ReporteParametroEstrucListarResponse[] = [
    {
        nomCampoExcel: 'COD_DISOC',
        ordenCampoExcel: 0,
        nomTablaBd: 'USUARIO',
        nomCampoBd: 'TXT_COD_DISOC',
        campoEsFk: 0,
        campoIdMaestra: null,
        descCampoExcel: 'Codigo disociación',
        tipoDato: 'VARCHAR2',
        longitudDato: 50,
        precisionDato: 0,
        escalaDato: 0,
    }
];

export const PLANTILLAS = {
    EXCEL: {
        CENTRO_ATENCION: 'centroAtencion',
        MAESTRA: 'maestra',
        PARAMETRO_ESTRUCTURA: 'parametroEstructura'
    }
}