import { Injector, NgModule } from "@angular/core";
import { createCustomElement } from "@angular/elements";
import { BrowserModule } from "@angular/platform-browser";
import { CardGridComponent } from "./card-grid/card-grid.component";
import { CardComponent } from "./card/card.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DocumentationComponent } from "./documentation/documentation.component";
import { ViewerComponent } from "./viewer/viewer.component";
import { DiagramDocumentationComponent } from './documentation/diagram-documentation/diagram-documentation.component';

@NgModule({
  declarations: [
    CardGridComponent,
    CardComponent,
    DocumentationComponent,
    DashboardComponent,
    ViewerComponent,
    DiagramDocumentationComponent,
  ],
  imports: [BrowserModule],
  entryComponents: [DocumentationComponent, DashboardComponent],
  providers: [],
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
