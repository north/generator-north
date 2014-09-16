'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _s = require('underscore.string');
var sh = require('execSync');
var shared = require('../shared.js');
var settings = {};


var NorthGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');



    this.on('end', function () {
      //////////////////////////////
      // Install dependencies unless --skip-install is passed
      //////////////////////////////
      if (!this.options['skip-install']) {
        var bower = true;
        var npm = this.runner.indexOf('None') !== -1 ? false : true;

        sh.run('bundle install --path vendor');

        if (bower || npm) {
          this.installDependencies({
            bower: bower,
            npm: npm
          });
        }
      }

      //////////////////////////////
      // If the --git flag is passed, initialize git and add for initial commit
      //////////////////////////////
      if (this.options['git']) {
        sh.run('git init');
        sh.run('git add . && git commit -m "North Generation"');
      }
    });
  },

  askFor: function () {
    var done = this.async();

    var welcome = shared.welcome();

    // have North greet the user
    this.log(welcome);

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('\nA generator to help align and guide your project; a companion for North. ') + chalk.cyan('http://pointnorth.io\n'));

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
    prompts.push(
      {
        type: 'list',
        name: 'projectRunner',
        message: 'What task runner would you like to use?',
        choices: ['Gulp', 'None'],
        default: 'Gulp'
      },
      {
        type: 'confirm',
        name: 'server',
        message: 'Include server and watch tasks?',
        when: function (answers) {
          if (answers.projectRunner.toLowerCase() === 'none') {
            return false;
          }
          else {
            return true;
          }
        },
        default: true
      }
    );

    this.prompt(prompts, function (props) {
      this.projectName = props.projectName;
      this.slug = _s.slugify(this.projectName);
      this.runner = props.projectRunner;
      this.server = props.server;
      this.folder = this.options['init'] ? './' : this.slug + '/';
      this.git = this.options['git'] ? this.options['git'] : this.initGit;

      done();
    }.bind(this));
  },

  enforceFolderName: function () {
    this.destinationRoot(this.folder);
  },

  saveSettings: function () {
    settings = {
      project: this.projectName,
      slug: this.slug,
      runner: this.runner,
      server: this.server,
      folder: this.folder,
      git: this.git
    };

    this.config.set(settings);
  },

  app: function () {
    this.template('_bower.json', 'bower.json');
    this.copy('Gemfile', 'Gemfile');
  },

  projectfiles: function () {
    var pkg = shared.pkg(this.runner);
        pkg.name = this.slug;

    if (this.server) {
      pkg.devDependencies['gulp-shell'] = '^0.2';
    }

    this.copy('editorconfig', '.editorconfig');
    this.copy('gitignore', '.gitignore');
    this.copy('config.rb', 'config.rb');

    if (this.runner === 'Gulp') {
      this.copy('Gulpfile.js', 'Gulpfile.js');
      this.write('package.json', JSON.stringify(pkg));
    }

    if (this.server) {
      this.template('index.html', 'index.html');
    }

    var keep = ['images', 'fonts', 'js'];

    for (var i in keep) {
      this.copy('gitkeep', keep[i] + '/.gitkeep');
    }
  },

  invokes: function () {
    // Lint
    this.composeWith('north:jshint', {
      options: {
        runner: 'None'
      }
    });
    // Sass Structure
    this.composeWith('north:sass');
  }
});

module.exports = NorthGenerator;
