var iniparser = require('iniparser');
var fs = require('fs');

module.exports.compassOptions = function(config) {
  config = config || './config.rb'
  var userSettings = {};
  if (fs.existsSync(config)) {
    userSettings = iniparser.parseSync(config)
  }
  else {
    userSettings = {
      'http_path': './',
      'css_dir': 'css',
      'sass_dir': 'sass',
      'images_dir': 'images',
      'javascripts_dir': 'js',
      'fonts_dir': 'fonts'
    }
  }

  var options = {
    html: userSettings.http_path,
    css: userSettings.css_dir,
    sass: userSettings.sass_dir,
    img: userSettings.images_dir,
    js: userSettings.javascripts_dir,
    fonts: userSettings.fonts_dir
  };
  // Remove quotes from options, Compass needs them, but we don't.
  for (var k in options) {
    if (typeof(options[k]) === 'string') {
      options[k] = options[k].replace(/"/g, '');
      options[k] = options[k].replace(/'/g, '');
    }
  }

  return options;
}