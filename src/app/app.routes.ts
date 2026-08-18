import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'produtos',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./produtos/produto-lista/produto-lista.component').then(
            (m) => m.ProdutoListaComponent,
          ),
      },
      {
        path: 'novo',
        loadComponent: () =>
          import('./produtos/produto-form/produto-form.component').then(
            (m) => m.ProdutoFormComponent,
          ),
      },
      {
        path: ':id/editar',
        loadComponent: () =>
          import('./produtos/produto-form/produto-form.component').then(
            (m) => m.ProdutoFormComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
