export interface CardCustomDataDTO {
  name: string;
  description: string;
  first_mes: string;
}

export function mapToCardInfo(customData: CardCustomDataDTO) {
  return {
    name: customData.name,
    description: customData.description,
    firstMessage: customData.first_mes,
  };
}
