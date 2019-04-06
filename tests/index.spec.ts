import {replace, replaceCallback} from '../src/index';

describe('Regex module', function() {

    describe(`.replace(patterns: Pattern | Pattern[], replacements: string | string[], text: string,
        caseSensitive: boolean = false, replaceCount: number | boolean = false): string`, function() {

        it(`can accept a search string as pattern and replace all occurrences in the given
            text string using the given replacement string while ignoring string cases`, function() {
            const text = 'Obi is a girl';
            expect(replace('Obi', 'Ada', text)).toEqual('Ada is a girl');
            expect(replace('obi', 'Ada', text)).toEqual('Ada is a girl');
        });

        it(`can accept a Regex expression as pattern and replace all matching occurrences in the given
            text string using the given replacement string`, function() {
            const text = '2222 is a number';
            expect(replace(/\d/, '1', text)).toEqual('1111 is a number');
         });

        it(`should resolve the replacement string and replace capturing placeholders with their
            corresponding values. the capturing placeholders should be in the format $:number,
            eg. $:1`, function() {
            expect(replace(/(\d+)/, '$$:1', '2222 is the amount')).toEqual('$2222 is the amount');
            expect(replace(/(\d+)\.(\d+)/, '$$:2.$:1', '33.22 is the amount')).toEqual('$22.33 is the amount');
         });

         it(`should resolve the replacement string and replace capturing placeholders with their
        corresponding values. leaving capturing groups that does not exist`, function() {
            expect(replace(/(\d+)/, '$$:2', '2222 is the amount')).toEqual('$$:2 is the amount');
            expect(replace(/(\d+)/, '$$:1', '2222 is the amount')).toEqual('$2222 is the amount');
            expect(replace(/(\d+)\.(\d+)/, '$$:2.$:3', '33.22 is the amount')).toEqual('$22.$:3 is the amount');
         });

        it(`should respect case if caseSensitive parameter is set to true and search pattern is a string`, function() {
            const text = 'Obi is a girl';
            expect(replace('Obi', 'Ada', text, true)).toEqual('Ada is a girl');
            expect(replace('obi', 'Ada', text, true)).toEqual(text);
        });

        it(`should respect case if the regex pattern does not have the case insensitive
            flag, even when the caseSensitive parameter is set to true`, function() {
            const text = 'my name is Harrison';
            expect(replace(/harrison/, 'Ifeanyichukwu', text, true)).toEqual(text);
            expect(replace(/harrison/i, 'Ifeanyichukwu', text, true)).toEqual('my name is Ifeanyichukwu');
        });

        it(`should replace all occurences if the replaceCount is false or if it is a negative
            number`, function() {
            const text = '2222 is four twos';
            expect(replace(['2', 'twos'], ['1', 'ones'], text)).toEqual('1111 is four ones');
            expect(replace([/\d/, 'twos'], ['1', 'ones'], text, false, -1)).toEqual('1111 is four ones');
        });

        it(`should replace only the first occurrence of each search pattern if the replaceCount
            is true or if it is equal to 1`, function() {
            const text = '2222 is four twos';
            expect(replace(['2', 'twos'], ['1', 'ones'], text, false, 1)).toEqual('1222 is four ones');
            expect(replace([/\d/, 'twos'], ['1', 'ones'], text, false, 1)).toEqual('1222 is four ones');

            expect(replace(['2', 'twos'], ['1', 'ones'], text, false, true)).toEqual('1222 is four ones');
            expect(replace([/\d/, 'twos'], ['1', 'ones'], text, false, true)).toEqual('1222 is four ones');
        });

        it(`should replace as many occurrences of each search pattern as the given replaceCount
            if the given replaceCount is a non negative number`, function() {
            const text = '2222 is four twos';
            expect(replace(['2', 'twos'], ['1', 'ones'], text, false, 2)).toEqual('1122 is four ones');
            expect(replace([/\d/, 'twos'], ['1', 'ones'], text, false, 2)).toEqual('1122 is four ones');

            expect(replace(['2', 'twos'], ['1', 'ones'], text, false, 0)).toEqual('2222 is four twos');
            expect(replace([/\d/, 'twos'], ['1', 'ones'], text, false, 0)).toEqual('2222 is four twos');
        });

        it(`should use the last replacement text to make up for missing replacement texts if
        search patterns exceed replacement texts`, function() {
            const text = '2345 is four twos';
            expect(replace(['2', '3', '4', '5'], '2', text)).toEqual('2222 is four twos');
            expect(replace([/2/, /3/, /4/, /5/], '2', text)).toEqual('2222 is four twos');
        });
    });

    describe(`.replaceCallback(patterns: Pattern | Pattern[], callback: Callback, text: string,
        caseSensitive: boolean = false, replaceCount: number | boolean = false): string`, function() {

        it(`should replace all occurrences by calling callback on every match and using the callback's
        return value`, function() {
            const text = 'Obi is a girl';
            expect(replaceCallback('Obi', () => 'Ada', text)).toEqual('Ada is a girl');
        });

        it(`should call callback passing in two arguments, the match array and the current
        replacement count`, function() {
            const callback = jest.fn((matches, count) => 'Ada');
            const text = 'Obi is a girl';
            expect(replaceCallback('Obi', callback, text)).toEqual('Ada is a girl');
            expect(callback.mock.calls[0][0]).toEqual(['Obi']);
            expect(callback.mock.calls[0][1]).toEqual(1);
        });
    });
});