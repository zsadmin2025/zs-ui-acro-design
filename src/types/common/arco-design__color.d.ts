// src/types/arco-design__color.d.ts
declare module '@arco-design/color' {
  export function generate(
    color: string,
    options?: { list?: boolean; dark?: boolean },
  ): string[];

  export function getRgbStr(color: string): string;

  export function getPresetColors(): Record<
    string,
    {
      light: string[];
      dark: string[];
      primary: string;
    }
  >;
}
