
import { assert } from 'chai';
import { preventChanges } from '../../src/services';

var hookBefore;
var hookAfter;
var hookFindPaginate;
var hookFind;

describe('services preventChanges', () => {
  describe('allowed for before patch', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'patch',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' } };
    });
    
    it('does not throw on before patch', () => {
      preventChanges('x')(hookBefore);
    });

    ['before', 'after'].forEach(type => {
      ['find', 'get', 'create', 'update', 'patch', 'remove'].forEach(method => {
        if (type !== 'before' || method !== 'patch') {
          it(`throws on ${type} ${method}`, () => {
            hookBefore.type = type;
            hookBefore.method = method;
            assert.throws(() => preventChanges('name')(hookBefore));
          });
        }
      });
    });
  });
  
  describe('checks props', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'patch',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe', a: { b: undefined, c: { d: { e: 1 } } } } };
    });
    
    it('does not throw if props not found', () => {
      preventChanges('name', 'address')(hookBefore);
      preventChanges('name.x', 'x.y.z')(hookBefore);
    });
  
    it('throw if props found', () => {
      assert.throw(() => preventChanges('name', 'first')(hookBefore));
      assert.throw(() => preventChanges('name', 'a')(hookBefore));
      assert.throw(() => preventChanges('name', 'a.b')(hookBefore));
      assert.throw(() => preventChanges('name', 'a.c')(hookBefore));
      assert.throw(() => preventChanges('name', 'a.c.d.e')(hookBefore));
    });
  });
});
