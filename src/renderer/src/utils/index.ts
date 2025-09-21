export { renderLaTeXTable } from './renderLaTexXTable.js'
export { ProxySSEToRender } from './proxySSEToRender.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TypeSetting(data: any): string {
  if (!data?.words || !data.words.length) return ''

  // 1. 提取需要的字段
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const words = data.words.map((w: any) => ({
    text: w.text,
    x: w.bbox.x0,
    y: w.bbox.y0
  }))

  // 2. 按 y 排序（行顺序），y 相同则按 x 排序
  words.sort((a, b) => a.y - b.y || a.x - b.x)

  // 3. 分组成行
  const lineThreshold = 15 // 行间高度阈值，可调
  const lines: { y: number; words: typeof words }[] = []
  let currentLine: { y: number; words: typeof words } | null = null

  for (const word of words) {
    if (!currentLine || Math.abs(word.y - currentLine.y) > lineThreshold) {
      // 新行
      currentLine = { y: word.y, words: [word] }
      lines.push(currentLine)
    } else {
      // 同一行
      currentLine.words.push(word)
    }
  }

  // 4. 每行内按 x 排序，并根据空隙补空格
  const spaceThreshold = 10 // 空格宽度阈值，可调
  let result = ''

  for (const line of lines) {
    line.words.sort((a, b) => a.x - b.x)

    let lineText = ''
    let prevX = 0

    for (const word of line.words) {
      const gap = word.x - prevX
      if (gap > spaceThreshold) {
        // 简单按 gap 补空格数量
        const spaceCount = Math.round(gap / spaceThreshold)
        lineText += ' '.repeat(spaceCount)
      }
      lineText += word.text
      prevX = word.x + word.text.length * 8 // 简单估算字符宽度
    }

    result += lineText + '\n'
  }

  return result
}
