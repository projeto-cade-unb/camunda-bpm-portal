import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class ProcessDocumentationService {
  id = new BehaviorSubject<string>(null);
}
