export interface CardInfo {
  name: string;
  path: string;
}

export type CardInfoGroup = Record<string, CardInfo>;

export interface CardData {
  name: string;
  description: string;
  firstMessage: string;
}
