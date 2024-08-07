export class DiagramXMLParser extends DOMParser {
  constructor() {
    super();
  }

  parseDiagramXmlString(xml: string) {
    return super.parseFromString(xml, "text/xml").querySelector("process");
  }
}
