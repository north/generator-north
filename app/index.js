'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _s = require('underscore.string');
var sh = require('execSync');
var shared = require('../shared.js');


var NorthGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');



    this.on('end', function () {
      //////////////////////////////
      // If the --init flag isn't passed in, move into project dir
      //////////////////////////////
      if (!this.options['init']) {
        process.chdir(this.projectFolder);
      }

      //////////////////////////////
      // Install dependencies unless --skip-install is passed
      //////////////////////////////
      if (!this.options['skip-install']) {
        sh.run('bundle install --path vendor');
        this.installDependencies();
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
        choices: ['Grunt', 'Gulp', 'None'],
        default: 'Grunt'
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

  app: function () {
    this.template('_bower.json', this.folder + 'bower.json');
    this.copy('Gemfile', this.folder + 'Gemfile');
  },

  projectfiles: function () {
    this.copy('editorconfig', this.folder + '.editorconfig');
    this.copy('jshintrc', this.folder + '.jshintrc');
    this.copy('gitignore', this.folder + '.gitignore');
    this.copy('config.rb', this.folder + 'config.rb');

    if (this.runner === 'Grunt') {
      this.copy('Gruntfile.js', this.folder + 'Gruntfile.js');
      this.template('_package-grunt.json', this.folder + 'package.json');
    }
    else if (this.runner === 'Gulp') {
      this.copy('Gulpfile.js', this.folder + 'Gulpfile.js');
      this.template('_package-gulp.json', this.folder + 'package.json');
    }

    if (this.server) {
      this.template('index.html', this.folder + 'index.html');
    }

    this.template('_style.scss', this.folder + 'sass/style.scss');

    var globals = ['variables', 'functions', 'mixins', 'extends'];

    for (var i in globals) {
      this.copy('all.scss', this.folder + 'sass/partials/global/_' + globals[i] + '.scss');
      this.copy('gitkeep', this.folder + 'sass/partials/global/' + globals[i] + '/.gitkeep');
    }

    var keep = ['sass', 'images', 'fonts', 'js', 'sass/partials', 'sass/partials/components', 'sass/partials/layouts', 'sass/enhancements', 'sass/fallbacks'];

    for (var i in keep) {
      this.copy('gitkeep', this.folder + keep[i] + '/.gitkeep');
    }
  }
});

module.exports = NorthGenerator;
