const path = require('path')
const markdownResume = require('../lib/index.js')

markdownResume(path.resolve(__dirname, 'resume.md'), {
  html: true,
  theme: 'air'
})
