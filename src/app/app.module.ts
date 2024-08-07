import { HttpClient, HttpClientModule } from "@angular/common/http";
import { DoBootstrap, Injector, NgModule } from "@angular/core";
import { createCustomElement } from "@angular/elements";
import { BrowserModule } from "@angular/platform-browser";
import {
  MissingTranslationHandler,
  TranslateLoader,
  TranslateModule,
} from "@ngx-translate/core";
import { CardGridComponent } from "./components/card-grid/card-grid.component";
import { CardComponent } from "./components/card/card.component";
import { DocumentationListComponent } from "./pages/documentation-list/documentation-list.component";
import { HomeComponent } from "./pages/home/home.component";
import { ProcessDiagramDocumentationComponent } from "./components/process-diagram-documentation/process-diagram-documentation.component";
import { TranslateLoaderFallback } from "./translate-loader-fallback";
import { TranslateLoaderHttpImpl } from "./translate-loader-http-impl";
import { ViewerComponent } from "./viewer/viewer.component";
import { DocumentationDetailsComponent } from "./pages/documentation-details/documentation-details.component";

@NgModule({
  declarations: [
    CardGridComponent,
    CardComponent,
    HomeComponent,
    DocumentationListComponent,
    ViewerComponent,
    DocumentationDetailsComponent,
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
  entryComponents: [HomeComponent, DocumentationListComponent],
  providers: [],
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {
    customElements.define(
      "custom-dashboard",
      customElements.get("custom-dashboard") ||
        createCustomElement(DocumentationListComponent, {
          injector: this.injector,
        })
    );

    customElements.define(
      "custom-documentation",
      customElements.get("custom-documentation") ||
        createCustomElement(HomeComponent, {
          injector: this.injector,
        })
    );
  }

  ngDoBootstrap() {}
}
