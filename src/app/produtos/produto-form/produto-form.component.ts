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

  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(2)]],
    descricao: ['', [Validators.required]],
    preco: [0, [Validators.required, Validators.min(0.01)]],
    quantidade: [0, [Validators.required, Validators.min(0)]],
  });

  constructor() {
    const id = this.idProduto();
    if (id !== null) {
      const produto = this.produtoService.obterPorId(id);
      if (produto) {
        this.form.setValue({
          nome: produto.nome,
          descricao: produto.descricao,
          preco: produto.preco,
          quantidade: produto.quantidade,
        });
      }
    }
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dados = this.form.getRawValue();
    const id = this.idProduto();

    if (id !== null) {
      this.produtoService.atualizar(id, dados);
    } else {
      this.produtoService.criar(dados);
    }

    this.router.navigateByUrl('/produtos');
  }

  private lerIdDaRota(): number | null {
    const idParam = this.route.snapshot.paramMap.get('id');
    return idParam ? Number(idParam) : null;
  }
}
