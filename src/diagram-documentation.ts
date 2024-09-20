import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

export class Documentation {
  constructor(
    public id: string,
    public name: string,
    public assignee: string,
    public candidateGroups: string,
    public dueDate: string,
    public documentation: string,
    public extendedDocumentation: string | SafeHtml
  ) {}

  static createDocumentation(
    element: Element,
    domSanitizer: DomSanitizer,
    isFirstChild: boolean = false
  ): Documentation {
    return new Documentation(
      element.getAttribute("id") || "",
      element.getAttribute("name") || "",
      element.getAttribute("camunda:assignee") || "",
      element.getAttribute("camunda:candidateGroups") || "",
      element.getAttribute("camunda:dueDate") || "",
      isFirstChild
        ? (element.tagName === "bpmn:documentation" && element?.textContent) ||
          ""
        : element.querySelector("documentation")?.textContent || "",
      domSanitizer.bypassSecurityTrustHtml(
        element.getAttribute("documentation:extendedDocumentation") || ""
      )
    );
  }
}
