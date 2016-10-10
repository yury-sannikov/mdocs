const path = require('path')
const SiteBuilderEngine = require('../engine')

const THEME = 'cleanui'
const WORK_DIR = path.join(__dirname, 'content')
const BUILD_DIR = path.join(__dirname, '__build')
const THEME_DIR = path.join(__dirname, '../sitebuilder-themes', THEME)
const options = {
  metainfo: 'metainfo',
  source: 'src',
  dataFolder: 'src/data',
  theme: THEME,
  themeDir: THEME_DIR,
  partialsPath: THEME_DIR
}
let engine = new SiteBuilderEngine(WORK_DIR, BUILD_DIR, options)

const isPublish = () => {
  return (process.argv.length >= 3) && process.argv[2] === 'publish'
}

if (isPublish()) {

  engine.publish({}, () => {
    console.log('Done')
  })

  return
}

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
