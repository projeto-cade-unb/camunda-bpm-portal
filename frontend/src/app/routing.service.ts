import { Injectable } from '@angular/core';
import { from, fromEvent, map, of, startWith } from 'rxjs';
import { isStaticApp } from './static-app';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  url$ = from(isStaticApp ? fromEvent(window, 'hashchange') : of(null)).pipe(
    startWith(null),
    map(
      () =>
        new URL(
          `${location.protocol}${location.host}/${location.hash.slice(2)}`
        )
    )
  );
}
