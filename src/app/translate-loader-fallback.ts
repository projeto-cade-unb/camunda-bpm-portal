import { Injectable } from "@angular/core";
import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
} from "@ngx-translate/core";

@Injectable({ providedIn: "root" })
export class TranslateLoaderFallback implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    params.translateService.setDefaultLang("en");
  }
}
