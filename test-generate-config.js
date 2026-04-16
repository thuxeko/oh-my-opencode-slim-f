import { generateLiteConfig } from './src/cli/providers.js';

console.log('Testing config generation with default-model...\n');

// Test 1: With default-model
const config1 = generateLiteConfig({ defaultModel: 'anti/MiniMax-M2.5' });
console.log('=== WITH default-model="anti/MiniMax-M2.5" ===');
console.log('preset:', config1.preset);
console.log('default.model:', config1.default?.model);
console.log('presets keys:', Object.keys(config1.presets || {}));
console.log('First agent in preset:', Object.keys(config1.presets?.default || {})[0]);
const firstAgent = config1.presets?.default?.orchestrator;
console.log('orchestrator model:', firstAgent?.model);
console.log('orchestrator variant:', firstAgent?.variant);
console.log('fallback enabled:', config1.fallback?.enabled);
console.log('council configured:', !!config1.council);
console.log('council master model:', config1.council?.master?.model);
console.log('JSON:', JSON.stringify(config1, null, 2));

console.log('\n\n=== WITHOUT default-model ===');
const config2 = generateLiteConfig({});
console.log('preset:', config2.preset);
console.log('default.model:', config2.default?.model);
console.log('presets keys:', Object.keys(config2.presets || {}));
console.log('First agent in preset:', Object.keys(config2.presets?.openai || {})[0]);
const firstAgent2 = config2.presets?.openai?.orchestrator;
console.log('orchestrator model:', firstAgent2?.model);
console.log('orchestrator variant:', firstAgent2?.variant);
console.log('fallback enabled:', config2.fallback?.enabled);
console.log('council configured:', !!config2.council);
console.log('council master model:', config2.council?.master?.model);