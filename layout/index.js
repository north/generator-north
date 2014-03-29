'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var fs = require('fs');
var inquirer = require("inquirer");
var chalk = require('chalk');
var _s = require('underscore.string');

var workingDir = function () {
  var dir = path.basename(process.cwd()).toLowerCase();
  switch (dir) {
    case 'layouts':
      return '.'
    case 'components':
      return '../layouts'
    case 'partials':
      return './layouts'
    case 'sass':
    case 'scss':
      return './partials/layouts'
    default:
      if (fs.existsSync('sass')) {
        return './sass/partials/layouts'
      }
      else if (fs.existsSync('scss')) {
        return './scss/partials/layouts'
      }
      else {
        console.log(chalk.red('You need to call the Layout Generator from the root of your Sass directory'));
        return false;
      }
      break;
  }
}

var LayoutGenerator = yeoman.generators.NamedBase.extend({
  init: function () {
    // console.log('You called the layout subgenerator with the argument ' + this.name + '.');
  },

  askFor: function () {
    var done = this.async();
    var aspects = [];
    var _this = this;
    var line = new inquirer.Separator().line;

    var name = [
      {
        type: 'string',
        name: 'name',
        message: 'Layout Name',
        default: this.name,
        validate: function (answer) {
          if (answer === '') {
            return "Layout name cannot be empty";
          }
          else {
            return true;
          }
        }
      }
    ];

    var aspectPrompts = [
      {
        type: 'confirm',
        name: 'add',
        message: 'Add an aspect?',
        default: false
      },
      {
        type: 'string',
        name: 'aspect',
        message: 'Aspect name',
        when: function (answers) {
          return answers.add;
        },
        validate: function (answer) {
          var done = this.async();

          setTimeout(function () {
            if (answer === '') {
              done("Aspect name cannot be empty");
            }
            else if (aspects.indexOf(answer.toUpperCase()) > -1) {
              done("Aspect `" + answer + "` already exists!");
            }
            else {
              done(true);
            }
          }, 1000);

        }
      }
    ];

    var addAspect = function () {
      _this.prompt(aspectPrompts, function(props) {
        if (props.add) {
          aspects.push(props.aspect);
          console.log(line);
          addAspect();
        }
        else {
          this.aspects = aspects;
          done();
        }
      }.bind(_this));
    }

    this.prompt(name, function (props) {
      this.name = _s.titleize(props.name);
      this.slug = _s.slugify(props.name);
      addAspect();
    }.bind(this));
  },

  files: function () {
    var dir = workingDir();

    if (dir !== false) {
      var types = {
        'extends': 'Extendable Classes',
        'mixins': 'Mixins',
        'variables': 'Variable Defaults'
      };

      this.template('main.scss', dir + '/_' + this.slug + '.scss');
      for (var i in types) {
        this.type = types[i];
        this.template('sub.scss', dir + '/' + this.slug + '/_' + i + '.scss');
      }
    }
  }
});

module.exports = LayoutGenerator;