export interface ProcessDefinition {
  id: string;
  key: string;
  name: string;
  version: number;
  tenantId: null;
  suspensionState: number;
  instances: number;
  incidents: number;
}
