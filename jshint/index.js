'use strict';
var util = require('util'),
    chalk = require('chalk'),
    yeoman = require('yeoman-generator'),
    shared = require('../shared.js'),
    fs = require('fs-extra');


var NorthGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    if (fs.existsSync('package.json')) {
      this.pkg = fs.readJsonSync('package.json');
    }

    // Set the runner from config or options
    if (this.config.get('runner')) {
      this.runner = this.config.get('runner');
    }
    if (this.options.runner) {
      this.runner = this.options.runner;
    }

    if (this.options['no-gemfile']) {
      this['no-gemfile'] = this.options['no-gemfile'];
    }

    if (this.options['no-package']) {
      this['no-package'] = this.options['no-package'];
    }
  },

  prompting: function () {
    var done = this.async(),
        runner = this.runner,
        prompts = [];

    if (!runner) {
      prompts.push({
        type: 'list',
        name: 'projectRunner',
        message: 'What task runner would you like to use?',
        choices: ['Gulp', 'None'],
        default: 'Gulp'
      });

      this.prompt(prompts, function (props) {
        this.runner = props.projectRunner;
        this.config.set('runner', props.projectRunner);
        done();
      }.bind(this));
    }
    else {
      done();
    }
  },

  configuring: function () {
    //////////////////////////////
    // Runner and Runner Exists
    //////////////////////////////
    var runner = this.runner,
        runnerExists = true,
        pkgExists = true,
        pkgUpdate = false,
        deps,
        depKeys;

    if (runner.toLowerCase() === 'none') {
      runner = false;
    }
    if (runner && !fs.existsSync(runner + 'file.js')) {
      runnerExists = false;
    }

    this.runner = runner;
    this.runnerExists = runnerExists;

    //////////////////////////////
    // Check to see if package exists, and if it doesn't create it
    //////////////////////////////
    if (runner && !fs.existsSync('package.json')) {
      pkgExists = false;
      this.pkg = shared.pkg(runner);

      if (this['no-package'] !== true) {
        fs.outputJsonSync('package.json', this.pkg);
      }
    }

    this.pkgExists = pkgExists;

    if (runner) {
      //////////////////////////////
      // Update Package file, if needed
      //////////////////////////////
      deps = this.pkg.devDependencies;
      depKeys = Object.keys(deps);

      if (depKeys.indexOf('jshint-stylish') === -1) {
        deps['jshint-stylish'] = '^0.4';
        pkgUpdate = true;
      }

      if (depKeys.indexOf('gulp-jshint') === -1) {
        deps['gulp-jshint'] = '^1.8';
        pkgUpdate = true;
      }

      if (depKeys.indexOf('compass-options') === -1) {
        deps['compass-options'] = '^0.1';
        pkgUpdate = true;
      }

      if (depKeys.indexOf('browser-sync') === -1) {
        deps['browser-sync'] = '^1.3';
        pkgUpdate = true;
      }

      if (this['no-package'] === true) {
        pkgUpdate = false;
      }

      if (pkgUpdate) {
        this.pkg.devDependencies = deps;
        fs.outputJsonSync('package.json', this.pkg);

        if (!pkgExists) {
          this.log(chalk.green('   create ') + 'package.json');
        }
        else {
          this.log(chalk.yellow('   update ') + 'package.json');
        }

      }
    }

    //////////////////////////////
    // Add JSHint
    //////////////////////////////
    this.copy('jshintrc', '.jshintrc');
  },

  writing: function () {
    var runner = this.runner,
        taskExists = false,
        runnerExists = true,
        pkgFile,
        deps,
        depKeys,
        runnerFile;

    //////////////////////////////
    // Check to see if runner file exists, and if it doesn't create it
    //////////////////////////////
    if (this.runner && !this.runnerExists) {

      runnerFile = '\'use strict\';\n\n' +
        'var gulp = require(\'gulp\'),\n' +
        '    paths = require(\'compass-options\').paths();\n';

      if (this['no-gemfile'] !== true) {
        fs.outputFileSync(runner + 'file.js', runnerFile);
      }


    }

    //////////////////////////////
    // Check to see if updating the runner is needed
    //////////////////////////////
    if (fs.existsSync(runner + 'file.js')) {
      runnerFile = fs.readFileSync(runner + 'file.js', 'utf8');
      runnerFile += '\n//////////////////////////////\n' +
          '// Begin Lint Tasks\n' +
          '//////////////////////////////\n';

      if (runnerFile.indexOf('require(\'./tasks/jshint\')') > -1) {
        taskExists = true;
      }
      else {
        runnerFile += 'require(\'./tasks/jshint\')';
      }
    }

    if (this['no-gemfile'] === true) {
      taskExists = true;
    }

    //////////////////////////////
    // Only run the runner stuff if runner !== none
    //////////////////////////////
    if (runner) {
      //////////////////////////////
      // Update Runner, if needed
      //////////////////////////////
      this.copy('lint--' + runner.toLowerCase() + '.js', 'tasks/jshint.js');
      if (!taskExists) {
        runnerFile += '(' + runner.toLowerCase() + ');\n';
        fs.outputFileSync(runner + 'file.js', runnerFile);
        if (!runnerExists) {
          this.log(chalk.green('   create ') + runner + 'file.js');
        }
        else {
          this.log(chalk.yellow('   update ') + runner + 'file.js');
        }

      }
    }
  },

  install: function () {
    if (!this.options['skip-install']) {
      this.installDependencies({
        bower: false,
        npm: true
      });
    }
  }
});

module.exports = NorthGenerator;
