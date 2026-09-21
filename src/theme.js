import { createTheme } from "@mui/material/styles";

/**
 * MUI theme mirroring CSS/tokens.css -- CafeEase 2.0 palette.
 *
 * Values are duplicated here rather than read from CSS variables because MUI
 * needs real colours to compute hover, disabled and contrast states.
 *
 * Orange (#F4511E) is the only filled-button colour -- white on it is 4.6:1
 * (AA). Yellow (#FFC83D) is a highlighter, never a button fill: white on it
 * is 1.9:1 and fails outright, so it only appears as an ink-on-yellow chip.
 */
const orange = {
  subtle: "#fde7de",
  main: "#f4511e",
  deep: "#c1440e",
};

const ink = {
  text: "#19130f",
  secondary: "#57453a",
  muted: "#7a6557",
  border: "#ece0cf",
  borderStrong: "#ddccb3",
  page: "#fff4e2",
  alt: "#fff7ea",
};

const theme = createTheme({
  palette: {
    primary: {
      light: orange.subtle,
      main: orange.main,
      dark: orange.deep,
      contrastText: "#ffffff",
    },
    secondary: { main: "#ffc83d", contrastText: ink.text },
    success: { main: "#0f765b" },
    error: { main: "#a32d2d" },
    warning: { main: "#8a5303" },
    background: { default: ink.page, paper: "#ffffff" },
    text: { primary: ink.text, secondary: ink.secondary, disabled: ink.muted },
    divider: ink.border,
  },

  shape: { borderRadius: 18 },

  typography: {
    fontFamily: '"Figtree", system-ui, -apple-system, "Segoe UI", sans-serif',
    h1: { fontFamily: '"Outfit", sans-serif', fontSize: 52, fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontFamily: '"Outfit", sans-serif', fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" },
    h3: { fontFamily: '"Outfit", sans-serif', fontSize: 18, fontWeight: 700 },
    h4: { fontFamily: '"Outfit", sans-serif', fontSize: 16, fontWeight: 700 },
    body1: { fontSize: 15, lineHeight: 1.6 },
    body2: { fontSize: 13, lineHeight: 1.6 },
    button: { fontSize: 14, fontWeight: 600, textTransform: "none" },
    caption: { fontSize: 12, color: ink.muted },
  },

  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 20, minHeight: 44 },
        outlined: { borderColor: ink.borderStrong },
        outlinedPrimary: {
          borderColor: ink.borderStrong,
          color: ink.text,
          "&:hover": { background: ink.alt, borderColor: ink.borderStrong },
        },
        text: {
          "&:hover": { background: orange.subtle },
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
        head: { fontWeight: 700, color: ink.muted, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.03em" },
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
          "&.Mui-checked + .MuiSwitch-track": { backgroundColor: orange.main, opacity: 1 },
        },
      },
    },
  },
});

export default theme;
