import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
const terser = require('rollup-plugin-terser').terser

export default [
  {
    input: 'index.js',
    output: {
      file: 'dist/vue-timers.esm.js',
      format: 'es'
    },
    plugins: [
      resolve(),
      // use own babel config to compile
      babel({
        exclude: 'node_modules/**',
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false
            }
          ]
        ],
        plugins: ['@babel/plugin-external-helpers'],
        babelrc: false
      }),
      terser()
    ]
  },
  {
    input: 'index.js',
    output: {
      file: 'dist/vue-timers.umd.js',
      format: 'umd',
      name: 'vueTimers'
    },
    plugins: [
      resolve(),
      // use own babel config to compile
      babel({
        exclude: 'node_modules/**',
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false
            }
          ]
        ],
        plugins: ['@babel/plugin-external-helpers'],
        babelrc: false
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      terser()
    ]
  }
]
