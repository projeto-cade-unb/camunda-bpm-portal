import { SafeHtml } from "@angular/platform-browser";

export interface DiagramDocumentation {
  id: string;
  name: string;
  assignee: string;
  candidateGroups: string;
  dueDate: string;
  documentation: string;
  extendedDocumentation: string | SafeHtml;
}
