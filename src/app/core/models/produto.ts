export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
}

export type NovoProduto = Omit<Produto, 'id'>;
