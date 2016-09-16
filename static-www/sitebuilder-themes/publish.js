const path = require('path')
const SiteBuilderEngine = require('../../app/src/shared_modules/sb_engine_0.2')

const THEME = 'cleanui'
const WORK_DIR = path.normalize('/Users/yuriysannikov/s3/liberty-laser-eye-0')
const BUILD_DIR = path.join(__dirname, '__build')
const THEME_DIR = path.join(__dirname, THEME)
const options = {
  metainfo: 'metainfo',
  source: 'src',
  dataFolder: 'src/data',
  theme: THEME,
  themeDir: THEME_DIR,
  partialsPath: THEME_DIR
}
let engine = new SiteBuilderEngine(WORK_DIR, BUILD_DIR, options)

const deployOptions = {
  banner: false
}

engine.publish(deployOptions, (err, files) => {
  if (err) {
    console.log(err);
    return;
  }
  let filenames = Object.keys(files).join(', ');
  console.log('>>')
  console.log(`Updated: ${filenames}`)
  console.log('<<')
});

// engine.cliDev(8080, (err, files) => {
//       if (err) {
//         console.log(err);
//         return;
//       }
//       let filenames = Object.keys(files).join(', ');
//       console.log('>>')
//       console.log(`Updated: ${filenames}`)
//       console.log('<<')
//     })
