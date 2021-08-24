import path from 'path'

import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import replace from '@rollup/plugin-replace'

import { chromeExtension, simpleReloader } from 'rollup-plugin-chrome-extension'
import { emptyDir } from 'rollup-plugin-empty-dir'
import zip from 'rollup-plugin-zip'

const isProduction = process.env.NODE_ENV === 'production'

export default {
  input: 'src/manifest.json',
  output: {
    dir: 'dist',
    format: 'es',
    chunkFileNames: path.join('chunks', '[name]-[hash].js'),
  },
  plugins: [
    chromeExtension({ browserPolyfill: true, dynamicImportWrapper: false }),
    // Adds a Chrome extension reloader during watch mode
    simpleReloader(),
    resolve(),
    commonjs(),
    typescript(),
    // Empties the output dir before a new build
    emptyDir(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),

    // Outputs a zip file in ./releases
    isProduction && zip({ dir: 'releases' }),
  ],
}
