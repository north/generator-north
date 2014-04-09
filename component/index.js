'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var fs = require('fs');
var inquirer = require("inquirer");
var chalk = require('chalk');
var _s = require('underscore.string');

var path = require('path');
var shared = {};
shared.workingDir = function () {
  var dir = path.basename(process.cwd()).toLowerCase();
  switch (dir) {
    case 'components':
      return '.'
    case 'layouts':
      return '../components'
    case 'partials':
      return './components'
    case 'sass':
    case 'scss':
      return './partials/components'
    default:
      if (fs.existsSync('sass')) {
        return './sass/partials/components'
      }
      else if (fs.existsSync('scss')) {
        return './scss/partials/components'
      }
      else {
        return false;
      }
      break;
  }
}

shared.welcome = function () {
  var welcome =
    '\n' + chalk.blue('               /\\\\') +
    '\n' + chalk.blue('              //@\\\\') +
    '\n' + chalk.blue('             // @@\\\\') +
    '\n' + chalk.blue('            //  @@@\\\\') +
    '\n' + chalk.blue('           //   @@@@\\\\') +
    '\n' + chalk.blue('          //    @@@@@\\\\        ') + chalk.cyan(' ___   ___    _____    ______    _________   ___  ___   ') +
    '\n' + chalk.blue('          //    @@@@@\\\\        ') + chalk.cyan('|NNN\\ |NNN|  /O.-.O\\  |RRRRRR\\  |TTTTTTTTT| |HHH||HHH|  ') +
    '\n' + chalk.blue('         //     @@@@@@\\\\       ') + chalk.cyan(' |NNN\\ |N|  |O|   |O|  |R|__)R| |T| |T| |T|  |H|__|H|   ') +
    '\n' + chalk.blue('        //      @@@@@@@\\\\      ') + chalk.cyan(' |N|\\N\\|N|  |O|   |O|  |RRRRR/      |T|      |HHHHHH|   ') +
    '\n' + chalk.blue('       //       @@@@@@@@\\\\     ') + chalk.cyan(' |N| \\NNN|  |OO`-\'OO|  |R|  \\R\\_    |T|      |H|  |H|   ') +
    '\n' + chalk.blue('       //       @@@@@@@@\\\\     ') + chalk.cyan('|NNN| \\NN|   \\OOOOO/  |RRR| |RRR|  |TTT|    |HHH||HHH|  ') +
    '\n' + chalk.blue('      //        @@@@@@@@@\\\\      ') +
    '\n' + chalk.blue('     //         @@@@@@@@@@\\\\     ') +
    '\n' + chalk.blue('    //        // \\\\@@@@@@@@\\\\  ') +
    '\n' + chalk.blue('   //      //       \\\\@@@@@@\\\\ ') +
    '\n' + chalk.blue('  //  //                 \\\\@@\\\\') +
    '\n' + chalk.blue('  ////                     \\\\\\\\');
  return welcome;
}

var ComponentGenerator = yeoman.generators.Base.extend({
  init: function () {
    var welcome = shared.welcome();

    if (shared.workingDir() === false) {
      console.log(chalk.red('You need to call the Component Generator from the root of your Sass directory'));
    }
    else {
      // have North greet the user
      this.log(welcome);

      // replace it with a short and sweet description of your generator
      this.log(chalk.magenta('\nComponent generator for North. ') + chalk.cyan('http://pointnorth.io\n'));
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
        message: 'Component Name',
        default: this.args.join(' '),
        validate: function (answer) {
          if (answer === '') {
            return "Component name cannot be empty";
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

          if (answer === '') {
            return "Aspect name cannot be empty";
          }
          else if (aspects.indexOf(answer.toUpperCase()) > -1) {
            return "Aspect `" + answer + "` already exists!";
          }
          else {
            return true;
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

    if (shared.workingDir() !== false) {
      this.prompt(name, function (props) {
        this.name = _s.titleize(props.name);
        this.slug = _s.slugify(props.name);
        addAspect();
      }.bind(this));
    }
  },

  files: function () {
    var dir = shared.workingDir();

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
        aspects += '// ' + _s.titleize(this.aspects[i]) + ' styling for ' + this.name + ' Component\n';
        aspects += '.' + this.slug + '--' + _s.slugify(this.aspects[i]).toUpperCase() + ' {\n';
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

module.exports = ComponentGenerator;