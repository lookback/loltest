import assert from 'assert';
import { test, TestMeta } from '../';

test(
    'Before gets testMeta',
    async (meta: TestMeta) => {
        assert.deepEqual(meta, {
            testCaseName: 'Before gets testMeta',
        });
    },
    async () => {
        return new Promise((rs) => {
            assert.ok('Pass');
            rs();
        });
    }
);

test(
    'Before return is passed to test case',
    async () => {
        return { cool: 42 };
    },
    async ({ cool }) => {
        assert.equal(cool, 42);
        return new Promise((rs) => {
            assert.ok('Pass');
            rs();
        });
    }
);

test(
    'Before return is passed to test case with meta',
    async () => {
        return { cool: 42 };
    },
    async ({ cool, testCaseName }) => {
        assert.equal(cool, 42);
        assert.equal(
            testCaseName,
            'Before return is passed to test case with meta'
        );
        return new Promise((rs) => {
            assert.ok('Pass');
            rs();
        });
    }
);

test(
    'Before return is passed to after',
    async () => {
        return { cool: 42 };
    },
    async () => {
        return new Promise((rs) => {
            assert.ok('Pass');
            rs();
        });
    },
    async ({ cool }) => {
        assert.equal(cool, 42);
    },
);

test(
    'Before return is passed to after with meta',
    async () => {
        return { cool: 42 };
    },
    async () => {
        return new Promise((rs) => {
            assert.ok('Pass');
            rs();
        });
    },
    async ({ cool, testCaseName }) => {        
        assert.equal(cool, 42);
        assert.equal(
            testCaseName,
            'Before return is passed to after with meta'
        );
    },
);
