import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.html',
  styleUrls: ['./carousel.css']
})
export class CarouselComponent implements OnInit, OnDestroy {
  slides = [
    {
      image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1200&h=400&fit=crop',
      title: 'Tecnología de Vanguardia',
      description: 'Los mejores productos tecnológicos al alcance de tu mano',
      showButton: false // ← Nueva propiedad
    },
    {
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=400&fit=crop',
      title: 'Ofertas Especiales',
      description: 'Descuentos exclusivos en productos seleccionados',
      showButton: true // ← Solo esta slide tendrá botón
    },
    {
      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&h=400&fit=crop',
      title: 'Envío Gratis',
      description: 'Envío gratuito en compras mayores a $100',
      showButton: false // ← Nueva propiedad
    }
  ];

  currentSlide = 0;
  private autoSlideInterval: any;

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // 5 segundos
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  // Opcional: Pausar auto-slide cuando el usuario interactúa
  onUserInteraction(): void {
    this.stopAutoSlide();
    this.startAutoSlide(); // Reiniciar después de la interacción
  }
}