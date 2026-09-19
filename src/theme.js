import { createTheme } from "@mui/material/styles";

/**
 * MUI theme mirroring CSS/tokens.css.
 *
 * Without this, MUI ships its own blue palette and 4px corners into a project
 * whose brand is orange, and every component has to be overridden individually.
 * Values are duplicated here rather than read from CSS variables because MUI
 * needs real colours to compute hover, disabled and contrast states.
 */
const brand = {
  50: "#fff4e3",
  100: "#fde0b4",
  200: "#fcc878",
  400: "#fe9e0d",
  600: "#c47605",
  800: "#8a5303",
  900: "#5a3602",
};

const neutral = {
  0: "#ffffff",
  50: "#f7f7f6",
  100: "#e8e8e6",
  200: "#d3d3d0",
  400: "#8a8a86",
  600: "#5e5e5a",
  800: "#3c3c3a",
  900: "#232322",
};

const theme = createTheme({
  palette: {
    primary: {
      light: brand[200],
      main: brand[400],
      dark: brand[600],
      // Dark brown rather than white: white on #fe9e0d fails contrast.
      contrastText: brand[900],
    },
    secondary: { main: neutral[800], contrastText: neutral[0] },
    success: { main: "#3b6d11" },
    error: { main: "#a32d2d" },
    warning: { main: "#854f0b" },
    background: { default: neutral[50], paper: neutral[0] },
    text: { primary: neutral[900], secondary: neutral[600], disabled: neutral[400] },
    divider: neutral[200],
  },

  shape: { borderRadius: 10 },

  typography: {
    fontFamily: '"Reem Kufi", system-ui, -apple-system, "Segoe UI", sans-serif',
    h1: { fontSize: 36, fontWeight: 500 },
    h2: { fontSize: 28, fontWeight: 500 },
    h3: { fontSize: 22, fontWeight: 500 },
    h4: { fontSize: 18, fontWeight: 500 },
    body1: { fontSize: 15, lineHeight: 1.6 },
    body2: { fontSize: 13, lineHeight: 1.6 },
    button: { fontSize: 14, fontWeight: 500, textTransform: "none" },
  },

  components: {
    // MUI shouts by default; sentence case reads calmer and matches the copy.
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10, paddingInline: 16, minHeight: 40 },
      },
    },
    MuiTextField: { defaultProps: { size: "small" } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 10 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 500, color: neutral[600], fontSize: 13 },
      },
    },
  },
});

export default theme;
