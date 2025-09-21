export interface IOcrAPI {
  /* ask: (url: string, lang: string) => Promise<string> */
  ask: (img: string, renderTable: boolean) => Promise<string>
}
