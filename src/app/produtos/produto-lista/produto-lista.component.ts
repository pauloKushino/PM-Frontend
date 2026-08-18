import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProdutoService } from '../../core/services/produto.service';

@Component({
  selector: 'app-produto-lista',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './produto-lista.component.html',
  styleUrl: './produto-lista.component.scss',
})
export class ProdutoListaComponent {
  private readonly produtoService = inject(ProdutoService);

  protected readonly produtos = this.produtoService.listaProdutos;
  protected readonly mensagem = this.produtoService.mensagem;

  remover(id: number, nome: string): void {
    const confirmou = confirm(`Deseja realmente excluir o produto "${nome}"?`);
    if (confirmou) {
      this.produtoService.remover(id);
    }
  }

  limparMensagem(): void {
    this.produtoService.limparMensagem();
  }
}
