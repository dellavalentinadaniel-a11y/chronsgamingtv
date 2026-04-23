# Stitch UI Generation Skill

This skill provides guidelines for utilizing the **StitchMCP** for rapid UI design and component generation.

## Capabilities

Stitch allows for:
- `generate_screen_from_text`: Create entire screens from descriptive prompts.
- `edit_screens`: Modify existing UI layouts using text instructions.
- `apply_design_system`: Enforce consistent visual styles across multiple screens.

## Workflow

1. **Ideation**: Describe the desired component or screen in detail.
2. **Generation**: Call `generate_screen_from_text` to create the initial prototype.
3. **Refinement**: Use `edit_screens` to tweak specific elements (colors, spacing, layout).
4. **Consistency**: Use `apply_design_system` to ensure the new UI matches the project's design tokens.

## Prompting Tips for Stitch

- Be specific about layout (e.g., "Left-aligned sidebar with navigation icons").
- Define interactions (e.g., "Cards that scale up on hover").
- Mention the technology (e.g., "Using React and modern CSS").
