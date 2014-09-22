var fs = require('fs');
var chalk = require('chalk');
var path = require('path');
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');

module.exports.workingDir = function (base) {
  var dir = path.basename(process.cwd()).toLowerCase();
  switch (dir) {
    case 'components':
      if (base === 'components') {
        return '.';
      }
      else if (base === 'layouts') {
        return '../' + base;
      }
    case 'layouts':
      if (base === 'components') {
        return '../' + base;
      }
      else if (base === 'layouts') {
        return '.';
      }
    case 'partials':
      return './' + base;
    case 'sass':
    case 'scss':
      return './partials/' + base;
    default:
      if (fs.existsSync('sass')) {
        return './sass/partials/' + base;
      }
      else if (fs.existsSync('scss')) {
        return './scss/partials/' + base;
      }
      else {
        return false;
      }
      break;
  }
}

module.exports.sassDir = function (base) {
  var path = base.split('/');
  if (path[0] === '..') {
    return '../../';
  }
  else if (path[0] === '.') {
    if (path.length === 2) {
      return '../';
    }
    else if (path.length === 3) {
      return './';
    }
    else if (path.length === 4) {
      return './sass/';
    }
    else {
      return '../../';
    }
  }
}

module.exports.welcome = function () {
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

module.exports.import = function (section, pattern, dir) {
  var files = fs.readdirSync(dir);
  var imported = false;
  files.forEach(function (k, v) {
    var extension = k.split('.').pop();
    if (extension === 'scss' || extension === 'sass') {
      var content = decoder.write(fs.readFileSync(dir + k));
      var startSearch = '//////////////////////////////\n// ' + section.toUpperCase();
      var start = content.indexOf(startSearch);
      if (start >= 0) {
        var end = content.indexOf('//////////////////////////////', start + startSearch.length);

        var importString = '@import "partials/' + section + '/' + pattern + '"';
        if (extension === 'scss') {
          importString += ';';
        }
        importString += '\n';

        var output = [content.slice(0, end), importString, content.slice(end)].join('');


        fs.writeFileSync(dir + k, output);
        console.log('Updated ' + chalk.magenta(dir + k));
        imported = true;
      }
    }
  });

  if (!imported) {
    console.log('Now import ' + chalk.magenta('partials/' + section + '/' + pattern) + ' into your Sass file');
  }
}

module.exports.patterns = function (rootDir) {
  var dirs, file, filePath, files, stat, _i, _len;
  files = fs.readdirSync(rootDir);
  dirs = [];
  for (_i = 0, _len = files.length; _i < _len; _i++) {
    file = files[_i];
    if (file[0] !== '.') {
      filePath = "" + rootDir + "/" + file;
      stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        dirs.push(file);
      }
    }
  }
  return dirs;
}

module.exports.pkg = function (runner, server) {
  var pkg = {
    'name': 'project',
    'version': '0.0.0',
    'dependencies': {},
    'devDependencies': {
      'compass-options': '^0.1',
      'browser-sync': '^1.3'
    }
  };

  if (runner.toLowerCase() === 'grunt') {
    pkg.devDependencies.grunt = '^0.4';
    pkg.devDependencies.matchdep = '^0.3';
  }
  else if (runner.toLowerCase() === 'gulp') {
    pkg.devDependencies.gulp = '^3.6';
    pkg.devDependencies['gulp-css-target'] = '^0.1';
    pkg.devDependencies['jshint-stylish'] =  '^0.4';
    pkg.devDependencies['gulp-jshint'] = '^1.8';
  }

  return pkg;
}
