import { Component } from '@angular/core';
import { ComentariosComponent } from './comentarios/comentarios.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ComentariosComponent],
  template: '<app-comentarios></app-comentarios>'
})
export class AppComponent {}
