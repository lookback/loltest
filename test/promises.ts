import assert from 'assert';
import { test } from '../';

test('Returning a promise works', async () => {
    return new Promise((rs) => {
        assert.ok('Pass');
        rs();
    });
});
