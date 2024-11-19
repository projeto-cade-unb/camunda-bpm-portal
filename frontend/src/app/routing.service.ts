import { Injectable } from '@angular/core';
import { from, fromEvent, map, of, startWith } from 'rxjs';
import { isStaticApp } from './static-app';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  get #urlString() {
    return `${location.protocol}${location.host}/${location.hash.slice(2)}`;
  }

  get #url() {
    return new URL(this.#urlString);
  }

  url$ = from(isStaticApp ? fromEvent(window, 'hashchange') : of(null)).pipe(
    startWith(null),
    map(() => this.#url)
  );

  setSearchParams(key: string, value: string) {
    if (!key || value === undefined || value === null) {
      return;
    }

    const url = this.#url;
    url.searchParams.set(key, value);
    location.hash = `#${url.pathname}${url.search}`;
  }

  getSearchParams(key: string) {
    return this.#url.searchParams.get(key);
  }
}
