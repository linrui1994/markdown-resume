const fs = require('fs')
const path = require('path')
const ora = require('ora')
const htmlPdf = require('html-pdf-chrome')
const Markdown = require('markdown-it')
const md = new Markdown({
  html: true
})

module.exports = function (input, options = {}) {
  input = path.resolve(process.cwd(), input)
  options.output = path.resolve(process.cwd(), (options.output || 'resume').replace(/\..+/, ''))
  options.html = options.html || false
  options.pdf = options.pdf || true

  const spinner = ora('generating').start()
  const html = md.render(fs.readFileSync(input, 'utf-8'))

  const template = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8')
  const resume = template.toString().replace(`<!-- html-auto-inject -->`, html)

  const task = []
  if (options.html) {
    task.push(new Promise((resolve, reject) => {
      fs.writeFile(options.output + '.html', resume, err => {
        err ? reject(err) : resolve()
      })
    }))
  }
  if (options.pdf) {
    task.push(new Promise((resolve, reject) => {
      htmlPdf.create(resume, {}).then(pdf => {
        try {
          pdf.toFile(options.output + '.pdf')
          resolve()
        } catch (err) {
          reject(err)
        }
      })
    }))
  }
  return Promise.all(task).then(() => {
    spinner.succeed('done')
  }).catch(err => {
    spinner.fail(err)
  })
}
