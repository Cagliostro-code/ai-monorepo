export interface LinkInfo {
  id: string;
  name: string;
  url: string;
  apiKey: string;
  currentModel: string;
}

export type LinkInfoGroup = Record<string, LinkInfo>;
