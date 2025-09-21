export interface IOcrAPI {
  /* ask: (url: string, lang: string) => Promise<string> */
  ask: (img: string) => Promise<string>
}
