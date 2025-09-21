export function renderLaTeXTable(latexStr: string, container: HTMLElement): void {
  container.innerHTML = ''

  try {
    // 去掉 \begin{tabular} 和 \end{tabular}
    const content = latexStr
      .replace(/\\begin\{tabular\}\{.*?\}/, '')
      .replace(/\\end\{tabular\}/, '')
      .trim()

    // 按 \\ 换行分割
    const rows = content.split(/\\\\/)

    const table = document.createElement('table')
    table.style.borderCollapse = 'collapse'
    table.style.width = '100%'

    rows.forEach((rowStr) => {
      let row = rowStr.trim()
      if (!row) return

      // 清除行中 \hline
      row = row.replace(/\\hline/g, '').trim()
      if (!row) return // 如果清除后为空，跳过

      const tr = document.createElement('tr')

      // 按 & 分割列
      const cells = row.split('&').map((c) => c.trim())
      cells.forEach((cellText) => {
        const td = document.createElement('td')
        td.textContent = cellText
        td.style.border = '1px solid #000'
        td.style.padding = '6px 12px'
        tr.appendChild(td)
      })

      table.appendChild(tr)
    })

    container.appendChild(table)
  } catch (err) {
    console.error('解析 LaTeX 表格失败:', err)
    container.textContent = latexStr
  }
}
