'use strict';
var util = require('util'),
    chalk = require('chalk'),
    yeoman = require('yeoman-generator'),
    fs = require('fs-extra');


var NorthGenerator = yeoman.generators.Base.extend({
  init: function () {
    if (fs.existsSync('package.json')) {
      this.pkg = fs.readJsonSync('package.json');
    }
  },

  prompts: function () {
    var done = this.async(),
        runner = this.config.get('runner'),
        prompts = [];

    if (!runner) {
      prompts.push({
        type: 'list',
        name: 'projectRunner',
        message: 'What task runner would you like to use?',
        choices: ['Grunt', 'Gulp', 'None'],
        default: 'Gulp'
      });

      this.prompt(prompts, function (props) {
        this.config.set('runner', props.projectRunner);
        done();
      }.bind(this));
    }
    else {
      done();
    }
  },

  build: function () {
    var runner = this.config.get('runner'),
        taskExists = false,
        runnerExists = true,
        pkgUpdate = false,
        deps,
        depKeys,
        runnerFile;

    // If runner is none, it's false
    if (runner.toLowerCase() === 'none') {
      runner = false;
    }

    //////////////////////////////
    // Check to see if runner file exists, and if it doesn't create it
    //////////////////////////////
    if (runner && !fs.existsSync(runner + 'file.js')) {
      runnerExists = false;
      this.server = false;
      this.slug = 'project';

      runnerFile = '\'use strict\';\n\n' +
        'var gulp = require(\'gulp\'),\n' +
        '    paths = require(\'compass-options\').paths();\n';

      fs.outputFileSync(runner + 'file.js', runnerFile);
    }

    if (fs.existsSync(runner + 'file.js')) {
      runnerFile = fs.readFileSync(runner + 'file.js', 'utf8');
      runnerFile += '\n//////////////////////////////\n' +
          '// Begin Lint Tasks\n' +
          '//////////////////////////////\n';

      if (runnerFile.indexOf('require(\'./tasks/lint\')') > -1) {
        taskExists = true;
      }
      else {
        runnerFile += 'require(\'./tasks/lint\')';
      }
    }




    //////////////////////////////
    // Add JSHint
    //////////////////////////////
    this.copy('jshintrc', '.jshintrc');

    //////////////////////////////
    // Only run the runner stuff if runner !== none
    //////////////////////////////
    if (runner) {
      //////////////////////////////
      // Update Runner, if needed
      //////////////////////////////
      this.copy('lint--' + runner.toLowerCase() + '.js', 'tasks/lint.js');
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

      //////////////////////////////
      // Update Package file, if needed
      //////////////////////////////
      if (this.pkg && this.pkg.devDependencies) {
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
          deps['browser-sync'] = '^1.4';
          pkgUpdate = true;
        }

        // if (!runnerExists) {
        //   this.log(chalk.green('   create ') + runner + 'file.js');
        // }
        // else {
        //   this.log(chalk.yellow('   update ') + runner + 'file.js');
        // }

        if (pkgUpdate) {
          this.pkg.devDependencies = deps;
          fs.outputJsonSync('package.json', this.pkg);

          this.log(chalk.yellow('   update ') + 'package.js');
        }

      }
      else {

      }
    }
  }
});

module.exports = NorthGenerator;
