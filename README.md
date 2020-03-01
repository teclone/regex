# Regex

[![Build Status](https://travis-ci.org/teclone/regex.svg?branch=master)](https://travis-ci.org/teclone/regex)
[![Coverage Status](https://coveralls.io/repos/github/teclone/regex/badge.svg?branch=master)](https://coveralls.io/github/teclone/regex?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![npm version](https://badge.fury.io/js/%40teclone%2Fregex.svg)](https://badge.fury.io/js/%40teclone%2Fregex)
![npm](https://img.shields.io/npm/dt/%40teclone%2Fregex.svg)

Regex is a module that builds on the existing `RegExp` module, making it easier working with text matching and replacment in JavaScript both in the `browser` and in `Node.JS` environment.

**Single Browser distributable bundle is located inside **dist** folder.**

## Installation

```bash
npm install @teclone/regex
```

## Usage Sample

```typescript
import { replace } from '@teclone/regex';

let text = 'Is is Is is Is';

console.log(replace('is', 'are', text)); // are are are are are

// respect case (case sensitive)
console.log(replace('is', 'are', text, true)); // Is are Is are Is

// replace only first occurence, case sensitive false
console.log(replace('is', 'are', text, false, 1)); // are is Is is Is

// replace only first 2 occurences, case sensitive false
console.log(replace('is', 'are', text, false, 2)); // are are Is is Is
```

## Replacing with a Callback method

```typescript
import { replaceCallback } from '@teclone/regex';

const text = 'He loves her';
console.log(
  replaceCallback(
    ['he', 'she'],
    function(matches, count) {
      if (matches[0].toLowerCase() === 'he') return 'She';
      else {
        return 'him';
      }
    },
    text,
  ),
); // logs She loves him
```

## Referencing captured groups in replacement text

to reference a captured parameter in replacement text, use the format `$:number`. e.g **\$:1**, **\$:2**, **\$:3**

```typescript
import {replace} from '@teclone/regex';

const text = '2222 is the amount';
console.log(
    replace(/(\d+)/, '$$:1', text)).toEqual('$2222 is the amount')
);
```
