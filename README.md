<img src="loltest.png" alt="Loltest" width="500">

Bare minimum test runner for Typescript projects.

## CLI

```
loltest [file filter] [test name filter]

[file filter]: string. If provided, we'll only include files whose names start with this string.
[test name filter]: string|pattern. If provided, we'll only include tests whose names match this pattern.

Env vars
==========
LOLTEST_TEST_DIR: string. Change test directory from the default `test` in current working directory.
LOLTEST_REPORTER: 'loltest | loltest2 | tap'. Change from default `loltest`.
```

## Usage

In `package.json`:

```json
  "scripts": {
      "test": "loltest"
  }
```

In `test/foo.ts`:

```typescript
import assert from 'assert';
import { test } from 'loltest';

test('It works', () => {
    assert.deepEqual(2, 4);
});
```

Run like this:

```bash
$ npm test
```

That's it!

### Select test file

If you want to run for a single file, provide a portion of the filename as argument to `loltest`:

```bash
$ ls test/
one-test.ts  another-test.ts
$ npm test -- another
# Only another-test.ts will be run
```

**Note:** Do not include the path to the test directory when specifying a single file.

### Single test in file

If you want to run a subset of tests in a file, you can provide a filter on their names as a second argument to `loltest`: 

```ts
// my-test.ts
import { test } from 'loltest';

test('Test for normal array', () => { /* ...  */ });

test('Test for empty array', () => { /* ...  */ });

test('Test for null array', () => { /* ...  */ });
```
```bash
$ npm test -- my-test empty
# Will only run tests matching /empty/
$ npm test -- my-test "empty|null"
# Will only run tests matching /empty|null/
```

**Note:** Your shell might dislike some regex symbols in the test name filter. You might want to wrap them in quotes.

### Reporters

We bundle these reporters:

- `loltest` *(default)*
- `loltest2`
- `tap`

Choose between reporters with the `LOLTEST_REPORTER` environment variable.

```bash
$ LOLTEST_REPORTER=tap npx loltest
```

# Layout

Tests must be in the directory `<my_project>/test/`. Any test file with a name starting
`_` will be ignored.
