import { strict as assert } from 'assert';

describe('Hello World Test', function() {
  it('should return true', function() {
    assert.strictEqual(true, true);
  });

  it('should check if numbers are equal', function() {
    assert.strictEqual(1 + 1, 2);
  });

  it('should check if strings are equal', function() {
    assert.strictEqual('hello', 'hello');
  });

  it('should check if arrays are equal', function() {
    assert.deepStrictEqual([1, 2, 3], [1, 2, 3]);
  });

  it('should check if objects are equal', function() {
    assert.deepStrictEqual({ name: 'John' }, { name: 'John' });
  });

  it('should check if booleans are equal', function() {
    assert.strictEqual(true, true);
  });

  it('should check if array includes a value', function() {
    assert.ok([1, 2, 3].includes(2));
  });

  it('should check if object has a property', function() {
    assert.ok({ name: 'John' }.hasOwnProperty('name'));
  });

  it('should throw an error', function() {
    assert.throws(() => {
      throw new Error('Error!');
    }, Error);
  });

  it('should test async function', async function() {
    const asyncFunction = () => Promise.resolve('hello');
    const result = await asyncFunction();
    assert.strictEqual(result, 'hello');
  });

  it('should check if dates are equal', function() {
    assert.deepStrictEqual(new Date('2023-01-01'), new Date('2023-01-01'));
  });

  it('should check if functions are equal', function() {
    const func1 = () => {};
    const func2 = func1;
    assert.strictEqual(func1, func2);
  });

  it('should check if Maps are equal', function() {
    assert.deepStrictEqual(new Map([[1, 'a']]), new Map([[1, 'a']]));
  });

  it('should check if Sets are equal', function() {
    assert.deepStrictEqual(new Set([1, 2, 3]), new Set([1, 2, 3]));
  });

  it('should check if NaN is equal to NaN', function() {
    assert.ok(Number.isNaN(NaN));
  });

  it('should check if undefined is equal to undefined', function() {
    assert.strictEqual(undefined, undefined);
  });

  it('should check if null is equal to null', function() {
    assert.strictEqual(null, null);
  });

  it('should check if BigInts are equal', function() {
    assert.strictEqual(BigInt(123), BigInt(123));
  });

  it('should check if Symbols are equal', function() {
    const sym1 = Symbol('foo');
    const sym2 = sym1;
    assert.strictEqual(sym1, sym2);
  });
});