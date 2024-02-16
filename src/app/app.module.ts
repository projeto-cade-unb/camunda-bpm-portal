import { Injector } from "@angular/core";
import { createCustomElement } from "@angular/elements";

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { CardGridComponent } from "./card-grid/card-grid.component";
import { CardComponent } from "./card/card.component";

@NgModule({
  declarations: [CardGridComponent, CardComponent],
  imports: [BrowserModule],
  entryComponents: [CardGridComponent],
})
export class AppModule {
  constructor(private injector: Injector) {
    const el = createCustomElement(CardGridComponent, {
      injector: this.injector,
    });

    customElements.define("custom-card-grid", el);
  }

  ngDoBootstrap() {}
}
