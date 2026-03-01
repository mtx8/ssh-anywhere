# tmux Complete Reference — From Beginner to Power User
## Sessions, Windows, Panes, Scripting & Advanced Workflows

> **Who this is for:** Anyone using tmux — whether you just installed it or you've been using it for years. Every command is explained, every trick is battle-tested.

> **Prerequisite:** tmux installed (`brew install tmux` on macOS). This guide assumes the **Ctrl+A** prefix from the Anywhere Stack config. Default tmux uses **Ctrl+B** — substitute accordingly.

---

## TABLE OF CONTENTS

1. [Core Concepts — How tmux Works](#1-core-concepts)
2. [Session Management](#2-session-management)
3. [Window Management](#3-window-management)
4. [Pane Management](#4-pane-management)
5. [Copy Mode & Scrollback](#5-copy-mode--scrollback)
6. [Resizing & Layouts](#6-resizing--layouts)
7. [tmux Command Mode](#7-tmux-command-mode)
8. [Configuration (tmux.conf)](#8-configuration-tmuxconf)
9. [Status Bar Customization](#9-status-bar-customization)
10. [Scripting & Automation](#10-scripting--automation)
11. [Hooks & Events](#11-hooks--events)
12. [Plugin System (TPM)](#12-plugin-system-tpm)
13. [Advanced Workflows](#13-advanced-workflows)
14. [Tips & Tricks](#14-tips--tricks)
15. [Troubleshooting](#15-troubleshooting)
16. [Complete Keybinding Reference](#16-complete-keybinding-reference)

---

## 1. CORE CONCEPTS

### The Architecture

```
tmux server (one per user, runs in background)
├── Session: "project-alpha"
│   ├── Window 0: "editor"     ← (tab)
│   │   ├── Pane 0             ← (split)
│   │   └── Pane 1
│   ├── Window 1: "server"
│   │   └── Pane 0
│   └── Window 2: "claude"
│       └── Pane 0
├── Session: "monitoring"
│   └── Window 0: "htop"
│       ├── Pane 0
│       ├── Pane 1
│       └── Pane 2
└── Session: "personal"
    └── Window 0: "scratch"
        └── Pane 0
```

**Key insight:** The tmux **server** is a single background process. All sessions, windows, and panes live inside it. When you "detach," you disconnect your terminal from the server — but the server (and everything running in it) continues.

### The Prefix Key

Every tmux keybinding starts with a **prefix** — a key combo that tells tmux "the next key is a command, not regular typing."

| Config | Prefix | Notes |
|--------|--------|-------|
| Anywhere Stack | **Ctrl+A** | Easier to reach, same as GNU Screen |
| Default tmux | **Ctrl+B** | The out-of-box default |

**How it works:**
1. Press **Ctrl+A** (hold Ctrl, tap A, release both)
2. Then press the action key (e.g., **D** to detach)

These are **two separate actions**, not pressed simultaneously.

> Throughout this guide, `Prefix` means **Ctrl+A** (or whatever your prefix is).

### How tmux Survives Disconnects

```
Your terminal ──connects to──▶ tmux server ──runs──▶ your programs
      │                              │
  You close                     Still running
  your terminal                 in background
      │                              │
      ▼                              ▼
  Connection gone              Programs alive
                                     │
  You reconnect ──────────────▶ Pick up where
                                 you left off
```

This is why tmux is essential for remote work, SSH sessions, and long-running tasks.

---

## 2. SESSION MANAGEMENT

### Creating Sessions

```bash
# Basic session (auto-named 0, 1, 2...)
tmux

# Named session (always name your sessions)
tmux new -s dev

# Named session with first window named
tmux new -s dev -n editor

# Create in background (detached)
tmux new -s background -d

# Create and set starting directory
tmux new -s project -c ~/projects/webapp

# Create with a specific window size
tmux new -s small -x 80 -y 24
```

### Listing Sessions

```bash
# Simple list
tmux ls
# or
tmux list-sessions

# Detailed format
tmux ls -F "#{session_name}: #{session_windows} windows (created #{session_created_string}) #{?session_attached,(attached),}"
```

### Attaching to Sessions

```bash
# Attach to most recent session
tmux attach
tmux a              # shorthand

# Attach to a specific session
tmux attach -t dev
tmux a -t dev       # shorthand

# Attach and detach all other clients (take exclusive control)
tmux attach -t dev -d

# Create-or-attach pattern (idempotent — safe to run repeatedly)
tmux new -A -s dev
```

> **The `-A` flag is underused and brilliant.** `tmux new -A -s dev` attaches to `dev` if it exists, creates it if it doesn't. One command, always works.

### Detaching from Sessions

| Method | How |
|--------|-----|
| Keyboard | `Prefix` then `D` |
| Command inside tmux | `:detach` |
| Detach a different client | `Prefix` then `D` then select client |

### Switching Between Sessions (from inside tmux)

| Action | Keybinding |
|--------|------------|
| List and select session | `Prefix` then `S` |
| Next session | `Prefix` then `)` |
| Previous session | `Prefix` then `(` |
| Last used session | `Prefix` then `L` |

> **Tip:** `Prefix` then `S` opens an interactive tree view where you can see all sessions, their windows, and even preview pane content. Navigate with arrow keys and Enter.

### Renaming Sessions

```bash
# From outside tmux
tmux rename-session -t old-name new-name

# From inside tmux
# Prefix then $
```

### Killing Sessions

```bash
# Kill a specific session
tmux kill-session -t dev

# Kill all sessions EXCEPT the current one
tmux kill-session -a

# Kill all sessions EXCEPT a named one
tmux kill-session -a -t keep-this-one

# Kill the entire tmux server (nuclear option)
tmux kill-server
```

---

## 3. WINDOW MANAGEMENT

Windows are like **tabs** inside a session.

### Creating Windows

| Action | Keybinding |
|--------|------------|
| New window | `Prefix` then `C` |
| New window with name | `:new-window -n name` |
| New window in specific directory | `:new-window -c ~/path` |

### Navigating Windows

| Action | Keybinding |
|--------|------------|
| Next window | `Prefix` then `N` |
| Previous window | `Prefix` then `P` |
| Jump to window 0-9 | `Prefix` then `0`-`9` |
| Last active window | `Prefix` then `L` (if not rebound) |
| Choose from list | `Prefix` then `W` |
| Find window by name | `:find-window pattern` |

### Managing Windows

| Action | Keybinding |
|--------|------------|
| Rename window | `Prefix` then `,` |
| Close window (confirm) | `Prefix` then `&` |
| Move window left | `:swap-window -t -1` |
| Move window right | `:swap-window -t +1` |
| Move window to position 5 | `:move-window -t 5` |

### Reordering Windows

```bash
# Renumber all windows starting from 0 (fills gaps)
:move-window -r

# Swap two specific windows
:swap-window -s 2 -t 4
```

> **Tip:** Add `set -g renumber-windows on` to your tmux.conf so windows auto-renumber when one is closed. No more gaps like 0, 1, 3.

---

## 4. PANE MANAGEMENT

Panes let you see multiple terminals **simultaneously** in one window.

### Creating Panes (Splits)

| Action | Keybinding (Anywhere Stack) | Default |
|--------|----------------------------|---------|
| Vertical split (left/right) | `Prefix` then `\|` | `Prefix` then `%` |
| Horizontal split (top/bottom) | `Prefix` then `-` | `Prefix` then `"` |

```
Vertical split (|):         Horizontal split (-):
┌──────┬──────┐             ┌─────────────┐
│      │      │             │    Top      │
│ Left │Right │             ├─────────────┤
│      │      │             │   Bottom    │
└──────┴──────┘             └─────────────┘
```

### Navigating Panes

| Action | Keybinding (Anywhere Stack) | Default |
|--------|----------------------------|---------|
| Move between panes | `Alt` + Arrow Key | `Prefix` then Arrow Key |
| Next pane | `Prefix` then `O` | Same |
| Previous pane | `Prefix` then `;` | Same |
| Go to pane by number | `Prefix` then `Q` then number | Same |

> `Prefix` then `Q` briefly flashes the pane numbers. Quickly press the number to jump to that pane.

### Managing Panes

| Action | Keybinding |
|--------|------------|
| Close pane (confirm) | `Prefix` then `X` |
| Zoom pane (full screen toggle) | `Prefix` then `Z` |
| Rotate panes | `Prefix` then `Ctrl+O` |
| Swap with next pane | `Prefix` then `}` |
| Swap with previous pane | `Prefix` then `{` |
| Break pane into own window | `Prefix` then `!` |
| Send pane to another window | `:join-pane -t :2` |

> **The zoom trick:** `Prefix` then `Z` makes the current pane fill the entire window. Press it again to restore the layout. The status bar shows `Z` when zoomed. This is incredibly useful for temporarily focusing on one pane without losing your layout.

### Joining and Breaking Panes

```bash
# Break a pane out into its own window
Prefix then !

# Join a pane from window 2 into the current window (vertical split)
:join-pane -s :2

# Join pane 1 from session "other" window 0
:join-pane -s other:0.1

# Join horizontally instead of vertically
:join-pane -s :2 -h
```

### Pane Synchronization

Send the same keystrokes to **all panes** in a window simultaneously:

```bash
# Turn on synchronized input
:setw synchronize-panes on

# Turn it off
:setw synchronize-panes off
```

**Use case:** You have 4 panes, each SSH'd into a different server. Toggle sync on, type `uptime`, and it runs on all four servers at once.

> **Warning:** Don't forget to turn sync off. If you leave it on, every keystroke goes to every pane — including dangerous commands.

---

## 5. COPY MODE & SCROLLBACK

Copy mode lets you scroll through output, search, and copy text.

### Entering and Exiting Copy Mode

| Action | Keybinding |
|--------|------------|
| Enter copy mode | `Prefix` then `[` |
| Exit copy mode | `Q` or `Escape` |

### Navigating in Copy Mode

| Action | Key |
|--------|-----|
| Scroll up | `↑` or `Page Up` or `Ctrl+U` |
| Scroll down | `↓` or `Page Down` or `Ctrl+D` |
| Go to top | `G` (in vi mode) or `g` twice |
| Go to bottom | `G` (in vi mode) |
| Half page up | `Ctrl+U` |
| Half page down | `Ctrl+D` |

### Searching in Copy Mode

| Action | Key |
|--------|-----|
| Search up | `?` then type search term |
| Search down | `/` then type search term |
| Next match | `N` |
| Previous match | `Shift+N` |

> **Tip:** Searching is the fastest way to find something in a long scrollback buffer. Enter copy mode, press `/`, type what you're looking for.

### Selecting and Copying Text (vi mode)

1. Enter copy mode: `Prefix` then `[`
2. Navigate to the start of text you want
3. Press `Space` to start selection
4. Move to the end of the selection
5. Press `Enter` to copy
6. Paste: `Prefix` then `]`

| Action | Key (vi mode) |
|--------|---------------|
| Start selection | `Space` |
| Copy selection | `Enter` |
| Rectangle selection | `V` then `Space` |
| Paste | `Prefix` then `]` |

### Copy to System Clipboard (macOS)

Add to your `~/.tmux.conf`:
```bash
# Use vi keys in copy mode
setw -g mode-keys vi

# 'v' starts selection, 'y' copies to clipboard
bind-key -T copy-mode-vi v send-keys -X begin-selection
bind-key -T copy-mode-vi y send-keys -X copy-pipe-and-cancel "pbcopy"

# Mouse selection copies to clipboard automatically
bind-key -T copy-mode-vi MouseDragEnd1Pane send-keys -X copy-pipe-and-cancel "pbcopy"
```

Now `y` in copy mode sends selected text to macOS clipboard (paste with `Cmd+V` anywhere).

### Scrollback Buffer Size

```bash
# In tmux.conf — increase scrollback (default is 2000 lines)
set -g history-limit 50000
```

> **Tip:** Set this high (50000+). The memory cost is negligible and you'll never lose important output again.

---

## 6. RESIZING & LAYOUTS

### Resizing Panes

| Action | Keybinding |
|--------|------------|
| Resize in direction | `Prefix` then hold Arrow Key |
| Precise resize (5 cells) | `Prefix` then `Alt+Arrow` |

Command mode allows exact control:
```bash
# Resize current pane down by 10 lines
:resize-pane -D 10

# Resize right by 20 columns
:resize-pane -R 20

# Resize up by 5 lines
:resize-pane -U 5

# Resize left by 15 columns
:resize-pane -L 15
```

### Built-in Layouts

tmux has 5 preset layouts. Cycle through them with `Prefix` then `Space`.

```
even-horizontal          even-vertical           main-horizontal
┌────┬────┬────┐        ┌──────────────┐        ┌──────────────┐
│    │    │    │        │              │        │     Main     │
│    │    │    │        ├──────────────┤        ├──────┬───────┤
│    │    │    │        │              │        │      │       │
└────┴────┴────┘        ├──────────────┤        │      │       │
                        │              │        └──────┴───────┘
                        └──────────────┘

main-vertical            tiled
┌──────┬───────┐        ┌──────┬───────┐
│      │       │        │      │       │
│ Main ├───────┤        ├──────┼───────┤
│      │       │        │      │       │
└──────┴───────┘        └──────┴───────┘
```

| Action | Keybinding |
|--------|------------|
| Cycle layouts | `Prefix` then `Space` |
| Even horizontal | `Prefix` then `Alt+1` |
| Even vertical | `Prefix` then `Alt+2` |
| Main horizontal | `Prefix` then `Alt+3` |
| Main vertical | `Prefix` then `Alt+4` |
| Tiled | `Prefix` then `Alt+5` |

---

## 7. TMUX COMMAND MODE

Press `Prefix` then `:` to enter the tmux command prompt. Here you can type any tmux command.

### Essential Commands

```bash
# Get help on any command
:list-keys                    # Show all keybindings
:list-commands                # Show all available commands

# Session commands
:new-session -s name          # Create new session
:switch-client -t name        # Switch to session

# Window commands
:new-window -n name           # New named window
:swap-window -t 3             # Move current window to position 3

# Pane commands
:split-window -h              # Horizontal split (left/right)
:split-window -v              # Vertical split (top/bottom)
:select-pane -t 2             # Switch to pane 2

# Display info
:display-message "#{pane_current_path}"  # Show current path
:show-options -g              # Show all global options
:show-options -w              # Show all window options
```

### Using Format Strings

tmux has a powerful templating system using `#{}`:

```bash
# Display current session, window, and pane info
:display-message "Session: #{session_name} | Window: #{window_index}:#{window_name} | Pane: #{pane_index}"

# Useful format variables
#{session_name}          # Current session name
#{window_index}          # Current window number
#{window_name}           # Current window name
#{pane_current_path}     # Working directory of current pane
#{pane_pid}              # PID of the process in current pane
#{pane_current_command}  # Command running in current pane
#{client_termtype}       # Terminal type
#{host}                  # Hostname
```

---

## 8. CONFIGURATION (tmux.conf)

The config file lives at `~/.tmux.conf`. Changes take effect after reloading.

### Reloading Config

```bash
# From inside tmux
Prefix then R                          # (if you've set this binding)

# Or from command mode
:source-file ~/.tmux.conf

# Or from a shell
tmux source-file ~/.tmux.conf
```

### Recommended Base Configuration

```bash
# ─── Prefix ───────────────────────────────────────────
# Change prefix from Ctrl+B to Ctrl+A
unbind C-b
set -g prefix C-a
bind C-a send-prefix

# ─── General Settings ─────────────────────────────────
set -g default-terminal "tmux-256color"      # 256 color support
set -ga terminal-overrides ",xterm*:Tc"      # True color support
set -g base-index 1                          # Windows start at 1 (not 0)
setw -g pane-base-index 1                    # Panes start at 1
set -g renumber-windows on                   # Auto-renumber when closing windows
set -g history-limit 50000                   # Generous scrollback
set -g mouse on                              # Enable mouse support
set -g set-clipboard on                      # System clipboard integration
set -sg escape-time 0                        # No delay after Escape (crucial for Vim)
set -g focus-events on                       # Pass focus events to programs
set -g display-time 4000                     # Show messages for 4 seconds
set -g status-interval 5                     # Refresh status bar every 5 seconds

# ─── Vi Mode ──────────────────────────────────────────
setw -g mode-keys vi                         # Vi keys in copy mode
set -g status-keys vi                        # Vi keys in command mode

# ─── Splitting ────────────────────────────────────────
bind | split-window -h -c "#{pane_current_path}"
bind - split-window -v -c "#{pane_current_path}"
unbind '"'
unbind %

# ─── Pane Navigation ─────────────────────────────────
bind -n M-Left select-pane -L               # Alt+Arrow to switch panes
bind -n M-Right select-pane -R
bind -n M-Up select-pane -U
bind -n M-Down select-pane -D

# ─── Pane Resizing ────────────────────────────────────
bind -r H resize-pane -L 5                  # Prefix+H/J/K/L to resize
bind -r J resize-pane -D 5
bind -r K resize-pane -U 5
bind -r L resize-pane -R 5

# ─── Window Navigation ───────────────────────────────
bind -n M-1 select-window -t 1              # Alt+Number to switch windows
bind -n M-2 select-window -t 2
bind -n M-3 select-window -t 3
bind -n M-4 select-window -t 4
bind -n M-5 select-window -t 5

# ─── Copy Mode ────────────────────────────────────────
bind-key -T copy-mode-vi v send-keys -X begin-selection
bind-key -T copy-mode-vi y send-keys -X copy-pipe-and-cancel "pbcopy"
bind-key -T copy-mode-vi MouseDragEnd1Pane send-keys -X copy-pipe-and-cancel "pbcopy"

# ─── Reload Config ────────────────────────────────────
bind R source-file ~/.tmux.conf \; display-message "Config reloaded"

# ─── New Windows/Panes Keep Current Directory ────────
bind c new-window -c "#{pane_current_path}"
```

### Key Config Explanations

| Setting | What It Does | Why It Matters |
|---------|-------------|----------------|
| `escape-time 0` | No delay after pressing Escape | Without this, Vim/Neovim feels sluggish in tmux |
| `base-index 1` | Window numbering starts at 1 | Key `1` is next to prefix, `0` is far away |
| `renumber-windows on` | Auto-fill gaps in window numbers | Close window 2 of 4 → remaining are 1,2,3 (not 1,3,4) |
| `mouse on` | Click panes, scroll, resize with mouse | Works even in SSH from iPad |
| `focus-events on` | Tell programs when pane gains/loses focus | Needed for Vim autoread and gitgutter |
| `set-clipboard on` | OSC 52 clipboard sharing | Copy in tmux → paste anywhere on your machine |

---

## 9. STATUS BAR CUSTOMIZATION

The status bar is the line at the bottom of the screen.

### Structure

```
┌────────────────────────────────────────────────────────┐
│  LEFT        CENTER (window list)             RIGHT    │
│  [session]   1:editor  2:server* 3:claude     12:30 PM │
└────────────────────────────────────────────────────────┘
```

### Basic Customization

```bash
# ─── Colors ───────────────────────────────────────────
set -g status-style "bg=#1e1e2e,fg=#cdd6f4"

# ─── Left Side ────────────────────────────────────────
set -g status-left-length 40
set -g status-left "#[fg=#1e1e2e,bg=#89b4fa,bold] #S #[default] "

# ─── Right Side ───────────────────────────────────────
set -g status-right-length 80
set -g status-right "#[fg=#a6adc8] %H:%M  %b %d #[fg=#1e1e2e,bg=#a6e3a1,bold] #H "

# ─── Window Tabs ──────────────────────────────────────
set -g window-status-format " #I:#W "
set -g window-status-current-format "#[fg=#1e1e2e,bg=#cba6f7,bold] #I:#W "

# ─── Position ─────────────────────────────────────────
set -g status-position top              # Status bar at top (modern look)
set -g status-justify centre            # Center the window list
```

### Useful Status Bar Variables

| Variable | Shows |
|----------|-------|
| `#S` | Session name |
| `#I` | Window index |
| `#W` | Window name |
| `#P` | Pane index |
| `#H` | Hostname |
| `#h` | Short hostname |
| `%H:%M` | Time (24h) |
| `%I:%M %p` | Time (12h with AM/PM) |
| `%b %d` | Date (e.g., Jan 15) |
| `#{pane_current_path}` | Current directory |
| `#{pane_current_command}` | Running command |

---

## 10. SCRIPTING & AUTOMATION

### send-keys — Remote Control tmux

Send keystrokes to a session without being attached:

```bash
# Type a command and press Enter
tmux send-keys -t my-session "npm run dev" Enter

# Send to a specific window
tmux send-keys -t my-session:2 "tail -f logs/app.log" Enter

# Send to a specific pane
tmux send-keys -t my-session:1.2 "htop" Enter

# Send Ctrl+C to stop a process
tmux send-keys -t my-session C-c
```

### Full Dev Environment Setup Script

```bash
#!/bin/bash
# setup-dev.sh — One command to create a complete workspace

SESSION="dev"

# Kill existing session if it exists
tmux kill-session -t $SESSION 2>/dev/null

# Create session with first window named "editor"
tmux new-session -d -s $SESSION -n editor -c ~/projects/webapp

# Window 1: Editor
tmux send-keys -t $SESSION:1 "nvim ." Enter

# Window 2: Dev server
tmux new-window -t $SESSION -n server -c ~/projects/webapp
tmux send-keys -t $SESSION:2 "npm run dev" Enter

# Window 3: Claude Code
tmux new-window -t $SESSION -n claude -c ~/projects/webapp
tmux send-keys -t $SESSION:3 "claude" Enter

# Window 4: Git / misc
tmux new-window -t $SESSION -n git -c ~/projects/webapp
tmux send-keys -t $SESSION:4 "git status" Enter

# Window 5: Logs (split into two panes)
tmux new-window -t $SESSION -n logs -c ~/projects/webapp
tmux send-keys -t $SESSION:5 "tail -f logs/app.log" Enter
tmux split-window -h -t $SESSION:5 -c ~/projects/webapp
tmux send-keys -t $SESSION:5.2 "tail -f logs/error.log" Enter

# Focus on the editor window
tmux select-window -t $SESSION:1

# Attach
tmux attach -t $SESSION
```

Make it executable:
```bash
chmod +x setup-dev.sh
```

### Multi-Agent Setup Script

```bash
#!/bin/bash
# launch-agents.sh — Start multiple Claude Code agents in parallel

PROJECT_DIR=~/projects/webapp

# Agent 1: Frontend work
tmux new-session -d -s agents -n frontend -c $PROJECT_DIR
tmux send-keys -t agents:1 "claude --prompt 'Work on the React frontend components'" Enter

# Agent 2: Backend work
tmux new-window -t agents -n backend -c $PROJECT_DIR
tmux send-keys -t agents:2 "claude --prompt 'Work on the API routes'" Enter

# Agent 3: Testing
tmux new-window -t agents -n testing -c $PROJECT_DIR
tmux send-keys -t agents:3 "claude --prompt 'Write and run tests'" Enter

# Dashboard window — see all three at once
tmux new-window -t agents -n dashboard
tmux send-keys -t agents:4 "watch -n 5 'tmux capture-pane -t agents:1 -p | tail -5'" Enter
tmux split-window -h -t agents:4
tmux send-keys -t agents:4.2 "watch -n 5 'tmux capture-pane -t agents:2 -p | tail -5'" Enter
tmux split-window -v -t agents:4.1
tmux send-keys -t agents:4.3 "watch -n 5 'tmux capture-pane -t agents:3 -p | tail -5'" Enter

tmux select-window -t agents:4
tmux attach -t agents
```

### capture-pane — Grab Pane Content Programmatically

```bash
# Capture visible content of a pane
tmux capture-pane -t my-session:1 -p

# Capture and save to a file
tmux capture-pane -t my-session:1 -p > ~/output.txt

# Capture the full scrollback (not just visible area)
tmux capture-pane -t my-session:1 -p -S -

# Capture a range of lines (last 100)
tmux capture-pane -t my-session:1 -p -S -100
```

> **Power use:** Combine with `grep` to check if a process has finished:
> ```bash
> tmux capture-pane -t dev:2 -p | grep -q "compiled successfully" && echo "Build done!"
> ```

---

## 11. HOOKS & EVENTS

tmux can run commands automatically when certain events occur.

```bash
# Run a command when a new session is created
set-hook -g session-created 'display-message "Welcome to #{session_name}"'

# Auto-rename window to the running command
set-hook -g window-renamed 'if-shell "[ #{window_name} = bash ]" "set automatic-rename on"'

# Log when a pane exits
set-hook -g pane-exited 'run-shell "echo Pane exited at $(date) >> ~/tmux-log.txt"'

# Alert when a command finishes in a background window
setw -g monitor-activity on
set -g visual-activity on
```

### Useful Hook Events

| Event | When It Fires |
|-------|---------------|
| `session-created` | New session is made |
| `session-closed` | Session is destroyed |
| `window-linked` | Window added to session |
| `window-renamed` | Window name changes |
| `pane-exited` | Process in pane exits |
| `client-attached` | Someone attaches |
| `client-detached` | Someone detaches |

---

## 12. PLUGIN SYSTEM (TPM)

TPM (tmux Plugin Manager) lets you install plugins easily.

### Installing TPM

```bash
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
```

Add to your `~/.tmux.conf`:
```bash
# ─── Plugins ──────────────────────────────────────────
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'       # Good defaults
set -g @plugin 'tmux-plugins/tmux-resurrect'       # Save/restore sessions
set -g @plugin 'tmux-plugins/tmux-continuum'       # Auto-save sessions
set -g @plugin 'tmux-plugins/tmux-yank'            # Better clipboard
set -g @plugin 'christoomey/vim-tmux-navigator'    # Seamless vim/tmux pane nav

# ─── Plugin Settings ─────────────────────────────────
set -g @resurrect-capture-pane-contents 'on'
set -g @continuum-restore 'on'                     # Auto-restore on tmux start
set -g @continuum-save-interval '15'               # Save every 15 minutes

# Initialize TPM (keep this line at the very bottom)
run '~/.tmux/plugins/tpm/tpm'
```

### Managing Plugins

| Action | Keybinding |
|--------|------------|
| Install plugins | `Prefix` then `I` (capital i) |
| Update plugins | `Prefix` then `U` |
| Uninstall removed plugins | `Prefix` then `Alt+U` |

### Must-Have Plugins

| Plugin | What It Does |
|--------|-------------|
| **tmux-resurrect** | Save entire tmux environment (sessions, windows, panes, running programs). Restore after reboot with `Prefix+Ctrl+R`. |
| **tmux-continuum** | Auto-saves tmux environment every 15 minutes. Auto-restores when tmux starts. You never lose your setup. |
| **tmux-yank** | Better copy-paste. Works with system clipboard out of the box. |
| **vim-tmux-navigator** | Use `Ctrl+H/J/K/L` to move between vim splits AND tmux panes seamlessly — no prefix needed. |
| **tmux-sensible** | Sane defaults everyone agrees on (larger scrollback, better key repeat, etc.). |

---

## 13. ADVANCED WORKFLOWS

### Workflow: Persistent AI Agent Farm

Set up multiple Claude Code instances that survive reboots (with tmux-resurrect):

```bash
#!/bin/bash
# agent-farm.sh

AGENTS=("frontend" "backend" "devops" "testing")

for agent in "${AGENTS[@]}"; do
  tmux new-session -d -s "agent-$agent" -c ~/projects/main
  tmux send-keys -t "agent-$agent" "claude" Enter
done

echo "Launched ${#AGENTS[@]} agents. Use 'tmux ls' to see them."
echo "Attach: tmux a -t agent-frontend"
```

### Workflow: SSH Jump + tmux (Triple Layer Persistence)

```bash
# From your phone → to your Mac → to a remote server
# Each layer has tmux, so nothing dies on disconnect

# Step 1: Mosh to your Mac
mosh mac1

# Step 2: Attach to Mac's tmux
tmux a -t remote-work

# Step 3: Inside that tmux, SSH to the server
ssh production-server

# Step 4: On the server, attach to SERVER's tmux
tmux a -t deploy

# Now you have: Phone → Mosh → Mac tmux → SSH → Server tmux
# Close your phone — EVERYTHING stays alive at every layer
```

### Workflow: Side-by-Side Comparison

Compare two files or two servers side by side:

```bash
tmux new-session -d -s compare
tmux send-keys -t compare "vim file-v1.txt" Enter
tmux split-window -h -t compare
tmux send-keys -t compare "vim file-v2.txt" Enter
tmux select-layout -t compare even-horizontal
tmux attach -t compare
```

### Workflow: Tailing Multiple Log Files

```bash
#!/bin/bash
# log-dashboard.sh

tmux new-session -d -s logs -n app
tmux send-keys -t logs:1 "tail -f /var/log/app/access.log" Enter

tmux split-window -h -t logs:1
tmux send-keys -t logs:1.2 "tail -f /var/log/app/error.log" Enter

tmux split-window -v -t logs:1.1
tmux send-keys -t logs:1.3 "tail -f /var/log/app/debug.log" Enter

tmux split-window -v -t logs:1.2
tmux send-keys -t logs:1.4 "tail -f /var/log/app/worker.log" Enter

tmux select-layout -t logs:1 tiled
tmux attach -t logs
```

Result:
```
┌─────────────┬─────────────┐
│ access.log  │ error.log   │
├─────────────┼─────────────┤
│ debug.log   │ worker.log  │
└─────────────┴─────────────┘
```

### Workflow: Monitoring + Auto-Alert

```bash
#!/bin/bash
# monitor.sh — Check agent output every 30 seconds

while true; do
  OUTPUT=$(tmux capture-pane -t agent-frontend -p -S -5)

  if echo "$OUTPUT" | grep -qi "error\|failed\|exception"; then
    osascript -e 'display notification "Agent hit an error!" with title "tmux Monitor"'
    # Or send a webhook:
    # curl -X POST "https://hooks.slack.com/..." -d "{\"text\":\"Agent error detected\"}"
  fi

  sleep 30
done
```

---

## 14. TIPS & TRICKS

### Trick 1: Instant Session Switcher

Add to your `~/.tmux.conf`:
```bash
bind-key s choose-tree -Zs
```
Now `Prefix+S` opens a full-screen interactive session/window/pane tree. Navigate with arrows, press Enter to switch.

### Trick 2: Named Panes with Borders

```bash
# Show pane titles in borders
set -g pane-border-status top
set -g pane-border-format " #{pane_index}: #{pane_title} "

# Set a pane title from inside the pane
printf '\033]2;My Pane Title\033\\'

# Or from tmux command mode
:select-pane -T "My Pane Title"
```

### Trick 3: Quick Note-Taking

```bash
# Bind a key to open a scratch popup (tmux 3.2+)
bind-key j display-popup -E "nvim ~/scratch.md"

# Floating terminal popup
bind-key g display-popup -w 80% -h 80% -E "lazygit"
```

> **Popups** (tmux 3.2+) are floating windows that overlay your session. They disappear when you close them. Perfect for quick tasks without disrupting your layout.

### Trick 4: Pipe Pane to a File (Session Recording)

```bash
# Start logging everything in the current pane to a file
:pipe-pane -o 'cat >> ~/tmux-#{session_name}-#{window_index}.log'

# Stop logging
:pipe-pane
```

> Useful for recording an entire Claude Code session for later review.

### Trick 5: Find and Switch to Any Window

```bash
# Bind a key to fuzzy-find windows using fzf
bind-key f run-shell "tmux list-windows -a -F '#{session_name}:#{window_index} #{window_name}' | fzf-tmux | cut -d' ' -f1 | xargs tmux switch-client -t"
```

Requires `fzf` (`brew install fzf`).

### Trick 6: Auto-Start tmux on Shell Open

Add to your `~/.zshrc`:
```bash
# Auto-start tmux (but not in nested tmux or non-interactive shells)
if command -v tmux &> /dev/null && [ -z "$TMUX" ] && [[ $- == *i* ]]; then
  tmux new -A -s main
fi
```

Now every time you open a terminal, you're automatically in tmux.

### Trick 7: Conditional Config (Different Settings for SSH)

```bash
# In tmux.conf — different prefix when nested (SSH into another tmux)
if-shell 'test -n "$SSH_CLIENT"' \
  'set -g prefix C-b; bind C-b send-prefix; set -g status-bg colour88'
```

When you SSH into a remote machine that also has tmux, the inner tmux gets `Ctrl+B` and a red status bar, while your outer tmux keeps `Ctrl+A`. No prefix conflicts.

### Trick 8: Quick Pane Movement

```bash
# Send the current pane to a new window
Prefix then !

# Pull a pane from another window (interactive picker)
bind-key J choose-window "join-pane -s '%%'"
```

### Trick 9: Layout Bookmarks

Save and restore specific layouts:
```bash
# Save current layout
:list-windows -F "#{window_layout}"
# Copy the output string

# Restore a saved layout
:select-layout "the-layout-string-you-copied"
```

### Trick 10: Environment Variables in tmux

```bash
# Update environment on reattach (SSH_AUTH_SOCK, DISPLAY, etc.)
set -g update-environment "SSH_AUTH_SOCK SSH_CONNECTION DISPLAY"

# Force refresh environment in an existing pane
eval $(tmux show-env -s)
```

> This fixes the common problem where SSH agent forwarding breaks after reattaching to tmux. The new SSH_AUTH_SOCK gets picked up.

### Trick 11: Respawn a Dead Pane

When a command in a pane exits (crashes, finishes), the pane shows `[exited]`:
```bash
# Restart the command in the same pane
:respawn-pane -k

# Respawn with a different command
:respawn-pane -k "npm run dev"
```

### Trick 12: Marked Panes (Bookmarks)

```bash
# Mark the current pane (like a bookmark)
Prefix then M

# Jump to the marked pane from anywhere
Prefix then `  (backtick)

# Swap current pane with the marked one
:swap-pane
```

### Trick 13: Link a Window Across Sessions

```bash
# Show the same window in two different sessions (shared, not copied)
:link-window -s dev:2 -t monitor:1
```

Both sessions see the **same** window. Changes in one appear in the other in real time.

### Trick 14: Wait-For (Scripting Synchronization)

```bash
# In script A: Wait for a signal
tmux wait-for signal-name

# In script B: Send the signal (unblocks script A)
tmux wait-for -S signal-name
```

Useful for coordinating between setup scripts — wait until a server is ready before launching the next step.

---

## 15. TROUBLESHOOTING

### Common Issues

| Problem | Cause | Fix |
|---------|-------|-----|
| Colors look wrong | Terminal not set to 256 color | Add `set -g default-terminal "tmux-256color"` to tmux.conf |
| Vim/Neovim lag after Escape | tmux waits to see if Escape is part of a sequence | Add `set -sg escape-time 0` to tmux.conf |
| Mouse scroll doesn't work | Mouse mode off | Add `set -g mouse on` to tmux.conf |
| Can't scroll with trackpad | Mouse mode routing issue | Enter copy mode first: `Prefix` then `[`, then scroll |
| Copy/paste broken | Clipboard not connected | Use `pbcopy`/`pbpaste` bindings (see Section 5) |
| "sessions should be nested" error | Running tmux inside tmux | Use `tmux new -A -s name` from outside, or unset `$TMUX` |
| Prefix key doesn't work | Wrong prefix configured | Check with `tmux show -g prefix` |
| Status bar invisible | Status turned off | `set -g status on` |
| SSH agent broken after reattach | Stale `SSH_AUTH_SOCK` | Add `set -g update-environment "SSH_AUTH_SOCK"` |
| Window names keep changing | Auto-rename is on | `set -g automatic-rename off` if you want manual names |

### Debugging tmux

```bash
# Check which tmux version you have
tmux -V

# Start tmux with verbose logging
tmux -vv new -s debug
# Logs go to ~/tmux-client-*.log and ~/tmux-server-*.log

# List all current option values
tmux show-options -g         # Global options
tmux show-options -w         # Window options
tmux show-options -s         # Server options

# Check all keybindings
tmux list-keys

# Check a specific key
tmux list-keys | grep "bind.*split"

# Show all environment variables tmux knows about
tmux show-environment -g
```

### Recovering From a Frozen Pane

If a pane is frozen or unresponsive:

1. **Switch to another pane:** `Alt+Arrow` or `Prefix` then `O`
2. **Find the stuck process:** `tmux list-panes -t session:window -F "#{pane_pid}"`
3. **Kill it:** `kill -9 <pid>`
4. **Or respawn:** `:respawn-pane -k`

### Nested tmux (tmux inside tmux)

When SSH'd into a remote machine that also runs tmux:

```
Local tmux (Prefix = Ctrl+A)
└── SSH to remote
    └── Remote tmux (Prefix = Ctrl+B)
```

- `Ctrl+A` + command → controls **local** tmux
- `Ctrl+A`, `A` + command → sends prefix to **remote** tmux (when `bind C-a send-prefix` is set)

Or use the config from Trick 7 to auto-detect SSH and change the prefix.

---

## 16. COMPLETE KEYBINDING REFERENCE

### Prefix = Ctrl+A (Anywhere Stack Config)

#### Sessions
| Keybinding | Action |
|------------|--------|
| `Prefix` `D` | Detach from session |
| `Prefix` `S` | List/switch sessions |
| `Prefix` `$` | Rename session |
| `Prefix` `(` | Previous session |
| `Prefix` `)` | Next session |
| `Prefix` `L` | Last session |

#### Windows
| Keybinding | Action |
|------------|--------|
| `Prefix` `C` | New window |
| `Prefix` `N` | Next window |
| `Prefix` `P` | Previous window |
| `Prefix` `0-9` | Go to window by number |
| `Prefix` `W` | Choose window from list |
| `Prefix` `,` | Rename window |
| `Prefix` `&` | Close window (confirm) |
| `Prefix` `.` | Move window to another index |

#### Panes
| Keybinding | Action |
|------------|--------|
| `Prefix` `\|` | Split vertical (left/right) |
| `Prefix` `-` | Split horizontal (top/bottom) |
| `Alt+Arrow` | Switch pane |
| `Prefix` `O` | Next pane |
| `Prefix` `;` | Previous pane |
| `Prefix` `Q` | Show pane numbers (press number to jump) |
| `Prefix` `Z` | Zoom/unzoom pane |
| `Prefix` `X` | Close pane (confirm) |
| `Prefix` `!` | Break pane to window |
| `Prefix` `{` | Swap with previous pane |
| `Prefix` `}` | Swap with next pane |
| `Prefix` `Space` | Cycle layouts |

#### Copy Mode
| Keybinding | Action |
|------------|--------|
| `Prefix` `[` | Enter copy mode |
| `Q` | Exit copy mode |
| `/` | Search forward |
| `?` | Search backward |
| `N` | Next match |
| `Space` | Start selection (vi mode) |
| `Enter` | Copy selection |
| `Prefix` `]` | Paste |

#### Other
| Keybinding | Action |
|------------|--------|
| `Prefix` `:` | Command mode |
| `Prefix` `R` | Reload config |
| `Prefix` `T` | Show clock |
| `Prefix` `?` | List all keybindings |
| `Prefix` `I` | Install plugins (TPM) |
| `Prefix` `U` | Update plugins (TPM) |

---

## QUICK REFERENCE — ONE-LINERS

```bash
# Start or attach to "main" session
tmux new -A -s main

# List all sessions
tmux ls

# Attach to most recent
tmux a

# Kill everything
tmux kill-server

# Send a command to a running session
tmux send-keys -t session-name "command here" Enter

# Capture pane output
tmux capture-pane -t session-name -p

# Capture full scrollback to file
tmux capture-pane -t session-name -p -S - > output.txt

# Check tmux version
tmux -V

# Reload config
tmux source-file ~/.tmux.conf

# Show all keybindings
tmux list-keys

# Show all options
tmux show-options -g
```

---

> **This guide is part of the [SSH Anywhere Stack](https://github.com/mtx8/ssh-anywhere) — a complete system for controlling your Mac from any device, anywhere in the world.**
