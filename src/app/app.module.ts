import { HttpClient, HttpClientModule } from "@angular/common/http";
import { DoBootstrap, Injector, NgModule } from "@angular/core";
import { createCustomElement } from "@angular/elements";
import { BrowserModule } from "@angular/platform-browser";
import {
  MissingTranslationHandler,
  TranslateLoader,
  TranslateModule
} from "@ngx-translate/core";
import { CardGridComponent } from "./card-grid/card-grid.component";
import { CardComponent } from "./card/card.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DiagramDocumentationComponent } from "./documentation/diagram-documentation/diagram-documentation.component";
import { DocumentationComponent } from "./documentation/documentation.component";
import { ProcessDiagramDocumentationComponent } from "./documentation/process-diagram-documentation/process-diagram-documentation.component";
import { TranslateLoaderFallback } from "./translate-loader-fallback";
import { TranslateLoaderHttpImpl } from "./translate-loader-http-impl";
import { ViewerComponent } from "./viewer/viewer.component";

@NgModule({
  declarations: [
    CardGridComponent,
    CardComponent,
    DocumentationComponent,
    DashboardComponent,
    ViewerComponent,
    DiagramDocumentationComponent,
    ProcessDiagramDocumentationComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: TranslateLoaderFallback,
        deps: [HttpClient],
      },
      loader: {
        provide: TranslateLoader,
        useClass: TranslateLoaderHttpImpl,
        deps: [HttpClient],
      },
    }),
  ],
  entryComponents: [DocumentationComponent, DashboardComponent],
  providers: [],
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {
    customElements.define(
      "custom-dashboard",
      customElements.get("custom-dashboard") ||
        createCustomElement(DashboardComponent, {
          injector: this.injector,
        })
    );

    customElements.define(
      "custom-documentation",
      customElements.get("custom-documentation") ||
        createCustomElement(DocumentationComponent, {
          injector: this.injector,
        })
    );
  }

  ngDoBootstrap() {}
}
