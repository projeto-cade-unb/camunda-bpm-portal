import { Injectable } from '@angular/core';
import { from, fromEvent, map, Observable, of, startWith } from 'rxjs';
import { isStaticApp } from './static-app';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  #baseUrl = `${location.protocol}${location.host}`;

  url$: Observable<URL> = from(
    isStaticApp ? fromEvent(window, 'hashchange') : of(null)
  ).pipe(
    startWith(null),
    map(() => this.#getCurrentUrl())
  );

  #getCurrentUrl(): URL {
    const path = location.hash.slice(2);
    return new URL(`${this.#baseUrl}/${path}`);
  }

  setSearchParams(key: string, value: string): void {
    const url = this.#getCurrentUrl();
    url.searchParams.set(key, value);
    this.#updateLocationHash(url);
  }

  deleteSearchParams(key: string): void {
    const url = this.#getCurrentUrl();
    url.searchParams.delete(key);
    this.#updateLocationHash(url);
  }

  #updateLocationHash(url: URL): void {
    location.hash = `#${url.pathname}${url.search}`;
  }
}
