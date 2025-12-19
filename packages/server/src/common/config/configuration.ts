import yaml from 'js-yaml';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const CardConfigYaml = 'card.config.yaml';

export interface CardConfig {
  address: CardAddressConfig;
}

export type CardAddressConfig = {
  root: string;
  card: string;
  cardInfo: string;
};

export default () => {
  const cardConfigTemp = yaml.load(
    readFileSync(join(__dirname, CardConfigYaml), 'utf8'),
  ) as CardConfig;

  return { card: cardConfigTemp };
};
