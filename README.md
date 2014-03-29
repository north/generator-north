# Generator North [![NPM version](https://badge.fury.io/js/generator-north.png)](http://badge.fury.io/js/generator-north)

```
               /\\
              //@\\
             // @@\\
            //  @@@\\
           //   @@@@\\
          //    @@@@@\\         ___   ___    _____    ______    _________   ___  ___
          //    @@@@@\\        |NNN\ |NNN|  /O.-.O\  |RRRRRR\  |TTTTTTTTT| |HHH||HHH|
         //     @@@@@@\\        |NNN\ |N|  |O|   |O|  |R|__)R| |T| |T| |T|  |H|__|H|
        //      @@@@@@@\\       |N|\N\|N|  |O|   |O|  |RRRRR/      |T|      |HHHHHH|
       //       @@@@@@@@\\      |N| \NNN|  |OO`-'OO|  |R|  \R\_    |T|      |H|  |H|
       //       @@@@@@@@\\     |NNN| \NN|   \OOOOO/  |RRR| |RRR|  |TTT|    |HHH||HHH|
      //        @@@@@@@@@\\
     //         @@@@@@@@@@\\
    //        // \\@@@@@@@@\\
   //      //       \\@@@@@@\\
  //  //                 \\@@\\
  ////                     \\\\
```

> A [Yeoman](http://yeoman.io) generator for [North](http://pointnorth.io)

## Getting Started

### What is Yeoman?

Trick question. It's not a thing. It's this guy:

![](http://i.imgur.com/JHaAlBJ.png)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```
$ npm install -g yo
```

He also likes to bundle up his [Sassy](http://sass-lang.com/) friends. You only need to get his [packaging tape](http://bundler.io/) once, and then he'll be set. His tape lives in the [RubyGems](http://rubygems.org/) package repository.

```
$ gem install bundler
```

### Yeoman Generators

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a Backbone application or even a Chrome extension.

To install generator-north from npm, run:

```
$ npm install -g generator-north
```

Finally, initiate the generator:

```
$ yo north
```

### Using the North generator

The North generator provides a simple way to scaffold out a project following the [North](http://pointnorth.io) standards. The main generator will create a full project for you with Sass, Compass, Bundler, Bower, and JSHint set up and ready to go. You can choose to initialize a task runner, either [Grunt](http://gruntjs.com/) or [Gulp](http://gulpjs.com/), which will then come with a task for linting your JavaScript files (`grunt lint` or `gulp lint`). There are also a handful of useful options you can use when initializing the North generator (space separated):

* `--init` - Initialize the current directory instead of creating a new directory
* `--git` - Initialize your project with Git
* `--skip-install` - Skips the installation process for Bundler, Bower, and (if needed) NPM.

The North generator also provides a simple way to scaffold out the partial structure for new [Components](http://pointnorth.io/#components) or [Layouts](http://pointnorth.io/#layouts). Run either of the following commands from either the root of your project (one step below your `sass` folder) or from within your `sass` folder, replacing `{name}` with the name of your component or layout:

```
$ yo north:component {name}
```

or

```
$ yo north:layout {name}
```

You will then be guided through the steps to create a new component or layout with your given name and be given the ability to add [Aspects](http://pointnorth.io/#aspects).

### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).


## License

MIT
