import yaml from 'js-yaml';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const CardConfigYaml = 'card.config.yaml';

export default () => {
  return yaml.load(readFileSync(join(__dirname, CardConfigYaml), 'utf8')) as Record<string, any>;
};
