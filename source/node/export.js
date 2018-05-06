const fs = require('fs-extra');
const isImage = require('is-image');

const ROOT_DIR = '../../';
const DIST_DIR = ROOT_DIR + "public/";
const SOURCE_DIR = ROOT_DIR + "source/";
const PUBLIC_DIR = SOURCE_DIR + "public/";
const DIST_JS_DIR = DIST_DIR + "js/";
const DIST_CSS_DIR = DIST_DIR + "css/";
const DIST_IMG_DIR = DIST_DIR + "img/";

const AUTHOR_TEXT = `/* Developed by Mike del Castillo (http://mikedc.io)*/`

const IMG_FILES = fs.readdirSync(DIST_IMG_DIR)
  .map(file => DIST_IMG_DIR + file)
  .filter(file => isImage(file));

const CSS_FILES = [
  "main.css"
];

const JS_FILES = [
  "main.js"
];

if(fs.existsSync(DIST_DIR)){
  fs.emptyDirSync(DIST_DIR);
  fs.rmdirSync(DIST_DIR);
}
fs.copySync(PUBLIC_DIR, DIST_DIR);

CSS_FILES.forEach(file => {
  let path = DIST_CSS_DIR + file;
  let css = fs.readFileSync(path, "utf-8");

  require('postcss')([
    require('postcss-css-variables')(),
    require('autoprefixer')({
      browsers: [
        "> 0%",
        "last 10000 versions"
      ]
    }),
    require('cssnano')({
      preset: 'default'
    })
  ]).process(css).then(css => {
    //save to style file
    css = AUTHOR_TEXT + css;
    fs.writeFileSync(path, css);
  });
});

JS_FILES.forEach(file => {
  let path = DIST_JS_DIR + file;

  let js = fs.readFileSync(path, 'utf-8');

  js = require("babel-core").transform(js, {
    "presets": [
      ['es2015', {
        loose: true,
        modules: false
      }]]
  }).code;

  js = require("uglify-js").minify(js).code;
  //intentionally remove more spaces because of html in strings
  js = js.replace(/( |\n|\t){2,}/gmi, '');

  fs.writeFileSync(path, AUTHOR_TEXT + js);
});

require('imagemin')(
  IMG_FILES,
  DIST_IMG_DIR, {
    use: [
      require('imagemin-jpeg-recompress')(),
      require('imagemin-jpegtran')(),
      require('imagemin-optipng')({
        optimizationLevel: 5
      }),
      require('imagemin-pngquant')()
    ]
  }
).then(files => {

});
