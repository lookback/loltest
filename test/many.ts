import assert from 'assert';
import { test } from '../';

Array
    .from({length: 20})
    .map(() => {
        test('It works', () => {
            assert.equal(2, 2);
        });
    });
