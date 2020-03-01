import { makeArray, isRegex } from '@teclone/utils';

export type Pattern = string | RegExp;

export type Callback = (matches: string[], counts: number) => string;

let replacementText = '';

const callback: Callback = (matches: string[], counts: number) => replacementText;

/**
 * resolve regex pattern, normalizing the modifiers
 */
const resolveRegexPattern = function(pattern: RegExp): RegExp {
  const modifiers = pattern.ignoreCase ? 'gmi' : 'gm';
  return new RegExp(pattern.source, modifiers);
};

/**
 * resolves replaceCount to a number
 */
const resolveReplaceCount = function(replaceCount: boolean | number): number {
  if (typeof replaceCount === 'boolean') {
    return replaceCount ? 1 : -1;
  } else {
    return replaceCount;
  }
};

/**
 * ensure that number of replacement texts at least equals number of patterns
 */
const resolveReplacements = function(
  patterns: Pattern[],
  replacements: string[],
): string[] {
  const patternsCount = patterns.length,
    replacementsCount = replacements.length,
    difference = patternsCount - replacementsCount;

  if (difference > 0) {
    const fillWith = replacements[replacementsCount - 1];
    return [...replacements, ...Array(difference).fill(fillWith)];
  } else {
    return replacements;
  }
};

/**
 * resolve all capturing groups
 */
const resolveCapturingGroups = (
  callback: Callback,
  matches: string[],
  count: number,
): string => {
  const text = callback(matches, count);
  const pattern = resolveRegexPattern(/[$]:(\d+)/);

  let result = '';
  let length = matches.length;
  let startIndex = 0;
  let start = -1;

  while (++start < length) {
    const match = pattern.exec(text);
    if (!match) {
      break;
    }

    const index = match.index;
    const len = match[0].length;

    const current = Number.parseInt(match[1], 10);
    const replacementText = current < length ? matches[current] : match[0];

    result += text.slice(startIndex, index) + replacementText;
    startIndex = index + len;
  }

  result += text.slice(startIndex);
  return result;
};

/**
 * run replacements using regex pattern as search criteria
 */
const runRegex = function(
  pattern: RegExp,
  callback: Callback,
  text: string,
  replaceCount: number,
): string {
  let result: string = '',
    start = 0,
    counts = 0;

  while (++counts && (replaceCount === -1 || counts <= replaceCount)) {
    const matches = pattern.exec(text);
    if (!matches) {
      break;
    }

    const index = matches.index,
      len = matches[0].length;

    result +=
      text.slice(start, index) + resolveCapturingGroups(callback, matches, counts);
    start = index + len;
  }

  result += text.slice(start);
  return result;
};

/**
 * run replacements using string pattern as search criteria
 */
const runString = function(
  pattern: string,
  callback: Callback,
  text: string,
  caseSensitive: boolean,
  replaceCount: number,
) {
  let result: string = '',
    start = 0,
    counts = 0;

  const searchFor = caseSensitive ? pattern : pattern.toLowerCase(),
    searchFrom = caseSensitive ? text : text.toLowerCase(),
    len = pattern.length;

  while (++counts && (replaceCount === -1 || counts <= replaceCount)) {
    const index = searchFrom.indexOf(searchFor, start);
    if (index <= -1) {
      break;
    }

    result +=
      text.slice(start, index) + resolveCapturingGroups(callback, [pattern], counts);
    start = index + len;
  }

  result += text.slice(start);
  return result;
};

const cordinateReplacement = function(
  pattern: Pattern,
  callback: Callback,
  text: string,
  caseSensitive: boolean,
  replaceCount: number,
): string {
  let result: string = '';
  if (isRegex(pattern)) {
    result = runRegex(resolveRegexPattern(pattern), callback, text, replaceCount);
  } else {
    result = runString(pattern, callback, text, caseSensitive, replaceCount);
  }
  return result;
};

/**
 * iteratively replace every occurence of search patterns with the given replacements text in the
 * given text
 * @param patterns - search patterns, can be string or regex expressions,
 * @param replacements - replacement text for each search pattern
 * @param text - the text string to work on
 * @param caseSensitive - specifies if search is case sensitive, this only applies to string
 * patterns. for regex patterns, use RegExp ignoreCase flag (i)
 * @param replaceCount - number of times to replace occurrences for each search pattern. by default
 * all occurrences will be replaced. specify true or 1 to replace only first occurrence.
 */
export const replace = (
  patterns: Pattern | Pattern[],
  replacements: string | string[],
  text: string,
  caseSensitive: boolean = false,
  replaceCount: number | boolean = false,
): string => {
  text = text.toString();

  patterns = makeArray(patterns);
  replacements = resolveReplacements(patterns, makeArray(replacements));
  const count = resolveReplaceCount(replaceCount);

  return patterns.reduce<string>((result, pattern, index: number) => {
    replacementText = replacements[index];
    return cordinateReplacement(pattern, callback, result, caseSensitive, count);
  }, text);
};

/**
 * iteratively replace every occurence of search patterns with the return value of the
 * given callback function in the given text
 * @param patterns - search patterns, can be string or regex expressions,
 * @param callback - the callback function
 * @param text - the text string to work on
 * @param caseSensitive - specifies if search is case sensitive, this only applies to string
 * patterns. for regex patterns, use RegExp ignoreCase flag (i)
 * @param replaceCount - number of times to replace occurrences for each search pattern. by default
 * all occurrences will be replaced. specify true or 1 to replace only first occurrence.
 */
export const replaceCallback = (
  patterns: Pattern | Pattern[],
  callback: Callback,
  text: string,
  caseSensitive: boolean = false,
  replaceCount: number | boolean = false,
): string => {
  text = text.toString();
  const count = resolveReplaceCount(replaceCount);

  return makeArray(patterns).reduce<string>((result, pattern) => {
    return cordinateReplacement(pattern, callback, result, caseSensitive, count);
  }, text);
};
