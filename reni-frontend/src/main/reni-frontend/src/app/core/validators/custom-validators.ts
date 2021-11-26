import { Inject } from "@angular/core";
import { AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors } from "@angular/forms";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { CuentaSistemaService } from "src/app/modules/intranet/services/cuenta-sistema.service";
import { OutResponse } from "src/app/modules/sesion/dto/response/out.response";

export class CustomValidators {

    constructor(
        @Inject(CuentaSistemaService) private cuentaSistemaService: CuentaSistemaService) { }

    static urlValidator(control: AbstractControl): ValidationErrors | null {
        if (control.value && (!control.value.toUpperCase().startsWith('HTTPS') || !control.value.toUpperCase().includes('.ME'))) {
            return { urlValid: true };
        }
        return null;
    }

    static onlyNumbers(control: AbstractControl): ValidationErrors | null {
        let pattern = /^[0-9]*$/;
        if (control.value && !pattern.test(control.value.toUpperCase())) {
            return { onlyNumbers: true };
        }
        return null;
    }

    static notCaracterNumeral(control: AbstractControl): ValidationErrors | null {
        let pattern = /^((?!#).)*$/;
        if (control.value && !pattern.test(control.value.toUpperCase())) {
            return { notCaracterNumeral: true };
        }
        return null;
    }

    static notCaracterOR(control: AbstractControl): ValidationErrors | null {
        let pattern = /^((?!\|).)*$/;
        if (control.value && !pattern.test(control.value.toUpperCase())) {
            return { notCaracterOR: true };
        }
        return null;
    }

    static onlyAlfanumericoYSubguion(control: AbstractControl): ValidationErrors | null {
        let pattern = /^(\w)*$/;
        if (control.value && !pattern.test(control.value.toUpperCase())) {
            return { onlyAlfanumericoYSubguion: true };
        }
        return null;
    }

    static confirmPassword(control: AbstractControl): ValidationErrors | null {
        if (control.parent) {
            let pass = control.parent.controls['contrasenia'].value;
            let confPass = control.value;
            return pass == confPass ? null : { confirmPassword: true };
        } else {
            return { confirmPassword: true };
        }
    }

    static validUsername(cuentaSistemaService: CuentaSistemaService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            return cuentaSistemaService.validarExisteUsuario({ username: control.value }).pipe(
                map((result: OutResponse<number>) => (result.objeto == 0) ? null : { validUsername: true })
            );
        };
    }

    static validUsernameMod(cuentaSistemaService: CuentaSistemaService, username: string): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            if (control.value == username) {
                return of(null);
            } else {
                return cuentaSistemaService.validarExisteUsuario({ username: control.value }).pipe(
                    map((result: OutResponse<number>) => (result.objeto == 0) ? null : { validUsername: true })
                );
            }
        };
    }

    static onlyNumberPuntoSigno(control: AbstractControl): ValidationErrors | null {
        let pattern = /^[+-]{0,1}[0-9]*[.]*[0-9]*$/;
        if (control.value && !pattern.test(control.value.toUpperCase())) {
            return { onlyNumberPuntoSigno: true };
        }
        return null;
    }

    static patronYAlfanumerico(patron: string): ValidationErrors | null {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            let pattern = new RegExp('^' + patron + '\\.(\\w)+$');
            if (control.value && !pattern.test(control.value.toUpperCase())) {
                return JSON.parse(JSON.stringify({ patronYAlfanumerico: { patron: patron + '.XXX' } }));
            }
            return JSON.parse(JSON.stringify((null)));
        };
    }
}