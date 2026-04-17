import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService, CommentItem } from '../api.service';

interface NewCommentForm {
  nombre: string;
  correo: string;
  comentario: string;
}

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comentarios.component.html'
})
export class ComentariosComponent implements OnInit {
  comentarios: CommentItem[] = [];
  comentariosCreados: CommentItem[] = [];
  cargando = false;
  mensaje = '';
  errorCarga = '';
  comentarioAEliminarId: number | null = null;

  nuevo: NewCommentForm = {
    nombre: '',
    correo: '',
    comentario: ''
  };

  constructor(private readonly apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerComentarios();
  }

  get totalComentarios(): number {
    return this.comentarios.length + this.comentariosCreados.length;
  }

  obtenerComentarios(): void {
    this.cargando = true;
    this.errorCarga = '';
    this.apiService.getComments().subscribe({
      next: (data) => {
        this.comentarios = data.map((item) => ({ ...item }));
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.errorCarga = 'No se pudieron cargar los comentarios de la API.';
      }
    });
  }

  registrarComentario(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const fechaActual = new Date().toLocaleString('es-ES');
    const payload: CommentItem = {
      name: this.nuevo.nombre,
      body: this.nuevo.comentario,
      email: this.nuevo.correo,
      postId: 1,
      createdAt: fechaActual
    };

    this.apiService.addComment(payload).subscribe({
      next: (resp) => {
        const comentarioCreado: CommentItem = {
          ...payload,
          id: resp.id ?? this.totalComentarios + 1
        };
        this.comentariosCreados = [comentarioCreado, ...this.comentariosCreados];
        this.mensaje = `Comentario registrado correctamente (${fechaActual}).`;
        form.resetForm();
      },
      error: () => {
        this.mensaje = 'No se pudo registrar el comentario.';
      }
    });
  }

  pedirConfirmacionEliminar(id?: number): void {
    if (!id) {
      return;
    }
    this.comentarioAEliminarId = id;
  }

  cancelarEliminar(): void {
    this.comentarioAEliminarId = null;
  }

  eliminarComentario(item: CommentItem): void {
    if (!item.id) {
      return;
    }

    this.apiService.deleteComment(item.id).subscribe({
      next: () => {
        const estabaEnSesion = this.comentariosCreados.some((c) => c.id === item.id);
        this.comentariosCreados = this.comentariosCreados.filter((c) => c.id !== item.id);

        if (!estabaEnSesion) {
          this.comentarios = this.comentarios.filter((c) => c.id !== item.id);
        }

        this.mensaje = 'Comentario eliminado correctamente.';
        this.comentarioAEliminarId = null;
      },
      error: () => {
        this.mensaje = 'No se pudo eliminar el comentario.';
        this.comentarioAEliminarId = null;
      }
    });
  }
}
