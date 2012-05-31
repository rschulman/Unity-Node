{print} = require 'util'
{exec} = require 'child_process'
task 'build', 'Build project from src/*.coffee to lib/*.js', ->
    exec 'coffee --compile --output lib/ src/', (err, stdout, stderr) ->
        throw err if err
        console.log stdout + stderr
    exec 'coffee --compile app.coffee', (err, stdout, stderr) ->
        throw err if err
        console.log stdout + stderr

task 'test', 'Run the mocha tests', ->
    exec 'mocha --colors --compilers coffee:coffee-script -R spec', (err, stdout, stderr) ->
        print stdout if stdout?
        print stderr if stderr?