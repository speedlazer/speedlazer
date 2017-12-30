module.exports = {
  uglifyOptions: {
    compress: {
      unused: true,
      warnings: false,
      comparisons: true,
      conditionals: true,
      negate_iife: false,
      dead_code: true,
      if_return: true,
      join_vars: true,
      evaluate: true,
      drop_debugger: true,
      drop_console: false
    },
    output: {
      comments: false
    },
    ecma: 5, // specify one of: 5, 6, 7 or 8
    keep_classnames: false,
    keep_fnames: false,
    ie8: false,
    nameCache: null, // or specify a name cache object
    safari10: false,
    toplevel: true,
    warnings: false
  },
  sourceMap: true
};
