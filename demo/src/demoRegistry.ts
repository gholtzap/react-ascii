export interface DemoComponentEntry {
  name: string;
  category: string;
}

export const demoComponents: DemoComponentEntry[] = [
  { name: "AsciiAccordion", category: "Layout" },
  { name: "AsciiAlert", category: "Feedback" },
  { name: "AsciiAlertDialog", category: "Overlay" },
  { name: "AsciiAsciiText", category: "Typography" },
  { name: "AsciiAspectRatio", category: "Layout" },
  { name: "AsciiAvatar", category: "Data Display" },
  { name: "AsciiBadge", category: "Data Display" },
  { name: "AsciiBarChart", category: "Visualization" },
  { name: "AsciiBox", category: "Layout" },
  { name: "AsciiBreadcrumb", category: "Navigation" },
  { name: "AsciiButton", category: "Form" },
  { name: "AsciiButtonGroup", category: "Form" },
  { name: "AsciiCalendar", category: "Form" },
  { name: "AsciiCard", category: "Layout" },
  { name: "AsciiCarousel", category: "Layout" },
  { name: "AsciiCheckbox", category: "Form" },
  { name: "AsciiCode", category: "Data Display" },
  { name: "AsciiCollapsible", category: "Layout" },
  { name: "AsciiCombobox", category: "Form" },
  { name: "AsciiCommandPalette", category: "Navigation" },
  { name: "AsciiContextMenu", category: "Overlay" },
  { name: "AsciiDataTable", category: "Data Display" },
  { name: "AsciiDatePicker", category: "Form" },
  { name: "AsciiDependencyGraph", category: "Ops" },
  { name: "AsciiDiff", category: "Ops" },
  { name: "AsciiDirection", category: "Layout" },
  { name: "AsciiDivider", category: "Layout" },
  { name: "AsciiDrawer", category: "Overlay" },
  { name: "AsciiDropdownMenu", category: "Overlay" },
  { name: "AsciiEmpty", category: "Feedback" },
  { name: "AsciiField", category: "Form" },
  { name: "AsciiForm", category: "Form" },
  { name: "AsciiFileTree", category: "Ops" },
  { name: "AsciiFlameGraph", category: "Ops" },
  { name: "AsciiGauge", category: "Visualization" },
  { name: "AsciiHeatmap", category: "Visualization" },
  { name: "AsciiHoverCard", category: "Overlay" },
  { name: "AsciiInput", category: "Form" },
  { name: "AsciiInputGroup", category: "Form" },
  { name: "AsciiInputOTP", category: "Form" },
  { name: "AsciiInspector", category: "Ops" },
  { name: "AsciiItem", category: "Data Display" },
  { name: "AsciiKbd", category: "Data Display" },
  { name: "AsciiLabel", category: "Form" },
  { name: "AsciiLogViewer", category: "Ops" },
  { name: "AsciiMatrixRain", category: "Effects" },
  { name: "AsciiMenubar", category: "Navigation" },
  { name: "AsciiModal", category: "Overlay" },
  { name: "AsciiNativeSelect", category: "Form" },
  { name: "AsciiNavigationMenu", category: "Navigation" },
  { name: "AsciiPagination", category: "Navigation" },
  { name: "AsciiPopover", category: "Overlay" },
  { name: "AsciiProcessTable", category: "Ops" },
  { name: "AsciiProgress", category: "Feedback" },
  { name: "AsciiQueryPlan", category: "Ops" },
  { name: "AsciiRackMap", category: "Ops" },
  { name: "AsciiRadio", category: "Form" },
  { name: "AsciiResizable", category: "Layout" },
  { name: "AsciiScanLine", category: "Effects" },
  { name: "AsciiScrollArea", category: "Layout" },
  { name: "AsciiSelect", category: "Form" },
  { name: "AsciiSequenceDiagram", category: "Ops" },
  { name: "AsciiSheet", category: "Overlay" },
  { name: "AsciiSidebar", category: "Navigation" },
  { name: "AsciiSkeleton", category: "Feedback" },
  { name: "AsciiSpinner", category: "Feedback" },
  { name: "AsciiSlider", category: "Form" },
  { name: "AsciiSonner", category: "Feedback" },
  { name: "AsciiSparkline", category: "Visualization" },
  { name: "AsciiSplitPane", category: "Layout" },
  { name: "AsciiStat", category: "Data Display" },
  { name: "AsciiStatusGrid", category: "Ops" },
  { name: "AsciiStepper", category: "Form" },
  { name: "AsciiSwitch", category: "Form" },
  { name: "AsciiTable", category: "Data Display" },
  { name: "AsciiTabs", category: "Layout" },
  { name: "AsciiTag", category: "Data Display" },
  { name: "AsciiTerminal", category: "Ops" },
  { name: "AsciiTextarea", category: "Form" },
  { name: "AsciiTheme", category: "Foundation" },
  { name: "AsciiTimeline", category: "Data Display" },
  { name: "AsciiToast", category: "Feedback" },
  { name: "AsciiToggle", category: "Form" },
  { name: "AsciiToggleGroup", category: "Form" },
  { name: "AsciiTooltip", category: "Overlay" },
  { name: "AsciiTraceTimeline", category: "Ops" },
  { name: "AsciiTree", category: "Data Display" },
  { name: "AsciiTypography", category: "Typography" },
  { name: "AsciiWindow", category: "Layout" },
];

export const demoComponentCount = demoComponents.length;

export function filterDemoComponents(search: string) {
  const query = search.trim().toLowerCase();

  if (!query) {
    return demoComponents;
  }

  return demoComponents.filter(
    (component) =>
      component.name.toLowerCase().includes(query) ||
      component.category.toLowerCase().includes(query)
  );
}

export function getDemoComponentCategories(components: DemoComponentEntry[] = demoComponents) {
  return [...new Set(components.map((component) => component.category))].sort();
}
