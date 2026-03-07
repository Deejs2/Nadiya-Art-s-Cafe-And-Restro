import { Injectable, signal, computed } from '@angular/core';
import { Lang } from '../models/menu.model';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly LANG_KEY = 'hk-lang';
  private readonly langSignal = signal<Lang>(this.getStoredLang());

  readonly currentLang = this.langSignal.asReadonly();

  setLang(lang: Lang): void {
    this.langSignal.set(lang);
    localStorage.setItem(this.LANG_KEY, lang);
    document.documentElement.lang = lang;
  }

  private getStoredLang(): Lang {
    const stored = localStorage.getItem(this.LANG_KEY);
    return stored === 'ne' ? 'ne' : 'en';
  }
}
