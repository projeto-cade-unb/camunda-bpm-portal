import { Component, OnInit } from "@angular/core";

@Component({
  selector: "custom-documentation",
  templateUrl: "./documentation.component.html",
  styleUrls: ["./documentation.component.css"],
})
export class DocumentationComponent implements OnInit {
  id: string;

  ngOnInit(): void {
    const urlSearchParams = new URLSearchParams(window.location.search);

    this.id = urlSearchParams.get("processDefinition");
  }
}
