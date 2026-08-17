import { Injectable, signal } from '@angular/core';
import { NovoProduto, Produto } from '../models/produto';

const PRODUTOS_INICIAIS: Produto[] = [
  { id: 1, nome: 'Notebook Gamer', descricao: 'Notebook 16GB RAM, SSD 512GB', preco: 4999.9, quantidade: 8 },
  { id: 2, nome: 'Mouse sem fio', descricao: 'Mouse ergonômico com sensor óptico', preco: 89.9, quantidade: 42 },
  { id: 3, nome: 'Teclado mecânico', descricao: 'Teclado ABNT2 com switches azuis', preco: 259.5, quantidade: 15 },
];

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private readonly produtos = signal<Produto[]>(PRODUTOS_INICIAIS);
  private proximoId = PRODUTOS_INICIAIS.length + 1;

  readonly listaProdutos = this.produtos.asReadonly();

  obterPorId(id: number): Produto | undefined {
    return this.produtos().find((produto) => produto.id === id);
  }

  criar(novoProduto: NovoProduto): Produto {
    const produto: Produto = { id: this.proximoId++, ...novoProduto };
    this.produtos.update((lista) => [...lista, produto]);
    return produto;
  }

  atualizar(id: number, dados: NovoProduto): void {
    this.produtos.update((lista) =>
      lista.map((produto) => (produto.id === id ? { id, ...dados } : produto)),
    );
  }

  remover(id: number): void {
    this.produtos.update((lista) => lista.filter((produto) => produto.id !== id));
  }
}
