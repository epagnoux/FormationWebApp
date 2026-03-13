# FormationWebApp — Custom AI Agents

This document describes custom agents available for specialized tasks in FormationWebApp development.

## Available Agents

### Explore
**Purpose:** Fast codebase exploration and Q&A

**Use when:**
- You need to understand how a feature works
- You're searching for where a class or component is defined
- You want a thorough but quick analysis of code structure

**Example invocations:**
```
"Use the Explore agent to find all places where the theme toggle is implemented"
"Ask the Explore agent to show how dark mode CSS variables are used"
```

**Input:** Describe what you're looking for + desired thoroughness (quick, medium, thorough)

---

## Skills (Specialized Workflows)

### format-less
**Purpose:** Reorganize and format LESS stylesheets following project conventions

**Use when:**
- Refactoring LESS files for better structure
- Maximizing nesting and applying BEM `&-` syntax  
- Enforcing coding conventions on `.less` files
- Consolidating flat selectors into nested hierarchy

**How it works:**
- Analyzes the LESS file structure
- Groups related selectors using BEM concatenation
- Applies `:host` root convention
- Ensures all variables are properly used

**Example:** `"Format and refactor pages/formations/formations.less using the format-less skill"`

---

## Guidelines for AI Instructions

When asking the AI to do something:

1. **For LESS formatting:** Request the `format-less` skill explicitly
2. **For code exploration:** Use the `Explore` agent for quick discovery
3. **For general tasks:** Just describe what you need—the AI will choose the right tool

Example requests:
- ✅ "Refactor this LESS file using the format-less skill"
- ✅ "Use Explore to find all imports of variables.less"
- ✅ "Update the dark mode colors in styles/variables.less"
- ❌ "Fix this file" (too vague—be specific about what needs fixing)
