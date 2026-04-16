import { generateLiteConfig } from './src/cli/providers';

console.log('Testing config generation...\n');

// Test with default-model
const config1 = generateLiteConfig({ defaultModel: 'anti/MiniMax-M2.5' });
console.log('=== WITH default-model="anti/MiniMax-M2.5" ===');
console.log('preset:', config1.preset);
console.log('default.model:', (config1 as any).default?.model);
console.log('presets keys:', Object.keys((config1 as any).presets || {}));

const preset = (config1 as any).presets?.default;
if (preset) {
  const firstAgentKey = Object.keys(preset)[0];
  console.log('First agent in preset:', firstAgentKey);
  console.log('Agent config:', preset[firstAgentKey]);
}

console.log('\n=== Generated config ===');
console.log(JSON.stringify(config1, null, 2));