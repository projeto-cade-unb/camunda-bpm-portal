import { Injector } from "@angular/core";
import { createCustomElement } from "@angular/elements";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CardGridComponent } from "./card-grid/card-grid.component";
import { CardComponent } from "./card/card.component";
import { DocumentationComponent } from "./documentation/documentation.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

@NgModule({
  declarations: [
    CardGridComponent,
    CardComponent,
    DocumentationComponent,
    DashboardComponent,
  ],
  imports: [BrowserModule],
  entryComponents: [DocumentationComponent, DashboardComponent],
})
export class AppModule {
  constructor(private injector: Injector) {
    customElements.define(
      "custom-dashboard",
      createCustomElement(DashboardComponent, {
        injector: this.injector,
      })
    );

    customElements.define(
      "custom-documentation",
      createCustomElement(DocumentationComponent, {
        injector: this.injector,
      })
    );
  }

  ngDoBootstrap() {}
}
