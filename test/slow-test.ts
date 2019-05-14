import assert from 'assert';
import { test } from '../';

const delay = (ms: number) => new Promise((rs) => setTimeout(rs, ms));

test('Before slow test', () => {
    assert.equal(2, 2);
});

test('Kinda slow test', async () => {
    await delay(400);
    assert.equal(2, 2);
});

test('Slow test', async () => {
    await delay(3000);
    assert.equal(2, 2);
});

test('After slow test', () => {
    assert.equal(2, 2);
});
