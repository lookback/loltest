import assert from 'assert';
import { test } from '../';
import { mkParseArgs } from '../src/lib/parse-cli-args';

test('Parse args from an array', () => {
    const parse = mkParseArgs({
        '--foo': String,
        '--switch': Boolean,
        '--count': Number,
    });

    const result = parse(['--count', '3', '--switch', '--foo', 'lol']);

    assert.deepEqual(result, {
        '--count': 3,
        '--foo': 'lol',
        '--switch': true,
    });
});

test('Parse empty args array', () => {
    const parse = mkParseArgs({
        '--foo': String,
    });

    const res = parse([]);

    assert.ok(res);
});
