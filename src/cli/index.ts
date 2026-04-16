#!/usr/bin/env bun
import { install } from './install';
import type { BooleanArg, InstallArgs } from './types';

function parseArgs(args: string[]): InstallArgs {
  const result: InstallArgs = {
    tui: true,
  };

  for (const arg of args) {
    if (arg === '--no-tui') {
      result.tui = false;
    } else if (arg.startsWith('--tmux=')) {
      result.tmux = arg.split('=')[1] as BooleanArg;
    } else if (arg.startsWith('--skills=')) {
      result.skills = arg.split('=')[1] as BooleanArg;
    } else if (arg === '--dry-run') {
      result.dryRun = true;
    } else if (arg === '--reset') {
      result.reset = true;
    } else if (arg.startsWith('--default-model=')) {
      result.defaultModel = arg.split('=')[1];
    } else if (arg === '-h' || arg === '--help') {
      printHelp();
      process.exit(0);
    }
  }

  return result;
}

function printHelp(): void {
  console.log(`
oh-my-opencode-slim-f installer

Usage: bunx oh-my-opencode-slim-f install [OPTIONS]

Options:
  --tmux=yes|no          Enable tmux integration (yes/no)
  --skills=yes|no        Install recommended skills (yes/no)
  --no-tui               Non-interactive mode
  --dry-run              Simulate install without writing files
  --reset                Force overwrite of existing configuration
  --default-model=<id>   Set default model for all agents (e.g. antigravity/MiniMax-M2.5)
  -h, --help             Show this help message

The installer generates an OpenAI configuration by default.
Use --default-model to set a custom provider model for all agents.

Examples:
  bunx oh-my-opencode-slim-f install
  bunx oh-my-opencode-slim-f install --no-tui --tmux=no --skills=yes
  bunx oh-my-opencode-slim-f install --reset
  bunx oh-my-opencode-slim-f install --default-model=antigravity/MiniMax-M2.5
`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === 'install') {
    const hasSubcommand = args[0] === 'install';
    const installArgs = parseArgs(args.slice(hasSubcommand ? 1 : 0));
    const exitCode = await install(installArgs);
    process.exit(exitCode);
  } else if (args[0] === '-h' || args[0] === '--help') {
    printHelp();
    process.exit(0);
  } else {
    console.error(`Unknown command: ${args[0]}`);
    console.error('Run with --help for usage information');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
