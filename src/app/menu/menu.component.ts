import { Component, computed, inject, OnInit, signal, HostListener, ElementRef, ViewChild, NgModule } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { LanguageService } from '../services/language.service';
import { MenuService } from '../services/menu.service';
import { Lang, MenuCategory, MenuData, MenuItem } from '../models/menu.model';

interface FilteredCategory extends MenuCategory {
  filteredItems: MenuItem[];
}

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  private readonly langService = inject(LanguageService);
  private readonly menuService = inject(MenuService);

  readonly lang = this.langService.currentLang;
  readonly menuData = signal<MenuData | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly searchQuery = signal('');
  readonly activeCategoryId = signal('');
  readonly mobileMenuOpen = signal(false);
  readonly showScrollTop = signal(false);
  readonly navScrolled = signal(false);
  readonly skeletonItems = [1, 2];

  readonly restaurant = computed(() => this.menuData()?.restaurant ?? null);
  readonly currency = computed(() => this.menuData()?.currency ?? 'रु');

  @ViewChild('categoryNav') categoryNav!: ElementRef<HTMLDivElement>;


  readonly filteredCategories = computed<FilteredCategory[]>(() => {
    const data = this.menuData();
    if (!data) return [];

    const query = this.searchQuery().toLowerCase();
    return data.categories
      .map(cat => {
        let items = cat.items;
        if (query) {
          items = items.filter(item => {
            const titleMatch = item.title.en.toLowerCase().includes(query) || item.title.ne.includes(query);
            const catMatch = cat.name.en.toLowerCase().includes(query) || cat.name.ne.includes(query);
            const variantMatch = item.variants?.some(
              v => v.label.en.toLowerCase().includes(query) || v.label.ne.includes(query)
            ) ?? false;
            return titleMatch || catMatch || variantMatch;
          });
        }
        return { ...cat, filteredItems: items };
      })
      .filter(cat => cat.filteredItems.length > 0);
  });

  private searchDebounce: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.menuService.getMenu().subscribe({
      next: (data) => {
        this.menuData.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      }
    });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showScrollTop.set(window.scrollY > 400);
    this.navScrolled.set(window.scrollY > 50);
    this.updateActiveCategory();
  }

  private updateActiveCategory(): void {
    const categories = this.filteredCategories();
    let activeId = '';
    for (const cat of categories) {
      const el = document.getElementById(`cat-${cat.id}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 160) {
          activeId = cat.id;
        }
      }
    }
    if (activeId && activeId !== this.activeCategoryId()) {
      this.activeCategoryId.set(activeId);
      this.scrollActiveNavIntoView(activeId);
    }
  }

  private scrollActiveNavIntoView(catId: string): void {
    const nav = this.categoryNav?.nativeElement;
    if (!nav) return;
    const activeLink = nav.querySelector(`[data-cat-id="${catId}"]`) as HTMLElement;
    if (!activeLink) return;
    const navRect = nav.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    const offsetLeft = linkRect.left - navRect.left - nav.clientWidth / 2 + linkRect.width / 2;
    nav.scrollBy({ left: offsetLeft, behavior: 'smooth' });
  }

  setLang(lang: Lang): void {
    this.langService.setLang(lang);
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();
    if (this.searchDebounce) clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => this.searchQuery.set(value), 250);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  scrollToCategory(categoryId: string, event: Event): void {
    event.preventDefault();
    this.activeCategoryId.set(categoryId);
    const el = document.getElementById(`cat-${categoryId}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  trackCategory(_: number, cat: FilteredCategory): string {
    return cat.id;
  }

  trackItem(_: number, item: MenuItem): number {
    return item.id;
  }

  scrollCategoryNav(offset: number): void {
  const nav = this.categoryNav?.nativeElement;
  if (nav) {
    nav.scrollBy({ left: offset, behavior: 'smooth' });
  }
}
}
