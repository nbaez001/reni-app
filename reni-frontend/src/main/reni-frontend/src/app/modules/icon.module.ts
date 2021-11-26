import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { SharedModule } from './shared.module';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    MaterialModule,
  ]
})
export class IconModule {
  private path: string = './assets/images/svg-icons';

  constructor(private domSanitizer: DomSanitizer, public matIconRegistry: MatIconRegistry) {
    this.matIconRegistry
      .addSvgIcon('excel', this.setIconPath(`${this.path}/icons8-microsoft-excel.svg`))
      .addSvgIcon('broom', this.setIconPath(`${this.path}/broom.svg`));
  }

  private setIconPath(url: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
