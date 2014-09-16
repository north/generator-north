'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');


var NorthGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    var files = [
      'style'
    ]

    var partials = [
      'partials/global/variables',
      'partials/global/functions',
      'partials/global/mixins',
      'partials/global/extends'
    ];

    var folders = [
      'partials/components',
      'partials/layouts'
    ];

    this.composeWith('sass:structure', {
      options: {
        syntax: 'scss',
        base: 'sass',
        files: files,
        partials: partials,
        folders: partials.concat(folders),
        fileTemplate: this.sourceRoot() + '/_style.scss'
      }
    });
  }
});

module.exports = NorthGenerator;
