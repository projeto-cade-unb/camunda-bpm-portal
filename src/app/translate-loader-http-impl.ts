import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

@Injectable({ providedIn: "root" })
export class TranslateLoaderHttpImpl extends TranslateHttpLoader {
  constructor(httpClient: HttpClient) {
    super(
      httpClient,
      "/camunda/app/cockpit/scripts/portal-bpm/demo/assets/locales/",
      ".json"
    );
  }
}
