# HoopsClone Design System Documentation

**Version:** 1.0.0
**Last Updated:** 2025-11-22
**Status:** Phase 2 Complete (Atoms + Molecules)

---

## Table of Contents

1. [Overview](#overview)
2. [Design Tokens](#design-tokens)
3. [Atomic Components](#atomic-components)
4. [Molecule Components](#molecule-components)
5. [Usage Guidelines](#usage-guidelines)
6. [Accessibility](#accessibility)
7. [Future Roadmap](#future-roadmap)

---

## Overview

The HoopsClone design system is built on atomic design principles, providing a comprehensive set of reusable components and design tokens. The system ensures consistency, accessibility, and maintainability across the application.

### Design System Maturity

**Current Status:** Foundation Complete (Phase 1 & 2)
- ✅ Design token system implemented
- ✅ 5 atomic components created
- ✅ 2 molecule components created
- ✅ Accessibility improvements (ARIA labels, keyboard navigation)
- ⏳ Component refactoring in progress

---

## Design Tokens

All design tokens are defined in `frontend/tailwind.config.ts` and follow semantic naming conventions.

### Color System

#### Brand Colors
Primary brand colors for key actions and highlights.

```typescript
brand: {
  primary: "#ea580c",    // orange-600 - Primary actions
  secondary: "#f97316",   // orange-500 - Secondary actions
  dark: "#c2410c",        // orange-700 - Hover states
  light: "#fb923c",       // orange-400 - Subtle highlights
}
```

**Usage:**
- `bg-brand-primary` - Primary buttons, active states
- `text-brand-primary` - Links, brand text
- `hover:bg-brand-dark` - Button hover states

#### Surface Colors
Background and container colors.

```typescript
surface: {
  base: "#ffffff",              // White backgrounds
  elevated: "#f8fafc",          // slate-50 - Cards, elevated elements
  dark: "#0f172a",              // slate-900 - Dark surfaces (navbar, footer)
  darker: "#1e293b",            // slate-800 - Darker elements
  overlay: "rgba(15, 23, 42, 0.9)", // Modal overlays
}
```

**Usage:**
- `bg-surface-base` - Page backgrounds
- `bg-surface-elevated` - Card backgrounds
- `bg-surface-dark` - Navigation bars

#### Text Colors
Typography color hierarchy.

```typescript
text: {
  primary: "#0f172a",     // slate-900 - Primary text
  secondary: "#475569",   // slate-600 - Secondary text
  tertiary: "#64748b",    // slate-500 - Tertiary text
  quaternary: "#94a3b8",  // slate-400 - Placeholder text
  inverse: "#ffffff",     // White text on dark backgrounds
  disabled: "#cbd5e1",    // slate-300 - Disabled text
}
```

**Usage:**
- `text-text-primary` - Headings, body text
- `text-text-secondary` - Captions, labels
- `text-text-inverse` - Text on dark backgrounds

#### Status Colors
Feedback and state indicators.

```typescript
status: {
  error: "#dc2626",           // red-600
  "error-light": "#fee2e2",   // red-100
  success: "#16a34a",         // green-600
  "success-light": "#dcfce7", // green-100
  warning: "#eab308",         // yellow-500
  "warning-light": "#fef9c3", // yellow-100
  info: "#2563eb",            // blue-600
  "info-light": "#dbeafe",    // blue-100
}
```

**Usage:**
- `bg-status-error` - Error badges
- `text-status-success` - Success messages
- `bg-status-warning-light` - Warning backgrounds

### Typography Scale

Semantic typography with predefined sizes and line heights.

```typescript
"display-1": ["3.75rem", { lineHeight: "1.2", fontWeight: "800" }],  // 60px - Hero headings
"display-2": ["3rem", { lineHeight: "1.2", fontWeight: "700" }],     // 48px - Large headings
"heading-1": ["2.25rem", { lineHeight: "1.3", fontWeight: "700" }],  // 36px - Page titles
"heading-2": ["1.875rem", { lineHeight: "1.3", fontWeight: "700" }], // 30px - Section headers
"heading-3": ["1.5rem", { lineHeight: "1.4", fontWeight: "600" }],   // 24px - Subsections
"heading-4": ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],  // 20px - Card titles
"body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],   // 18px - Large body
"body": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],          // 16px - Body text
"body-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],   // 14px - Small text
"caption": ["0.75rem", { lineHeight: "1.4", fontWeight: "400" }],    // 12px - Captions
```

**Usage:**
```tsx
<h1 className="text-heading-1">Page Title</h1>
<p className="text-body">Body text content</p>
<span className="text-caption">Caption text</span>
```

### Spacing System

Semantic spacing tokens for consistent layouts.

```typescript
section: "2rem",       // 32px - Default section spacing
"section-sm": "1.5rem", // 24px - Small section spacing
"section-lg": "4rem",   // 64px - Large section spacing
"section-xl": "6rem",   // 96px - Extra large spacing

card: "1.5rem",        // 24px - Default card padding
"card-sm": "1rem",     // 16px - Small card padding
"card-lg": "2rem",     // 32px - Large card padding

gutter: "1rem",        // 16px - Default margin
"gutter-sm": "0.5rem", // 8px - Small margin
"gutter-lg": "1.5rem", // 24px - Large margin
```

**Usage:**
```tsx
<section className="py-section">
  <div className="p-card">
    <div className="mb-gutter">Content</div>
  </div>
</section>
```

---

## Atomic Components

Foundational design system elements - the smallest building blocks.

### Button

Primary interaction element with multiple variants and states.

**Location:** `frontend/src/components/atoms/Button/`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `"primary"` \| `"secondary"` \| `"ghost"` \| `"danger"` | `"primary"` | Visual style variant |
| size | `"sm"` \| `"md"` \| `"lg"` | `"md"` | Size variant |
| fullWidth | `boolean` | `false` | Full width button |
| isLoading | `boolean` | `false` | Loading state with spinner |
| startIcon | `ReactNode` | - | Icon before text |
| endIcon | `ReactNode` | - | Icon after text |

#### Examples

```tsx
import { Button } from "@/components/atoms";

// Primary button
<Button variant="primary" size="md" onClick={handleClick}>
  Save Changes
</Button>

// Loading state
<Button variant="primary" isLoading>
  Saving...
</Button>

// With icons
<Button variant="secondary" startIcon={<Icon />}>
  Download
</Button>

// Danger button
<Button variant="danger" onClick={handleDelete}>
  Delete
</Button>
```

#### Accessibility
- Full keyboard support (Enter, Space)
- Focus indicators with `focus:ring-2`
- Disabled state with reduced opacity
- ARIA attributes for icons (`aria-hidden="true"`)

---

### Input

Form input field with labels, error states, and icon support.

**Location:** `frontend/src/components/atoms/Input/`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `"default"` \| `"search"` | `"default"` | Input style variant |
| error | `boolean` | `false` | Error state |
| errorMessage | `string` | - | Error message to display |
| helperText | `string` | - | Helper text below input |
| label | `string` | - | Label for the input |
| startIcon | `ReactNode` | - | Icon at start of input |
| endIcon | `ReactNode` | - | Icon at end of input |
| fullWidth | `boolean` | `false` | Full width input |

#### Examples

```tsx
import { Input } from "@/components/atoms";

// Basic input with label
<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
/>

// Error state
<Input
  label="Password"
  type="password"
  error={true}
  errorMessage="Password must be at least 8 characters"
/>

// Search variant with icon
<Input
  variant="search"
  placeholder="Search..."
  startIcon={<SearchIcon />}
/>

// With helper text
<Input
  label="Username"
  helperText="Must be unique"
/>
```

#### Accessibility
- Auto-generated IDs for label association
- `aria-invalid` when error is true
- `aria-describedby` for error/helper text
- Required field indicator (*)
- Full keyboard support

---

### Badge

Status and category indicator.

**Location:** `frontend/src/components/atoms/Badge/`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `"default"` \| `"primary"` \| `"success"` \| `"warning"` \| `"error"` \| `"info"` | `"default"` | Visual style variant |
| size | `"sm"` \| `"md"` \| `"lg"` | `"md"` | Size variant |

#### Examples

```tsx
import { Badge } from "@/components/atoms";

// Status indicators
<Badge variant="success">Active</Badge>
<Badge variant="error">Inactive</Badge>
<Badge variant="warning">Pending</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="lg">Large</Badge>

// Team abbreviation
<Badge variant="default">BOS</Badge>
```

---

### Spinner

Loading indicator with multiple sizes and colors.

**Location:** `frontend/src/components/atoms/Spinner/`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | `"sm"` \| `"md"` \| `"lg"` \| `"xl"` | `"md"` | Spinner size |
| variant | `"primary"` \| `"inverse"` \| `"current"` | `"primary"` | Color variant |
| label | `string` | `"Loading..."` | Screen reader label |

#### Examples

```tsx
import { Spinner } from "@/components/atoms";

// Loading state
<Spinner size="md" variant="primary" label="Loading players..." />

// Inline with text
<div>
  <Spinner size="sm" variant="current" /> Loading...
</div>

// Full page loading
<div className="flex justify-center items-center min-h-screen">
  <Spinner size="xl" variant="primary" />
</div>
```

#### Accessibility
- `role="status"` for screen readers
- Custom `aria-label` prop
- Hidden visual indicator with `aria-hidden="true"`
- `.sr-only` text for screen readers

---

### Card

Container component for content grouping.

**Location:** `frontend/src/components/atoms/Card/`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `"default"` \| `"bordered"` \| `"elevated"` | `"default"` | Visual style variant |
| padding | `"none"` \| `"sm"` \| `"md"` \| `"lg"` | `"md"` | Padding size |
| rounded | `"sm"` \| `"md"` \| `"lg"` \| `"xl"` | `"lg"` | Border radius |
| hover | `boolean` | `false` | Enable hover effect |
| interactive | `boolean` | `false` | Make card interactive |
| onClick | `() => void` | - | Click handler |

#### Examples

```tsx
import { Card } from "@/components/atoms";

// Basic card
<Card variant="bordered" padding="md">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>

// Interactive card with hover
<Card variant="elevated" hover interactive onClick={handleClick}>
  Clickable card
</Card>

// No padding
<Card padding="none">
  <img src="..." alt="..." />
  <div className="p-4">Content</div>
</Card>
```

#### Accessibility
- Converts to `<button>` when `onClick` is provided
- Focus indicators with `focus:ring-2`
- Keyboard support (Enter, Space) for interactive cards

---

## Molecule Components

Composite elements built from atomic components.

### SearchBar

Reusable search form combining Input with search functionality.

**Location:** `frontend/src/components/molecules/SearchBar/`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| placeholder | `string` | `"Search..."` | Placeholder text |
| initialValue | `string` | `""` | Initial search value |
| searchPath | `string` | `"/players"` | Search endpoint path |
| variant | `"default"` \| `"search"` | `"search"` | Input variant |
| fullWidth | `boolean` | `false` | Full width search bar |
| onSearch | `(query: string) => void` | - | Custom search callback |

#### Examples

```tsx
import { SearchBar } from "@/components/molecules";

// Basic search bar
<SearchBar
  placeholder="Search players..."
  searchPath="/players"
/>

// Custom search handler
<SearchBar
  placeholder="Search teams..."
  onSearch={(query) => {
    console.log("Searching for:", query);
    // Custom search logic
  }}
/>

// Full width in navbar
<SearchBar
  variant="search"
  fullWidth
  placeholder="Search..."
/>
```

#### Features
- Automatic URL encoding
- Enter key to submit
- Search icon integration
- Router navigation support
- Custom callback option

---

### TeamCard

Team display card combining Card and Badge components.

**Location:** `frontend/src/components/molecules/TeamCard/`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| team | `Team` | *required* | Team data object |
| detailed | `boolean` | `false` | Show detailed view |

**Team Object:**
```typescript
{
  team_id: string;
  nickname: string;
  abbreviation: string;
  city: string;
  full_name?: string;
}
```

#### Examples

```tsx
import { TeamCard } from "@/components/molecules";

// Basic team card
<TeamCard
  team={{
    team_id: "1610612738",
    nickname: "Celtics",
    abbreviation: "BOS",
    city: "Boston"
  }}
/>

// Detailed view
<TeamCard
  team={teamData}
  detailed
/>

// Grid of team cards
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {teams.map((team) => (
    <TeamCard key={team.team_id} team={team} />
  ))}
</div>
```

#### Features
- Hover effects with brand color transition
- Automatic link to team detail page
- Team abbreviation badge
- Avatar placeholder with initials
- Responsive layout

---

## Usage Guidelines

### Importing Components

```tsx
// Import atoms
import { Button, Input, Badge, Spinner, Card } from "@/components/atoms";

// Import molecules
import { SearchBar, TeamCard } from "@/components/molecules";

// Import specific component
import { Button } from "@/components/atoms/Button";
```

### Component Composition

Follow atomic design principles when creating new components:

1. **Atoms** - Use for smallest reusable elements (buttons, inputs, badges)
2. **Molecules** - Combine atoms for simple composite components (search bar, cards)
3. **Organisms** - Build complex components from molecules and atoms (headers, tables)
4. **Templates** - Create page layouts
5. **Pages** - Specific instances of templates with real content

#### Example: Creating a New Molecule

```tsx
// components/molecules/PlayerCard/PlayerCard.tsx
import { Card, Badge } from "@/components/atoms";

interface PlayerCardProps {
  player: Player;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  return (
    <Card variant="bordered" hover>
      <h3 className="text-heading-4">{player.full_name}</h3>
      {player.position && (
        <Badge variant="default" size="sm">{player.position}</Badge>
      )}
    </Card>
  );
};
```

### Design Token Usage

Always use design tokens instead of hardcoded values:

#### ✅ Good
```tsx
<div className="bg-surface-elevated text-text-primary p-card">
  <Button variant="primary">Click Me</Button>
</div>
```

#### ❌ Bad
```tsx
<div className="bg-gray-50 text-gray-900 p-6">
  <button className="bg-orange-600">Click Me</button>
</div>
```

### Responsive Design

Use Tailwind's responsive prefixes:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {/* Content */}
</div>
```

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

---

## Accessibility

### ARIA Attributes

All components include proper ARIA attributes:

- `aria-label` - Descriptive labels for screen readers
- `aria-describedby` - Associate helper/error text
- `aria-invalid` - Mark invalid form fields
- `aria-expanded` - Indicate expanded/collapsed state
- `aria-controls` - Reference controlled elements
- `aria-current` - Mark active navigation links

### Keyboard Navigation

All interactive components support keyboard navigation:

- **Tab** - Move focus between elements
- **Enter/Space** - Activate buttons and links
- **Escape** - Close modals and menus
- **Arrow keys** - Navigate lists and menus (where applicable)

### Focus Management

- Visible focus indicators (`focus:ring-2`)
- Skip-to-content link for keyboard users
- Focus trapping in modals
- Logical tab order

### Screen Reader Support

- Semantic HTML (`nav`, `main`, `footer`)
- `role` attributes where needed
- `.sr-only` for screen reader-only text
- `aria-hidden` for decorative elements

### Color Contrast

All text meets WCAG AA standards:
- Large text (18px+): 3:1 contrast ratio
- Normal text: 4.5:1 contrast ratio
- Interactive elements: Clear visual indicators

---

## Future Roadmap

### Phase 3: Additional Molecules (In Progress)

- [ ] PlayerCard - Player display card
- [ ] StatTable - Statistics table component
- [ ] FormField - Label + Input + Error wrapper
- [ ] EmptyState - No data placeholder
- [ ] LoadingState - Skeleton loader

### Phase 4: Organism Components

- [ ] Header - Extract from Navbar
- [ ] Footer - Extract from Layout
- [ ] TeamRoster - Team roster table
- [ ] PlayerStatsTable - Player statistics table
- [ ] GameSchedule - Games list/calendar

### Phase 5: Enhancement

- [ ] Dark mode full implementation
- [ ] Animation system
- [ ] Micro-interactions
- [ ] Advanced accessibility features
- [ ] Component unit tests
- [ ] Storybook documentation

---

## Contributing

When adding new components:

1. **Follow atomic design** - Place components in the correct category
2. **Use design tokens** - Never hardcode colors, spacing, or typography
3. **Include TypeScript** - Define proper interfaces for all props
4. **Add accessibility** - Include ARIA labels and keyboard support
5. **Write documentation** - Update this file with usage examples
6. **Create examples** - Show common use cases
7. **Follow conventions** - Match existing component structure

---

## Support

For questions about the design system:

1. Check component JSDoc comments in source files
2. Review this documentation
3. Refer to CLAUDE.md for development guidelines
4. See DESIGN_ANALYSIS_REPORT.md for detailed analysis

---

**Last Updated:** 2025-11-22
**Version:** 1.0.0
**Maintained by:** HoopsClone Development Team
