import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProdutoService } from '../../core/services/produto.service';

@Component({
  selector: 'app-produto-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './produto-form.component.html',
  styleUrl: './produto-form.component.scss',
})
export class ProdutoFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly produtoService = inject(ProdutoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly idProduto = signal<number | null>(this.lerIdDaRota());

  protected readonly modoEdicao = computed(() => this.idProduto() !== null);
  protected readonly erroCarregamento = signal<string | null>(null);
  protected readonly nomeProduto = signal('');

  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(2)]],
    descricao: ['', [Validators.required]],
    preco: [0, [Validators.required, Validators.min(0.01)]],
    quantidadeEstoque: [0, [Validators.required, Validators.min(0)]],
    categoria: ['', [Validators.required, Validators.minLength(2)]],
  });

  constructor() {
    const id = this.idProduto();
    if (id !== null) {
      if (!Number.isInteger(id) || id <= 0) {
        this.erroCarregamento.set('O identificador informado para o produto é inválido.');
        return;
      }

      const produto = this.produtoService.obterPorId(id);
      if (!produto) {
        this.erroCarregamento.set('Não foi possível encontrar esse produto na lista mockada.');
        return;
      }

      this.nomeProduto.set(produto.nome);
      this.form.setValue({
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        quantidadeEstoque: produto.quantidadeEstoque,
        categoria: produto.categoria,
      });
    }
  }

  salvar(): void {
    if (this.erroCarregamento() || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dados = this.form.getRawValue();
    const id = this.idProduto();

    if (id !== null) {
      const produtoAtualizado = this.produtoService.atualizar(id, dados);
      if (!produtoAtualizado) {
        this.erroCarregamento.set('Não foi possível encontrar esse produto para edição.');
        return;
      }
    } else {
      this.produtoService.criar(dados);
    }

    this.router.navigateByUrl('/produtos');
  }

  remover(): void {
    const id = this.idProduto();
    if (id === null || this.erroCarregamento()) {
      return;
    }

    const confirmou = confirm(`Deseja realmente excluir o produto "${this.nomeProduto()}"?`);
    if (confirmou && this.produtoService.remover(id)) {
      this.router.navigateByUrl('/produtos');
    }
  }

  private lerIdDaRota(): number | null {
    const idParam = this.route.snapshot.paramMap.get('id');
    return idParam === null ? null : Number(idParam);
  }
}
