
/* eslint-disable */

// This is no where close to a full test of the function parser. Check its repo for tests.
// This just tries to catch obvious bugs in the parser.

const assert = require('chai').assert;
const getParameterNames = require('../lib/promisify').getParameterNames;

describe('getParameterNames', () => {
  describe('function', () => {
    it('named with args with whitespace', () => {
      assert.deepEqual(
        getParameterNames(function abc ( a , b   ,   c  )   {

        }),
        ['a', 'b', 'c']
      );
    });

    it('named with args without whitespace', () => {
      assert.deepEqual(
        getParameterNames(function abc(a,b,c){}),
        ['a', 'b', 'c']
      );
    });

    it('named without args with whitespace', () => {
      assert.deepEqual(
        getParameterNames(function abc(   ){}),
        []
      );
    });

    it('named without args without whitespace', () => {
      assert.deepEqual(
        getParameterNames(function abc(){}),
        []
      );
    });

    it('named 1 arg without whitespace', () => {
      assert.deepEqual(
        getParameterNames(function abc(a){}),
        ['a']
      );
    });

    it('unnamed with args with whitespace', () => {
      assert.deepEqual(
        getParameterNames(function ( a , b   ,   c  )   {

        }),
        ['a', 'b', 'c']
      );
    });

    it('unnamed with args without whitespace', () => {
      assert.deepEqual(
        getParameterNames(function(a,b,c){}),
        ['a', 'b', 'c']
      );
    });

    it('unnamed without args without whitespace', () => {
      assert.deepEqual(
        getParameterNames(function(){}),
        []
      );
    })
  });

  describe('arrow function', () => {
    it('with args with whitespace', () => {
      assert.deepEqual(
        getParameterNames( ( a , b   ,   c  )  =>   {

        }),
        ['a', 'b', 'c']
      );
    });

    it('with args without whitespace', () => {
      assert.deepEqual(
        getParameterNames((a,b,c)=>{}),
        ['a', 'b', 'c']
      );
    });

    it('without args with whitespace', () => {
      assert.deepEqual(
        getParameterNames((   )  =>  {}),
        []
      );
    });

    it('without args without whitespace', () => {
      assert.deepEqual(
        getParameterNames(()=>{}),
        []
      );
    });

    it('1 arg in parenthesis without whitespace', () => {
      assert.deepEqual(
        getParameterNames((a)=>{}),
        ['a']
      );
    });

    it('1 arg without parenthesis with whitespace', () => {
      assert.deepEqual(
        getParameterNames(a  =>  {  }),
        ['a']
      );
    });

    it('1 arg without parenthesis without whitespace', () => {
      assert.deepEqual(
        getParameterNames(a=>{}),
        ['a']
      );
    });
  });

  describe('default values', () => {
    /* node 4 doesn't allow ...params. uncomment this code when 4 support drops Apr 2018. LOL.
    it('named with args with whitespace', () => {
      assert.deepEqual(
        getParameterNames(function abc  ( a  = 1  ,  b=2,  c  =  {}){}),
        ['a', 'b', 'c']
      );
    });

    it('unnamed with args with whitespace', () => {
      assert.deepEqual(
        getParameterNames(function  ( a  = 1  ,  b=2,  c  =  {}){}),
        ['a', 'b', 'c']
      );
    });

    it('arrow function with args with whitespace', () => {
      assert.deepEqual(
        getParameterNames(  ( a  = 1  ,  b=2,  c  =  {})   =>   {}),
        ['a', 'b', 'c']
      );
    });

    it('arrow function with args with default arrow function 1 arg', () => {
      assert.deepEqual(
        getParameterNames(  ( a  = 1  ,  b=2,  c  =  (err)=>{})   =>   {}),
        ['a', 'b', 'c']
      );
    });
    */

    /* *********************************************************************************************
    // parsing package has a bug with this. returns a, b, c, data. Also with ( c=()=>{} )
    it('arrow function with args with default arrow function 2 args', () => {
      assert.deepEqual(
        getParameterNames(  ( a  = 1  ,  b=2,  c  =  (err, data)=>{})   =>   {}),
        ['a', 'b', 'c']
      );
    });
    ********************************************************************************************* */
  });
});

/* eslint-enable */
