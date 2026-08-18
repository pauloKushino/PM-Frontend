import { Injectable, signal } from '@angular/core';
import { NovoProduto, Produto } from '../models/produto';

const PRODUTOS_INICIAIS: Produto[] = [
  {
    id: 1,
    nome: 'Notebook Gamer',
    descricao: 'Notebook 16GB RAM, SSD 512GB',
    preco: 4999.9,
    quantidadeEstoque: 8,
    categoria: 'Informática',
  },
  {
    id: 2,
    nome: 'Mouse sem fio',
    descricao: 'Mouse ergonômico com sensor óptico',
    preco: 89.9,
    quantidadeEstoque: 42,
    categoria: 'Acessórios',
  },
  {
    id: 3,
    nome: 'Teclado mecânico',
    descricao: 'Teclado ABNT2 com switches azuis',
    preco: 259.5,
    quantidadeEstoque: 15,
    categoria: 'Acessórios',
  },
];

export interface MensagemCrud {
  tipo: 'sucesso' | 'erro';
  texto: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private readonly produtos = signal<Produto[]>(PRODUTOS_INICIAIS);
  private readonly feedback = signal<MensagemCrud | null>(null);
  private proximoId = Math.max(...PRODUTOS_INICIAIS.map((produto) => produto.id), 0) + 1;

  readonly listaProdutos = this.produtos.asReadonly();
  readonly mensagem = this.feedback.asReadonly();

  obterPorId(id: number): Produto | undefined {
    return this.produtos().find((produto) => produto.id === id);
  }

  criar(novoProduto: NovoProduto): Produto {
    const produto: Produto = { id: this.proximoId++, ...novoProduto };
    this.produtos.update((lista) => [...lista, produto]);
    this.feedback.set({ tipo: 'sucesso', texto: `Produto "${produto.nome}" criado com sucesso.` });
    return produto;
  }

  atualizar(id: number, dados: NovoProduto): Produto | undefined {
    if (!this.obterPorId(id)) {
      this.feedback.set({ tipo: 'erro', texto: 'Produto não encontrado para edição.' });
      return undefined;
    }

    const produtoAtualizado: Produto = { id, ...dados };
    this.produtos.update((lista) =>
      lista.map((produto) => (produto.id === id ? produtoAtualizado : produto)),
    );
    this.feedback.set({
      tipo: 'sucesso',
      texto: `Produto "${produtoAtualizado.nome}" atualizado com sucesso.`,
    });
    return produtoAtualizado;
  }

  remover(id: number): boolean {
    const produto = this.obterPorId(id);
    if (!produto) {
      this.feedback.set({ tipo: 'erro', texto: 'Produto não encontrado para exclusão.' });
      return false;
    }

    this.produtos.update((lista) => lista.filter((produto) => produto.id !== id));
    this.feedback.set({ tipo: 'sucesso', texto: `Produto "${produto.nome}" excluído com sucesso.` });
    return true;
  }

  limparMensagem(): void {
    this.feedback.set(null);
  }
}
