import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  hashChange = fromEvent(window, 'hashchange');
}
