const fs = require('fs')
const path = require('path')
const ora = require('ora')
const htmlPdf = require('html-pdf-chrome')
const Markdown = require('markdown-it')
const md = new Markdown({
  html: true
})
const spinner = ora('generating').start()
const html = md.render(fs.readFileSync(path.resolve(__dirname, '../resume.md'), 'utf-8'))

const template = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8')
const resume = template.toString().replace(`<!-- html-auto-inject -->`, html)
htmlPdf.create(resume, {}).then(pdf => {
  try {
    pdf.toFile(path.resolve(__dirname, '../resume.pdf'))
    spinner.succeed('done')
  } catch (err) {
    spinner.fail('fail with' + err)
  }
})
