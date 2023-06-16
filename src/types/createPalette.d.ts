import * as createPalette from '@material-ui/core/styles/createPalette';
declare module '@material-ui/core/styles/createPalette' {
  interface PaletteOptions {
    brand: string;
    blue: string;
  }

  interface Palette {
    brand: string;
    blue: string;
  }
}
