# Installation Guide

Complete installation instructions for oh-my-opencode-slim-f.

## Table of Contents

- [For Humans](#for-humans)
- [For LLM Agents](#for-llm-agents)
- [Troubleshooting](#troubleshooting)
- [Uninstallation](#uninstallation)

---

## For Humans

### Prerequisites

- [Bun](https://bun.sh) installed
- [OpenCode](https://opencode.ai) installed

### Quick Install

```bash
# 1. Clone the repo
git clone https://github.com/thuxeko/oh-my-opencode-slim-f.git
cd oh-my-opencode-slim-f

# 2. Build (required before first run)
bun install
bun run build

# 3. Run installer
bunx . install --default-model=YOUR_PROVIDER/YOUR_MODEL
```

**Examples:**
```bash
# With default OpenAI models
bunx . install

# With your custom provider model
bunx . install --default-model=anti/MiniMax-M2.5

# Non-interactive mode with tmux and skills
bunx . install --no-tui --tmux=yes --skills=yes

# Force overwrite existing configuration
bunx . install --reset
```

### Configuration Options

| Option | Description |
|--------|-------------|
| `--tmux=yes\|no` | Enable tmux integration (yes/no) |
| `--skills=yes\|no` | Install recommended skills (yes/no) |
| `--default-model=<id>` | Set default model for all agents (e.g. anti/MiniMax-M2.5) |
| `--no-tui` | Non-interactive mode |
| `--dry-run` | Simulate install without writing files |
| `--reset` | Force overwrite of existing configuration |

### Non-Destructive Behavior

By default, the installer is non-destructive. If an `oh-my-opencode-slim.json` configuration file already exists, the installer will **not** overwrite it. Instead, it will display a message:

```
ℹ Configuration already exists at ~/.config/opencode/oh-my-opencode-slim.json. Use --reset to overwrite.
```

To force overwrite of your existing configuration, use the `--reset` flag:

```bash
bunx . install --reset
```

**Note:** When using `--reset`, the installer creates a `.bak` backup file before overwriting, so your previous configuration is preserved.

### After Installation

Authenticate with your provider:

```bash
opencode auth login
# Select your provider → Complete OAuth flow
```

Once authenticated, run OpenCode and `ping all agents` to verify all agents respond.

> **💡 Tip: Models are fully customizable.** The installer sets sensible defaults, but you can assign *any* model to *any* agent. Edit `~/.config/opencode/oh-my-opencode-slim.json` (or `.jsonc` for comments support) to override models, adjust reasoning effort, or disable agents entirely.

### Alternative: Ask Any Coding Agent

Paste this into Claude Code, AmpCode, Cursor, or any coding agent:

```
Install and configure by following the instructions here:
https://raw.githubusercontent.com/thuxeko/oh-my-opencode-slim-f/master/README.md
```

---

## For LLM Agents

If you're an LLM Agent helping set up oh-my-opencode-slim-f, follow these steps.

### Step 1: Check OpenCode Installation

```bash
opencode --version
```

If not installed, direct the user to https://opencode.ai/docs first.

### Step 2: Clone and Build

The plugin needs to be built before running. Guide the user to:

```bash
# Clone the repo
git clone https://github.com/thuxeko/oh-my-opencode-slim-f.git
cd oh-my-opencode-slim-f

# Build
bun install
bun run build
```

### Step 3: Run the Installer

```bash
bunx . install --default-model=USER_PROVIDER/USER_MODEL --no-tui --tmux=no --skills=yes
```

**Examples:**
```bash
# Interactive install
bunx . install

# With custom provider model
bunx . install --default-model=anti/MiniMax-M2.5 --no-tui

# Non-interactive with tmux and skills
bunx . install --no-tui --tmux=yes --skills=yes

# Non-interactive without tmux or skills
bunx . install --no-tui --tmux=no --skills=no

# Force overwrite existing configuration
bunx . install --reset
```

The installer automatically:
- Adds the plugin to `~/.config/opencode/opencode.json`
- Disables default OpenCode agents
- Generates agent model mappings in `~/.config/opencode/oh-my-opencode-slim.json` (or `.jsonc`)

### Step 4: Authenticate with Providers

Ask user to run the following command. Don't run it yourself, it requires user interaction.

```bash
opencode auth login
# Select your provider and complete OAuth flow
```

### Step 5: Verify Installation

Ask the user to:

1. Start OpenCode: `opencode`
2. Run: `ping all agents`

Verify all agents respond successfully.

**Crucial Advice for the User:**
- They can easily assign **different models to different agents** by editing `~/.config/opencode/oh-my-opencode-slim.json` (or `.jsonc`).
- If they want to add a different provider later (Kimi, GitHub Copilot, ZAI), they can update this file manually. See **[Provider Configurations](provider-configurations.md)** for examples.
- Read the generated `~/.config/opencode/oh-my-opencode-slim.json` (or `.jsonc`) file to understand the current configuration.

---

## Troubleshooting

### Installer Fails

Check the expected config format:
```bash
bunx . install --help
```

Then manually create the config files at:
- `~/.config/opencode/oh-my-opencode-slim.json` (or `.jsonc`)

### Configuration Already Exists

If the installer reports that the configuration already exists, you have two options:

1. **Keep existing config**: The installer will skip the configuration step and continue with other operations (like adding the plugin or installing skills).

2. **Reset configuration**: Use `--reset` to overwrite:
   ```bash
   bunx . install --reset
   ```
   A `.bak` backup file will be created automatically.

### Agents Not Responding

1. Check your authentication:
   ```bash
   opencode auth status
   ```

2. Verify your config file exists and is valid:
   ```bash
   cat ~/.config/opencode/oh-my-opencode-slim.json
   ```

3. Check that your provider is configured in `~/.config/opencode/opencode.json`

### Authentication Issues

If providers are not working:

1. Check your authentication status:
   ```bash
   opencode auth status
   ```

2. Re-authenticate if needed:
   ```bash
   opencode auth login
   ```

3. Verify your config file has the correct provider configuration:
   ```bash
   cat ~/.config/opencode/oh-my-opencode-slim.json
   ```

### Editor Validation

Add a `$schema` reference to your config for autocomplete and inline validation:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/thuxeko/oh-my-opencode-slim-f/master/oh-my-opencode-slim.schema.json",
  // your config...
}
```

Works in VS Code, Neovim (with `jsonls`), and any editor that supports JSON Schema. Catches typos and wrong nesting immediately.

### Tmux Integration Not Working

Make sure you're running OpenCode with the `--port` flag and the port matches your `OPENCODE_PORT` environment variable:

```bash
tmux
export OPENCODE_PORT=4096
opencode --port 4096
```

See the [Multiplexer Integration Guide](multiplexer-integration.md) for more details.

---

## Uninstallation

1. **Remove the plugin from your OpenCode config**:

   Edit `~/.config/opencode/opencode.json` and remove `"oh-my-opencode-slim"` from the `plugin` array.

2. **Remove configuration files (optional)**:
   ```bash
   rm -f ~/.config/opencode/oh-my-opencode-slim.json
   rm -f ~/.config/opencode/oh-my-opencode-slim.json.bak
   ```

3. **Remove skills (optional)**:
   ```bash
   npx skills remove simplify
   npx skills remove agent-browser
   ```
