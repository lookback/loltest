import assert from 'assert';
import { test } from '../';

Array.from({ length: 10 }).map((_, i) => {
    test(`Many works ${i}`, () => {
        assert.equal(2, 2);
    });
});
