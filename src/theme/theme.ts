import { createTheme } from '@mui/material/styles';
import type { Shadows } from '@mui/material/styles';

// 25 warm, low-opacity shadows — cozy rather than harsh
const softShadows: Shadows = [
  'none',
  '0px 1px 3px rgba(0,0,0,0.05)',
  '0px 1px 6px rgba(0,0,0,0.05)',
  '0px 2px 8px rgba(0,0,0,0.06)',
  '0px 2px 10px rgba(0,0,0,0.06)',
  '0px 3px 12px rgba(0,0,0,0.07)',
  '0px 3px 14px rgba(0,0,0,0.07)',
  '0px 4px 16px rgba(0,0,0,0.07)',
  '0px 4px 18px rgba(0,0,0,0.08)',
  '0px 5px 20px rgba(0,0,0,0.08)',
  '0px 5px 22px rgba(0,0,0,0.08)',
  '0px 6px 24px rgba(0,0,0,0.09)',
  '0px 6px 26px rgba(0,0,0,0.09)',
  '0px 7px 28px rgba(0,0,0,0.09)',
  '0px 7px 30px rgba(0,0,0,0.09)',
  '0px 8px 32px rgba(0,0,0,0.10)',
  '0px 8px 34px rgba(0,0,0,0.10)',
  '0px 9px 36px rgba(0,0,0,0.10)',
  '0px 9px 38px rgba(0,0,0,0.10)',
  '0px 10px 40px rgba(0,0,0,0.11)',
  '0px 10px 42px rgba(0,0,0,0.11)',
  '0px 11px 44px rgba(0,0,0,0.11)',
  '0px 11px 46px rgba(0,0,0,0.11)',
  '0px 12px 48px rgba(0,0,0,0.12)',
  '0px 12px 50px rgba(0,0,0,0.12)',
];

// Quicksand is the rounded display font for all headings.
// Nunito is the friendly body font — both loaded via next/font and exposed as
// CSS variables on <html> so they're available here without a JS import.
const HEADING_FONT = 'var(--font-quicksand), system-ui, sans-serif';
const BODY_FONT   = 'var(--font-nunito), -apple-system, BlinkMacSystemFont, system-ui, sans-serif';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#E8A4C9',      // soft rose-pink
      light: '#F2C5DF',
      dark: '#C97AAF',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#B8A4E8',      // soft lavender
      light: '#D3C5F5',
      dark: '#9175CF',
      contrastText: '#ffffff',
    },
    success: {
      main: '#A4D8B8',      // pastel mint
    },
    background: {
      default: '#FAF9F7',   // warm near-white
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E1E1E',
      secondary: '#6B6B6B',
    },
    divider: 'rgba(0,0,0,0.07)',
  },

  shape: {
    borderRadius: 16,       // up from 14 — everything feels a touch chubbier
  },

  shadows: softShadows,

  typography: {
    fontFamily: BODY_FONT,
    h1: { fontFamily: HEADING_FONT, fontWeight: 700, fontSize: '2.25rem', letterSpacing: '-0.02em' },
    h2: { fontFamily: HEADING_FONT, fontWeight: 700, fontSize: '1.875rem', letterSpacing: '-0.015em' },
    h3: { fontFamily: HEADING_FONT, fontWeight: 600, fontSize: '1.5rem',   letterSpacing: '-0.01em' },
    h4: { fontFamily: HEADING_FONT, fontWeight: 700, fontSize: '1.375rem', letterSpacing: '-0.01em' },
    h5: { fontFamily: HEADING_FONT, fontWeight: 700, fontSize: '1.125rem' },
    h6: { fontFamily: HEADING_FONT, fontWeight: 600, fontSize: '1rem' },
    body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem',  lineHeight: 1.55 },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
    caption: { fontSize: '0.78rem', letterSpacing: '0.01em' },
  },

  components: {
    // Disable ripple on every interactive element globally
    MuiButtonBase: {
      defaultProps: { disableRipple: true },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,   // pill-like by default; specific sx values still override
          paddingInline: '1.25rem',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          // Warm, low-opacity shadow — cozy rather than architectural
          boxShadow: '0px 2px 14px rgba(232, 164, 201, 0.12)',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { borderRadius: '999px' },  // fully pill-shaped difficulty chips
      },
    },

    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 14,
          },
        },
      },
    },
  },
});

export default theme;
