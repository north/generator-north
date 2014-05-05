'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var fs = require('fs');
var inquirer = require("inquirer");
var chalk = require('chalk');
var _s = require('underscore.string');
var shared = require('../shared.js');


var LayoutGenerator = yeoman.generators.Base.extend({
  init: function () {
    var welcome = shared.welcome();

    if (shared.workingDir('layouts') === false) {
      console.log(chalk.red('You need to call the Component Generator from the root of your Sass directory'));
    }
    else {
      // have North greet the user
      this.log(welcome);

      // replace it with a short and sweet description of your generator
      this.log(chalk.magenta('\Layout generator for North. ') + chalk.cyan('http://pointnorth.io\n'));
    }
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
        default: this.args.join(' '),
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
          var cb = this.async();

          if (answer === '') {
            cb("Aspect name cannot be empty");
          }
          else if (aspects.indexOf(answer.toUpperCase()) > -1) {
            cb("Aspect `" + answer + "` already exists!");
          }
          else {
            cb(true);
          }

        }
      }
    ];

    var addAspect = function () {
      _this.prompt(aspectPrompts, function(props) {
        if (props.add) {
          aspects.push(props.aspect.toUpperCase());
          console.log(line);
          addAspect();
        }
        else {
          this.aspects = aspects;
          done();
        }
      }.bind(_this));
    }

    if (shared.workingDir('layouts') !== false) {
      this.prompt(name, function (props) {
        this.name = _s.titleize(props.name);
        this.slug = _s.slugify(props.name);
        addAspect();
      }.bind(this));
    }
  },

  files: function () {
    var dir = shared.workingDir('layouts');

    if (dir !== false) {
      var types = {
        'extends': 'Extendable Classes',
        'mixins': 'Mixins',
        'variables': 'Variable Defaults'
      };

      // Aspect Styling
      var aspects = '\n';
      for (var i in this.aspects) {
        aspects += '\n';
        aspects += '//////////////////////////////\n';
        aspects += '// @{' + this.slug + '--' + this.aspects[i].toLowerCase() + '}\n';
        aspects += '// ' + _s.titleize(this.aspects[i]) + ' styling for ' + this.name + ' Layout\n';
        aspects += '._' + this.slug + '--' + _s.slugify(this.aspects[i]).toUpperCase() + ' {\n';
        aspects += '  \n';
        aspects += '}\n';
        aspects += '// {' + this.slug + '--' + this.aspects[i].toLowerCase() + '}@\n';
        aspects += '//////////////////////////////\n';
        aspects += '\n';
      }

      this.aspects = aspects;

      this.template('main.scss', dir + '/_' + this.slug + '.scss');
      for (var i in types) {
        var path = dir + '/' + this.slug + '/_' + i + '.scss';
        if (!fs.existsSync(path)) {
          this.type = types[i];
          this.template('sub.scss', path);
        }
      }
    }
  }
});

module.exports = LayoutGenerator;