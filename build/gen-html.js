const fs = require('fs')
const path = require('path')
const ora = require('ora')
const Markdown = require('markdown-it')
const md = new Markdown({
  html: true
})
const spinner = ora('generating').start()
const html = md.render(fs.readFileSync(path.resolve(__dirname, '../resume.md'), 'utf-8'))

const template = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8')
const resume = template.toString().replace(`<!-- html-auto-inject -->`, html)
fs.writeFile(path.resolve(__dirname, '../resume.html'), resume, err => {
  err ? spinner.fail('fail with' + err) : spinner.succeed('done')
})
