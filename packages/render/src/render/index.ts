import type { AstroComponentFactory } from '../internal'

import { createResult, renderToString, AstroElement } from './utils.js';
import { config, validateConfig } from '../config/index.js';

export interface RenderResult {
  html: { code: string };
  css: AstroElement[];
  js: AstroElement[];
}

export async function render(Component: AstroComponentFactory, props: Record<string, any>): Promise<RenderResult> {
  validateConfig(config);
  const result = createResult(config!)
  const template = await renderToString(result, Component, props);
  const styles = Array.from(result.styles).map(({ props, children }: any) => new AstroElement('style', props, children));
  const scripts = Array.from(result.scripts).map(({ props, children }: any) => new AstroElement('script', props, children));
  const html = template.replace('</head>', styles.join('\n') + scripts.join('\n') + '</head>');

  return {
    html: { code: html },
    css: styles,
    js: scripts,
  };
}
