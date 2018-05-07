const fs = require('fs')
const path = require('path')
const ora = require('ora')
const htmlPdf = require('html-pdf-chrome')
const beautify = require('js-beautify').html
const Markdown = require('markdown-it')
const md = new Markdown({
  html: true
})

const presets = {
  github: 'github-markdown-css/github-markdown.css',
  air: 'markdown-air/css/air.css',
  splendor: 'markdown-splendor/css/splendor.css',
  retro: 'markdown-retro/css/retro.css'
}

module.exports = function (input, options = {}) {
  if (!path.isAbsolute(input)) {
    input = path.resolve(process.cwd(), input)
  }
  if (!path.isAbsolute(options.output || '')) {
    options.output = path.resolve(process.cwd(), options.output || '')
  }
  options.html = options.html || false
  options.pdf = options.pdf || true
  options.filename = (options.filename || 'resume').replace(/(\.pdf)|(\.html)$/, '')
  if (typeof options.theme === 'string') {
    if (presets[options.theme]) {
      options.theme = path.resolve(process.cwd(), 'node_modules', presets[options.theme])
    } else if (!path.isAbsolute(options.theme)) {
      options.theme = path.resolve(process.cwd(), options.theme)
    }
  } else {
    options.theme = path.resolve(process.cwd(), 'node_modules', presets.github)
  }

  const spinner = ora('generating').start()
  const html = md.render(fs.readFileSync(input, 'utf-8'))
  const css = fs.readFileSync(options.theme, 'utf-8')
  const template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')
  const resume = beautify(template.toString().replace(`/* css-auto-inject */`, css).replace(`<!-- html-auto-inject -->`, html))

  const task = []
  if (options.html) {
    task.push(new Promise((resolve, reject) => {
      fs.writeFile(path.resolve(options.output, options.filename) + '.html', resume, err => {
        err ? reject(err) : resolve()
      })
    }))
  }
  if (options.pdf) {
    task.push(new Promise((resolve, reject) => {
      htmlPdf.create(resume, {}).then(pdf => {
        try {
          pdf.toFile(path.resolve(options.output, options.filename) + '.pdf')
          resolve()
        } catch (err) {
          reject(err)
        }
      }).catch(reject)
    }))
  }
  return Promise.all(task).then(() => {
    spinner.succeed('done')
  }).catch(err => {
    spinner.fail(err)
  })
}
