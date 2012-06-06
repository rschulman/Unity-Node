chai = require 'chai'
chai.should()

Player = require '../src/player'

describe 'Player instance', ->
    player = new Player 'Ross', 'ross', 1, 0, 1, 2, 'abcd', 18, 16, 16, 12, 0
    player2 = new Player 'Ross', 'ross', 1, 99, 1, 2, 'abcd', 18, 16, 16, 12, 15
    player3 = new Player 'Ross', 'ross', 1, 101, 1, 2, 'abcd', 18, 16, 16, 12, 15
    it 'should have a name', ->
        player.name.should.equal 'Ross'
    it 'should have a password', ->
        player.pass.should.equal 'ross'
    it 'should have a dlvl', ->
        player.dlvl.should.equal 1
    it 'should have an x and y', ->
        player.x.should.equal 1
        player.y.should.equal 2
    it 'should have an xp', ->
        player.xp.should.equal 0
    it 'should have a str amount', ->
        player.str.should.exist
    it 'should have a dex amount', ->
        player.dex.should.exist
    it 'should have a int amount', ->
        player.int.should.exist
    it 'should have a con amount', ->
        player.con.should.exist
    it 'should compute player level', ->
        player.getXPLevel().should.equal 1
        player2.getXPLevel().should.equal 1
        player3.getXPLevel().should.equal 2
    it 'should compute max HP', ->
        player.maxHP.should.equal 15