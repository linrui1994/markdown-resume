## markdown-resume

> Write a resume with markdown and generate to html or pdf

> use github markdown theme

#### usage

> install

```bash
npm install markdown-resume-pdf --save
```

> get start

```js
const path = require('path')
const markdownResume = require('../lib/index.js')

markdownResume('./my-resume.md', {
  html: true, // generate the html file, default false
  pdf: true, // generate the pdf file, default true
  output: path.resolve(__dirname, 'resume')
})
```
