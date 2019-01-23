loltest
=======

Bare minimum test runner for typescript.

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
import { it } from 'loltest';

it('Works', () => {
    assert.deepEqual(2, 4);
});
```

Run like this:

```bash
$ npm test
...
✗ foo.ts Works: 2 deepEqual 4
```

### Select test file

Write some starting letters of the test file name to run
the tests in that file.

```bash
$ ./node_modules/.bin/loltest fo
```
