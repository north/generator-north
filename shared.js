var fs = require('fs');
var chalk = require('chalk');
var path = require('path');

module.exports.workingDir = function () {
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