'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _s = require('underscore.string');
var fs = require('fs-extra');
var shared = require('../shared.js');
var settings = {};


var NorthGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
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

  configuring: function () {
    //////////////////////////////
    // Folder Enforcement
    //////////////////////////////
    this.destinationRoot(this.folder);

    //////////////////////////////
    // Settings
    //////////////////////////////
    settings = {
      project: this.projectName,
      slug: this.slug,
      runner: this.runner,
      server: this.server,
      folder: this.folder,
      git: this.git
    };

    this.config.set(settings);

    //////////////////////////////
    // File Config
    //////////////////////////////
    var pkg = shared.pkg(this.runner);
        pkg.name = this.slug;

    if (this.server) {
      pkg.devDependencies['gulp-shell'] = '^0.2';
    }

    this.copy('editorconfig', '.editorconfig');
    this.copy('gitignore', '.gitignore');
    this.template('_bower.json', 'bower.json');



    if (this.runner === 'Gulp') {
      this.write('package.json', JSON.stringify(pkg));
    }
  },

  default: function () {
    // Lint
    this.composeWith('north:jshint', {
      options: {
        runner: this.runner,
        server: this.server,
        'no-gemfile': true,
        'no-package': true,
        'skip-install': this.options['skip-install']
      }
    });
    // Sass Structure
    this.composeWith('north:sass', {
      options: {
        'skip-install': this.options['skip-install']
      }
    });
  },

  writing: function () {
    if (this.runner === 'Gulp') {
      this.copy('Gulpfile.js', 'Gulpfile.js');
    }

    if (this.server) {
      this.template('index.html', 'index.html');
      this.directory('tasks', 'tasks');
    }
  },

  install: function () {
    //////////////////////////////
    // Install dependencies unless --skip-install is passed
    //////////////////////////////
    if (!this.options['skip-install']) {
      var bower = true;
      var npm = this.runner.indexOf('None') !== -1 ? false : true;

      if (bower || npm) {
        this.installDependencies({
          bower: bower,
          npm: npm
        });
      }
    }
  },

  end: function () {
    //////////////////////////////
    // If the --git flag is passed, initialize git and add for initial commit
    //////////////////////////////
    if (this.options['git']) {
      sh.run('git init');
      sh.run('git add . && git commit -m "North Generation"');
    }
  }
});

module.exports = NorthGenerator;
