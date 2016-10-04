const path = require('path')
const SiteBuilderEngine = require('./engine')

const WORK_DIR = path.join(__dirname, 'content')
const BUILD_DIR = path.join(__dirname, '__build')
const options = {
  metainfo: 'metainfo',
  partials: 'partials',
  source: 'src',
  dataFolder: 'src/data',
  theme: 'medinova'
}
let engine = new SiteBuilderEngine(WORK_DIR, BUILD_DIR, options)

engine.cliDev(8080, (err, files) => {
      if (err) {
        console.log(err);
        return;
      }
      let filenames = Object.keys(files).join(', ');
      console.log('>>')
      console.log(`Updated: ${filenames}`)
      console.log('<<')
    })
