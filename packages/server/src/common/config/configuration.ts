import yaml from 'js-yaml';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const CardConfigYaml = 'card.config.yaml';
const LinkConfigYaml = 'link.config.yaml';

export interface CardConfig {
  address: CardAddressConfig;
}

export type CardAddressConfig = {
  root: string;
  card: string;
  cardInfo: string;
};

export interface LinkConfig {
  address: LinkAddressConfig;
}

export type LinkAddressConfig = {
  root: string;
  link: string;
  linkInfo: string;
};

export default () => {
  const cardConfigTemp = yaml.load(
    readFileSync(join(__dirname, CardConfigYaml), 'utf8'),
  ) as CardConfig;

  const linkConfigTemp = yaml.load(
    readFileSync(join(__dirname, LinkConfigYaml), 'utf8'),
  ) as LinkConfig;

  return { card: cardConfigTemp, link: linkConfigTemp };
};
