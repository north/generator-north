'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');


var NorthGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    var files,
        partials,
        folders,
        base,
        gems;

    base = 'sass';

    files = [
      'style'
    ]

    partials = [
      'partials/global/variables',
      'partials/global/functions',
      'partials/global/mixins',
      'partials/global/extends'
    ];

    folders = [
      'partials/components',
      'partials/layouts'
    ];

    this.composeWith('sass:structure', {
      options: {
        syntax: 'scss',
        base: base,
        files: files,
        partials: partials,
        folders: partials.concat(folders),
        fileTemplate: this.sourceRoot() + '/_style.scss'
      }
    });

    gems = {
      'sass': '~>3.4',
      'compass': '~>1.0',
      'breakpoint': '~>2.5',
      'singularitygs': '~>1.4',
      'toolkit': '~>2.6',
      'modular-scale': '~>2.0'
    };

    this.composeWith('sass:compass', {
      options: {
        gems: gems,
        httpPath: './',
        cssDir: 'css',
        sassDir: base,
        imagesDir: 'images',
        jsDir: 'js',
        fontsDir: 'fonts',
        outputStyle: ':expanded',
        relativeAssets: true,
        lineComments: false,
        sassOptions: {
          ':sourcemaps': true
        },
        'skip-install': this.options['skip-install']
      }
    });
  }
});

module.exports = NorthGenerator;
