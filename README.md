# ascii-lib

ASCII-first React components rendered with box-drawing characters.

Live demo: [react-ascii.vercel.app](https://react-ascii.vercel.app/)

![Demo Dashboard Gif](readme-gif-demo-dashboard.gif)

## Install

```bash
npm install ascii-lib
```

`react` and `react-dom` are peer dependencies.

## Quick Start

```tsx
import {
  AsciiButton,
  AsciiCard,
  AsciiLogViewer,
  AsciiPopover,
} from "ascii-lib";

export function Example() {
  return (
    <AsciiCard
      title="Release Train"
      footer={<AsciiButton label="Ship" border="single" />}
      width={48}
    >
      <AsciiLogViewer
        title="Live Logs"
        height={4}
        width={40}
        lines={[
          { timestamp: "12:01", level: "info", source: "deploy", message: "starting rollout" },
          { timestamp: "12:02", level: "success", source: "deploy", message: "batch-01 healthy" },
        ]}
      />
      <AsciiPopover asChild content={"traffic: 25%\nstatus: healthy"}>
        <AsciiButton label="Inspect" border="double" />
      </AsciiPopover>
    </AsciiCard>
  );
}
```

## Highlights

- 77 exported components
- zero runtime dependencies beyond React
- built-in ASCII borders, charts, overlays, tables, navigation, and app-shell primitives
- accessible focus handling for modal-style overlays
- `asChild` trigger composition for popover, dropdown, tooltip, and hover card
- grouped command palettes, selectable data tables, and split-pane workbenches
- richer surface components that now accept real `ReactNode` content

## Notable Components

- `AsciiWindow` for terminal-window style shells
- `AsciiSplitPane` for resizable operator workbenches
- `AsciiLogViewer` for live logs and event streams
- `AsciiDiff` for change previews and config review
- `AsciiFileTree` for repository and deployment trees
- `AsciiProcessTable` for runtime and host monitoring

## Composition

Popover, dropdown menu, tooltip, and hover card support `asChild`, which lets you attach behavior to an existing button, badge, or custom trigger instead of wrapping it in another interactive element.

`AsciiCard`, `AsciiModal`, `AsciiDrawer`, `AsciiSheet`, and `AsciiAspectRatio` now accept regular React content instead of plain strings, which makes them much more useful as real layout primitives.

## Development

Library:

```bash
npm run typecheck
npm run build
```

Demo:

```bash
cd demo
npm run dev
```
