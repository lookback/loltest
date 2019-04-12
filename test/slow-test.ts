import assert from 'assert';
import { test } from '../';

test('Before slow test', () => {
    assert.equal(2, 2);
});

test('Slow test', async () => {
    return new Promise(rs => {
        setTimeout(() => {
            assert.equal(2, 2);
            rs();
        }, 3000);
    });
});

test('After slow test', () => {
    assert.equal(2, 2);
});
