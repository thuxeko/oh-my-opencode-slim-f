import { DEFAULT_AGENT_MCPS } from '../config/agent-mcps';
import { RECOMMENDED_SKILLS } from './skills';
import type { InstallConfig } from './types';

// Model mappings by provider - only 4 supported providers
export const MODEL_MAPPINGS = {
  openai: {
    orchestrator: { model: 'openai/gpt-5.4' },
    oracle: { model: 'openai/gpt-5.4', variant: 'high' },
    librarian: { model: 'openai/gpt-5.4-mini', variant: 'low' },
    explorer: { model: 'openai/gpt-5.4-mini', variant: 'low' },
    designer: { model: 'openai/gpt-5.4-mini', variant: 'medium' },
    fixer: { model: 'openai/gpt-5.4-mini', variant: 'low' },
  },
  kimi: {
    orchestrator: { model: 'kimi-for-coding/k2p5' },
    oracle: { model: 'kimi-for-coding/k2p5', variant: 'high' },
    librarian: { model: 'kimi-for-coding/k2p5', variant: 'low' },
    explorer: { model: 'kimi-for-coding/k2p5', variant: 'low' },
    designer: { model: 'kimi-for-coding/k2p5', variant: 'medium' },
    fixer: { model: 'kimi-for-coding/k2p5', variant: 'low' },
  },
  copilot: {
    orchestrator: { model: 'github-copilot/claude-opus-4.6' },
    oracle: { model: 'github-copilot/claude-opus-4.6', variant: 'high' },
    librarian: { model: 'github-copilot/grok-code-fast-1', variant: 'low' },
    explorer: { model: 'github-copilot/grok-code-fast-1', variant: 'low' },
    designer: {
      model: 'github-copilot/gemini-3.1-pro-preview',
      variant: 'medium',
    },
    fixer: { model: 'github-copilot/claude-sonnet-4.6', variant: 'low' },
  },
  'zai-plan': {
    orchestrator: { model: 'zai-coding-plan/glm-5' },
    oracle: { model: 'zai-coding-plan/glm-5', variant: 'high' },
    librarian: { model: 'zai-coding-plan/glm-5', variant: 'low' },
    explorer: { model: 'zai-coding-plan/glm-5', variant: 'low' },
    designer: { model: 'zai-coding-plan/glm-5', variant: 'medium' },
    fixer: { model: 'zai-coding-plan/glm-5', variant: 'low' },
  },
} as const;

export function generateLiteConfig(
  installConfig: InstallConfig,
): Record<string, unknown> {
  const config: Record<string, unknown> = {
    presets: {},
  };

  const createAgentConfig = (
    agentName: string,
    modelInfo: { model: string; variant?: string },
  ) => {
    const isOrchestrator = agentName === 'orchestrator';

    const skills = isOrchestrator
      ? ['*']
      : RECOMMENDED_SKILLS.filter(
          (s) =>
            s.allowedAgents.includes('*') ||
            s.allowedAgents.includes(agentName),
        ).map((s) => s.skillName);

    if (agentName === 'designer' && !skills.includes('agent-browser')) {
      skills.push('agent-browser');
    }

    return {
      model: modelInfo.model,
      variant: modelInfo.variant,
      skills,
      mcps:
        DEFAULT_AGENT_MCPS[agentName as keyof typeof DEFAULT_AGENT_MCPS] ?? [],
    };
  };

  const buildPreset = (mappingName: keyof typeof MODEL_MAPPINGS) => {
    const mapping = MODEL_MAPPINGS[mappingName];
    return Object.fromEntries(
      Object.entries(mapping).map(([agentName, modelInfo]) => [
        agentName,
        createAgentConfig(agentName, modelInfo),
      ]),
    );
  };

  // If --default-model was provided, set default.model and create clean preset
  if (installConfig.defaultModel) {
    const defaultModel = installConfig.defaultModel;
    const presetName = 'default';
    config.preset = presetName;
    
    // Set default.model - all agents will inherit this
    config.default = {
      model: defaultModel,
    };
    
    // Create preset with agents but without explicit models (they'll use default.model)
    const agentNames = ['orchestrator', 'oracle', 'librarian', 'explorer', 'designer', 'fixer'];
    const presetConfig: Record<string, unknown> = {};
    
    for (const agentName of agentNames) {
      const isOrchestrator = agentName === 'orchestrator';
      const skills = isOrchestrator
        ? ['*']
        : RECOMMENDED_SKILLS.filter(
            (s) =>
              s.allowedAgents.includes('*') ||
              s.allowedAgents.includes(agentName),
          ).map((s) => s.skillName);
      
      if (agentName === 'designer' && !skills.includes('agent-browser')) {
        skills.push('agent-browser');
      }
      
      presetConfig[agentName] = {
        // No model field - will use default.model
        variant: agentName === 'oracle' ? 'high' : 
                agentName === 'designer' ? 'medium' : 'low',
        skills,
        mcps: DEFAULT_AGENT_MCPS[agentName as keyof typeof DEFAULT_AGENT_MCPS] ?? [],
      };
    }
    
    (config.presets as Record<string, unknown>)[presetName] = presetConfig;
    
    // Generate fallback config with empty chains (users can fill in later)
    config.fallback = {
      enabled: false,
      chains: {
        orchestrator: [],
        oracle: [],
        librarian: [],
        explorer: [],
        designer: [],
        fixer: [],
        council: [],
        'council-master': [],
        councillor: []
      }
    };
    
    // Auto-configure council using default.model
    config.council = {
      master: { model: defaultModel },
      presets: {
        default: {
          councillors: {
            alpha: { model: defaultModel },
            beta: { model: defaultModel },
            gamma: { model: defaultModel }
          },
          master: undefined
        }
      },
      default_preset: 'default',
      master_timeout: 300000,
      councillors_timeout: 180000,
      master_fallback: [],
      councillor_execution_mode: 'parallel',
      councillor_retries: 3
    };
  } else {
    // No --default-model, use OpenAI as default with explicit models
    config.preset = 'openai';
    (config.presets as Record<string, unknown>).openai = buildPreset('openai');
    
    // Also generate fallback and council for OpenAI users
    config.fallback = {
      enabled: false,
      chains: {
        orchestrator: [],
        oracle: [],
        librarian: [],
        explorer: [],
        designer: [],
        fixer: [],
        council: [],
        'council-master': [],
        councillor: []
      }
    };
    
    // Council with OpenAI models
    config.council = {
      master: { model: 'openai/gpt-5.4' },
      presets: {
        default: {
          councillors: {
            alpha: { model: 'openai/gpt-5.4-mini' },
            beta: { model: 'openai/gpt-5.4-mini' },
            gamma: { model: 'openai/gpt-5.4-mini' }
          },
          master: undefined
        }
      },
      default_preset: 'default',
      master_timeout: 300000,
      councillors_timeout: 180000,
      master_fallback: [],
      councillor_execution_mode: 'parallel',
      councillor_retries: 3
    };
  }

  if (installConfig.hasTmux) {
    config.tmux = {
      enabled: true,
      layout: 'main-vertical',
      main_pane_size: 60,
    };
  }

  return config;
}
