export const theme = {
  colors: {
    background: "#F8FAFC",
    surface: "#FFFFFF",

    text: "#0F172A",
    secondaryText: "#64748B",

    border: "#E2E8F0",

    primary: "#05215e",
    primaryText: "#FFFFFF",

    danger: "#DC2626",
    dangerSurface: "#FEE2E2",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },

  typography: {
    screenTitle: {
      fontSize: 30,
      lineHeight: 36,
      fontWeight: "700" as const,
    },

    sectionTitle: {
      fontSize: 20,
      lineHeight: 26,
      fontWeight: "700" as const,
    },

    cardTitle: {
      fontSize: 17,
      lineHeight: 22,
      fontWeight: "600" as const,
    },

    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "400" as const,
    },

    bodyStrong: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "600" as const,
    },

    caption: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "400" as const,
    },

    captionStrong: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "600" as const,
    },
  },

  components: {
    minTouchHeight: 48,
    inputHeight: 56,
  },
} as const;
