export interface CardInfo {
  name: string;
}

export type CardInfoGroup = Record<string, CardInfo>;

export interface CardData {
  name: string;
  description: string;
  firstMessage: string;
}
