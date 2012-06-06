chai = require 'chai'
chai.should()

Mob = require '../src/mob'
rat = {}

describe 'Mob', ->
    before (done) ->
        rat = new Mob 'rat', (obby) ->
            done()

    describe 'creation', () ->
        it 'should have a type', ->
            rat.mobtype.should.equal 'rat'
        it 'should have an hp', ->
            rat.hp.should.equal 4
        it 'should have an AC', ->
            rat.AC.should.equal 15
        it 'should have an associated character', ->
            rat.character.should.equal 'r'

    describe 'AI', ->
        it 'should plan and make a decision', ->
            rat.nextMove()[0].should.equal "move"