export interface AccessibilityContractRow {
  capability: string;
  coverage: string;
  components: string;
  contract: string;
}

export const accessibilityContractRows: AccessibilityContractRow[] = [
  {
    capability: "Focus trapping",
    coverage: "overlay dialogs",
    components: "AsciiModal, AsciiAlertDialog, AsciiCommandPalette",
    contract: "Initial focus moves inside the overlay and Tab stays within the active surface.",
  },
  {
    capability: "Escape behavior",
    coverage: "dismissable surfaces",
    components: "AsciiModal, AsciiPopover, AsciiDropdownMenu, AsciiCommandPalette",
    contract: "Escape closes the active layer and returns control to the trigger when available.",
  },
  {
    capability: "Arrow navigation",
    coverage: "menus and composite widgets",
    components: "AsciiCommandPalette, AsciiDataTable, AsciiTree, AsciiStepper",
    contract: "Arrow keys move the active item without requiring pointer interaction.",
  },
  {
    capability: "Roles",
    coverage: "semantic widgets",
    components: "AsciiTable, AsciiTabs, AsciiTree, AsciiLogViewer",
    contract: "Interactive components expose native elements or ARIA roles that match the visual control.",
  },
  {
    capability: "Labels",
    coverage: "inputs and controls",
    components: "AsciiInput, AsciiTextarea, AsciiSelect, AsciiSwitch",
    contract: "Controls use visible labels, aria labels, or native label associations for accessible names.",
  },
  {
    capability: "Disabled states",
    coverage: "actions and form controls",
    components: "AsciiButton, AsciiStepper, AsciiCheckbox, AsciiRadio",
    contract: "Disabled controls are not actionable and expose disabled semantics to assistive tech.",
  },
  {
    capability: "Reduced motion",
    coverage: "animated components",
    components: "AsciiProgress, AsciiSpinner, AsciiMatrixRain, AsciiScanLine",
    contract: "Animation-sensitive components respect reduced-motion hooks or provide nonessential motion only.",
  },
];

export const accessibilityContractCount = accessibilityContractRows.length;
