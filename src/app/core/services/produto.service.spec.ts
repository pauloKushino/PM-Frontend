import { TestBed } from '@angular/core/testing';

import { ProdutoService } from './produto.service';

describe('ProdutoService', () => {
  let service: ProdutoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdutoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deve listar os produtos mockados iniciais', () => {
    expect(service.listaProdutos().length).toBe(3);
    expect(service.listaProdutos()[0].categoria).toBe('Informática');
  });

  it('deve criar um produto com um novo id', () => {
    const produto = service.criar({
      nome: 'Monitor',
      descricao: 'Monitor IPS 24 polegadas',
      preco: 899.9,
      quantidadeEstoque: 10,
      categoria: 'Informática',
    });

    expect(produto.id).toBe(4);
    expect(service.obterPorId(produto.id)).toEqual(produto);
    expect(service.listaProdutos().length).toBe(4);
  });

  it('deve atualizar um produto existente', () => {
    const produto = service.atualizar(1, {
      nome: 'Notebook atualizado',
      descricao: 'Nova descrição',
      preco: 5500,
      quantidadeEstoque: 5,
      categoria: 'Computadores',
    });

    expect(produto?.nome).toBe('Notebook atualizado');
    expect(service.obterPorId(1)?.quantidadeEstoque).toBe(5);
  });

  it('deve remover um produto existente', () => {
    expect(service.remover(2)).toBe(true);
    expect(service.obterPorId(2)).toBeUndefined();
    expect(service.listaProdutos().length).toBe(2);
  });

  it('deve informar quando editar ou remover um produto inexistente', () => {
    const dados = {
      nome: 'Inexistente',
      descricao: 'Produto inexistente',
      preco: 10,
      quantidadeEstoque: 1,
      categoria: 'Teste',
    };

    expect(service.atualizar(999, dados)).toBeUndefined();
    expect(service.mensagem()?.tipo).toBe('erro');
    expect(service.remover(999)).toBe(false);
    expect(service.mensagem()?.texto).toContain('não encontrado');
  });
});
