export interface CardInfo {
  name: string;
  path: string;
}

export type CardInfoGroup = Record<string, CardInfo>;
