import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

import rollupAll from 'rollup-all';

const plugins = [
    resolve({
        extensions: ['.ts', '.js'],
    }),
    babel({
        exclude: 'node_modules/**',
        extensions: ['.ts', '.js']
    }),
];

export default rollupAll.getExports(uglify(), plugins);