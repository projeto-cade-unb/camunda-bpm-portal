import { Injectable } from '@angular/core';
import { from, fromEvent, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  hashChange = from(
    location.pathname.includes('static/app')
      ? fromEvent(window, 'hashchange')
      : of(null)
  );
}
