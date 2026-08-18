export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidadeEstoque: number;
  categoria: string;
}

export type NovoProduto = Omit<Produto, 'id'>;
