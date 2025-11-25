# Implementation Plan - Basketball Reference Clone Overhaul

## Goal Description
The goal is to bring the current `basketball-dashboard` project up to the standards of [Basketball Reference](https://www.basketball-reference.com/). We aim to "mirror" its functionality, data density, and navigational structure while applying modern "Rich Aesthetics" as per the system instructions. The result should be a premium, responsive, and comprehensive basketball statistics hub.

## User Review Required
> [!IMPORTANT]
> **Design Philosophy**: We are interpreting "mirror" as copying the *structure, data density, and utility* of Basketball Reference, but *not* its dated 1990s visual style. We will use a modern, premium design (Glassmorphism, clean typography, interactive tables) while maintaining the information density that makes BR useful.

## Proposed Changes

### Phase 1: Foundation & Navigation
#### [MODIFY] [Layout](file:///c:/Users/nicki/Documents/Github_Desktop/reference-clone/frontend/src/components/layout/Layout.tsx)
- **Navigation Bar**: Update to match BR's primary categories:
  - Teams, Players, Seasons, Leaders, Scores, Playoffs, Stathead (Search).
  - Implement a prominent **Search Bar** in the header.
- **Footer**: Create a comprehensive footer with sitemap links (About, Data, RSS, etc.).

### Phase 2: The Homepage
#### [MODIFY] [Home Page](file:///c:/Users/nicki/Documents/Github_Desktop/reference-clone/frontend/src/pages/index.tsx)
- **Scoreboard**: Implement a horizontal, date-selectable scoreboard (Yesterday, Today, Tomorrow).
- **Standings**: Enhance tables to include expanded stats (SRS, ORtg, DRtg, Pace) and "Expanded" view.
- **Leaders**: Create a grid of "League Leaders" cards (PTS, TRB, AST, WS, PER) with player headshots.
- **Features**: Add "Today's Standings", "Recent Debuts" (if data exists), and "On This Day" sections.

### Phase 3: Core Entity Pages
#### [NEW] [Player Page](file:///c:/Users/nicki/Documents/Github_Desktop/reference-clone/frontend/src/pages/players/[id].tsx)
- **Header**: Player photo, bio (Height, Weight, Team, Experience), and uniform number.
- **Stats Tables**:
  - Per Game
  - Totals
  - Per 36 Minutes
  - Advanced Stats
  - Playoffs (if applicable)
- **Game Log**: Link to detailed game log.

#### [NEW] [Team Page](file:///c:/Users/nicki/Documents/Github_Desktop/reference-clone/frontend/src/pages/teams/[id].tsx)
- **Header**: Team logo, Record, Conference/Division Rank, SRS, Pace, Off/Def Rtg.
- **Roster**: Sortable roster table with detailed bio info.
- **Team Stats**: Team-level stats and rankings vs league.
- **Schedule**: Recent results and upcoming games.

#### [NEW] [Season Page](file:///c:/Users/nicki/Documents/Github_Desktop/reference-clone/frontend/src/pages/seasons/[id].tsx)
- **Summary**: Champion, MVP, ROY, etc.
- **Standings**: Full league standings.
- **Team Stats**: League-wide team stats table.

### Phase 4: Data Visualization & Polish
#### [NEW] [DataTable Component](file:///c:/Users/nicki/Documents/Github_Desktop/reference-clone/frontend/src/components/ui/DataTable.tsx)
- **Features**:
  - Sortable columns (client-side).
  - Hover effects (row/column highlighting).
  - "Glossary" tooltips on column headers (e.g., explaining "PER").
  - Export to CSV/Excel button.
  - Conditional formatting (heatmap colors for high/low values).

#### [MODIFY] [Global Styles](file:///c:/Users/nicki/Documents/Github_Desktop/reference-clone/frontend/src/styles/globals.css)
- **Typography**: Use modern fonts (Inter/Roboto).
- **Theme**: Implement a cohesive color palette (Premium Dark/Light mode).

## Verification Plan

### Automated Tests
- Run `npm run lint` and `npm run build` to ensure no regressions.
- Verify API endpoints return correct data structures for new pages.

### Manual Verification
- **Browser Comparison**: Side-by-side comparison with `basketball-reference.com`.
- **Navigation**: Click through all new nav items.
- **Search**: Test searching for players and teams.
- **Responsiveness**: Check mobile view for complex tables (horizontal scroll).
