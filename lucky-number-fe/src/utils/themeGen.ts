import React from 'react';


const hexToHSLObject = (hex: string) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

/**
 * Converts HEX color to space-separated HSL string for CSS variables
 * Format: "H S% L%"
 */
export const hexToHSL = (hex: string): string => {
  const { h, s, l } = hexToHSLObject(hex);
  return `${h} ${s}% ${l}%`;
};

/**
 * Calculates luminance of a hex color to determine contrast
 */
export const getLuminance = (hex: string): number => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

export const getThemeCSS = (brandHex?: string): string => {
  if (!brandHex || brandHex === '#EAB308' || brandHex.toLowerCase() === '#eab308') {
    return '';
  }

  const { h, s, l } = hexToHSLObject(brandHex);
  const luminance = getLuminance(brandHex);

  const primaryForeground = luminance > 0.6 ? '0 75% 16%' : '0 0% 100%';

  return `
    :root {
      --primary: ${h} ${s}% ${l}%;
      --primary-foreground: ${primaryForeground};
      --background: ${h} ${Math.min(s, 75)}% ${Math.max(l - 30, 10)}%;
      --surface: ${h} ${Math.min(s, 70)}% ${Math.max(l - 15, 20)}%;
      --text-main: ${h} ${Math.min(s, 98)}% ${Math.min(l + 40, 95)}%;
      --text-muted: ${h} ${Math.min(s, 90)}% ${Math.min(l + 25, 80)}%;
      --border: ${h} ${s}% ${l}%;
    }
  `;
};
