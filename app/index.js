'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _s = require('underscore.string');
var sh = require('execSync');


var NorthGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');



    this.on('end', function () {
      if (!this.options['skip-install']) {
        if (!this.options['init']) {
          process.chdir(this.folder);
        }
        sh.run('bundle install --path vendor');
        this.installDependencies();
      }

      this.log(chalk.magenta('Git: ' + this.git));

      if (this.options['git']) {
        if (!this.options['init']) {
          process.chdir(this.folder);
        }
        sh.run('git init');
      }
    });
  },

  askFor: function () {
    var done = this.async();

    var welcome =
    '\n' + chalk.blue('                 /\\\\') +
    '\n' + chalk.blue('                //@\\\\') +
    '\n' + chalk.blue('               // @@\\\\') +
    '\n' + chalk.blue('              //  @@@\\\\') +
    '\n' + chalk.blue('             //   @@@@\\\\') +
    '\n' + chalk.blue('            //    @@@@@\\\\       ') + chalk.cyan('  ___   ___    _____    ______    _________   ___  ___   ') +
    '\n' + chalk.blue('            //    @@@@@\\\\       ') + chalk.cyan(' |NNN\\ |NNN|  /O.-.O\\  |RRRRRR\\  |TTTTTTTTT| |HHH||HHH|  ') +
    '\n' + chalk.blue('           //     @@@@@@\\\\      ') + chalk.cyan('  |NNN\\ |N|  |O|   |O|  |R|__)R| |T| |T| |T|  |H|__|H|   ') +
    '\n' + chalk.blue('          //      @@@@@@@\\\\     ') + chalk.cyan('  |N|\\N\\|N|  |O|   |O|  |RRRRR/      |T|      |HHHHHH|   ') +
    '\n' + chalk.blue('         //       @@@@@@@@\\\\    ') + chalk.cyan('  |N| \\NNN|  |OO`-\'OO|  |R|  \\R\\_    |T|      |H|  |H|   ') +
    '\n' + chalk.blue('         //       @@@@@@@@\\\\    ') + chalk.cyan(' |NNN| \\NN|   \\OOOOO/  |RRR| |RRR|  |TTT|    |HHH||HHH|  ') +
    '\n' + chalk.blue('        //        @@@@@@@@@\\\\      ') +
    '\n' + chalk.blue('       //         @@@@@@@@@@\\\\     ') +
    '\n' + chalk.blue('      //        // \\\\@@@@@@@@\\\\  ') +
    '\n' + chalk.blue('     //      //       \\\\@@@@@@\\\\ ') +
    '\n' + chalk.blue('    //  //                 \\\\@@\\\\') +
    '\n' + chalk.blue('    ////                     \\\\\\\\');

    // have Yeoman greet the user
    this.log(welcome);

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('\nA generator to help align and guide your project; a companion for North. ') + chalk.cyan('http://pointnorth.io'));

    var prompts = [{
      type: 'string',
      name: 'projectName',
      message: 'What\'s your project\'s name?' + chalk.red(' (Required)'),
      validate: function (input) {
        if (input === '') {
          return 'Please enter your project\'s name';
        }
        return true;
      }
    }];

    // Optionally include a basic Gruntfile
    if (this.options['gruntfile'] === undefined) {
      prompts.push({
        type: 'confirm',
        name: 'initGrunt',
        message: 'Would you like to include a basic Gruntfile?',
        default: true
      });
    }

    this.prompt(prompts, function (props) {
      this.projectName = props.projectName;
      this.slug = _s.slugify(this.projectName);
      this.folder = this.options['init'] ? '.' : this.slug + '/';
      this.gruntfile = this.options['gruntfile'] ? this.options['gruntfile'] : this.initGrunt;
      this.git = this.options['git'] ? this.options['git'] : this.initGit;

      done();
    }.bind(this));
  },

  app: function () {
    this.template('_package.json', this.folder + 'package.json');
    this.template('_bower.json', this.folder + 'bower.json');
    this.copy('Gemfile', this.folder + 'Gemfile');
  },

  projectfiles: function () {
    this.copy('editorconfig', this.folder + '.editorconfig');
    this.copy('jshintrc', this.folder + '.jshintrc');
  }
});

module.exports = NorthGenerator;
