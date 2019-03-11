import assert from 'assert';
import { test } from '../';

test('It works', () => {
    assert.equal(2, 2);
});

test('This fails', () => {
    assert.equal(2, 4);
});

test('Deep equal', () => {
    assert.deepEqual({ foo: 'bar' }, { bar: 'foo' });
});
