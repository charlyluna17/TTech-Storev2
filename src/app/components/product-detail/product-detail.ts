import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  relatedProducts: Product[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Escuchar cambios en los parámetros de la ruta
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.scrollToTop(); // ← Scroll al top antes de cargar
        this.loadProduct(id);
      } else {
        this.isLoading = false;
      }
    });
  }

  loadProduct(id: string): void {
    this.isLoading = true;
    this.product = undefined;
    this.relatedProducts = [];

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        if (product) {
          this.product = product;
          this.loadRelatedProducts(product.categoria, product.id);
        } else {
          this.product = undefined;
          this.relatedProducts = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.isLoading = false;
        this.product = undefined;
        this.relatedProducts = [];
      }
    });
  }

  loadRelatedProducts(category: string, currentProductId: string): void {
    this.productService.getProductsByCategory(category).subscribe({
      next: (products) => {
        this.relatedProducts = products
          .filter(p => p.id !== currentProductId)
          .slice(0, 3);
      },
      error: (error) => {
        console.error('Error loading related products:', error);
        this.relatedProducts = [];
      }
    });
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product);
      alert(`${this.product.nombre} agregado al carrito!`);
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  viewRelatedProduct(productId: string): void {
    this.scrollToTop(); // ← Scroll al top antes de navegar
    this.router.navigate(['/product', productId]);
  }

  // Método para hacer scroll al top de la página
  private scrollToTop(): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Desplazamiento suave
    });
    
    // Alternativa para mayor compatibilidad
    document.body.scrollTop = 0; // Para Safari
    document.documentElement.scrollTop = 0; // Para Chrome, Firefox, IE y Opera
  }
}