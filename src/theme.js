import { createTheme } from "@mui/material/styles";

/**
 * MUI theme mirroring CSS/tokens.css.
 *
 * Without this, MUI ships its own blue palette and 4px corners into a project
 * whose brand is amber, and every component has to be overridden individually.
 * Values are duplicated here rather than read from CSS variables because MUI
 * needs real colours to compute hover, disabled and contrast states.
 *
 * Ember (not amber) is the "act here" fill: white text on amber-400 (#FE9E0D)
 * is 2.1:1 and fails AA outright. White on ember-600 (#A8480F) is 5.8:1.
 * Amber survives only as a highlight -- chips, the active-nav underline, and
 * price emphasis -- never as a filled button background.
 */
const ember = {
  50: "#fdf0e7",
  100: "#f9d9c4",
  300: "#e8873f",
  500: "#c25a12",
  600: "#a8480f",
  700: "#8a3a0c",
};

const amber = {
  50: "#fff4e3",
  100: "#fde0b4",
  400: "#fe9e0d",
};

const ink = {
  text: "#1a1310",
  secondary: "#4a3f39",
  muted: "#857a72",
  border: "#e5dbcf",
  borderStrong: "#d8c9b8",
  page: "#fbf7f1",
  sunken: "#f3ece3",
};

const theme = createTheme({
  palette: {
    primary: {
      light: ember[300],
      main: ember[600],
      dark: ember[700],
      contrastText: "#ffffff",
    },
    secondary: { main: amber[400], contrastText: ink.text },
    success: { main: "#2f6b2b" },
    error: { main: "#a32d2d" },
    warning: { main: "#8a5303" },
    background: { default: ink.page, paper: "#ffffff" },
    text: { primary: ink.text, secondary: ink.secondary, disabled: ink.muted },
    divider: ink.border,
  },

  shape: { borderRadius: 12 },

  typography: {
    fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", sans-serif',
    h1: { fontFamily: '"Bricolage Grotesque", sans-serif', fontSize: 32, fontWeight: 600, letterSpacing: "-0.01em" },
    h2: { fontFamily: '"Bricolage Grotesque", sans-serif', fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em" },
    h3: { fontFamily: '"Bricolage Grotesque", sans-serif', fontSize: 18, fontWeight: 600 },
    h4: { fontFamily: '"Bricolage Grotesque", sans-serif', fontSize: 16, fontWeight: 600 },
    body1: { fontSize: 15, lineHeight: 1.6 },
    body2: { fontSize: 13, lineHeight: 1.6 },
    button: { fontSize: 14, fontWeight: 600, textTransform: "none" },
    caption: { fontSize: 12, color: ink.muted },
  },

  components: {
    // MUI shouts by default; sentence case reads calmer and matches the copy.
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 20, minHeight: 44 },
        outlined: { borderColor: ink.borderStrong },
        outlinedPrimary: {
          borderColor: ink.borderStrong,
          color: ink.text,
          "&:hover": { background: ink.sunken, borderColor: ink.borderStrong },
        },
        text: {
          "&:hover": { background: ember[50] },
        },
      },
    },
    MuiTextField: { defaultProps: { size: "small" } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 12, background: "#ffffff" },
        notchedOutline: { borderColor: ink.border },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 600, color: ink.muted, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.03em" },
        root: { borderColor: ink.border },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 600 },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: { padding: 8 },
        switchBase: {
          "&.Mui-checked": { color: "#ffffff" },
          "&.Mui-checked + .MuiSwitch-track": { backgroundColor: ember[600], opacity: 1 },
        },
      },
    },
  },
});

export default theme;
