import { Injectable, signal } from '@angular/core';

const CHAVE_SESSAO = 'pm-frontend-autenticado';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly logado = signal<boolean>(sessionStorage.getItem(CHAVE_SESSAO) === '1');

  readonly estaLogado = this.logado.asReadonly();

  login(email: string, senha: string): boolean {
    if (!email || !senha) {
      return false;
    }
    this.logado.set(true);
    sessionStorage.setItem(CHAVE_SESSAO, '1');
    return true;
  }

  logout(): void {
    this.logado.set(false);
    sessionStorage.removeItem(CHAVE_SESSAO);
  }
}
