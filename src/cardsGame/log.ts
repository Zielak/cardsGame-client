enum LogLevels {
  silent,
  error,
  warn,
  info,
  notice,
  verbose
}

let logLevel = LogLevels.silent

export const log = {
  error(...args) {
    if (logLevel < LogLevels.error) return
    console.error.call(console, ...args)
  },
  warn(...args) {
    if (logLevel < LogLevels.warn) return
    console.warn.call(console, ...args)
  },
  info(...args) {
    if (logLevel < LogLevels.info) return
    console.info.call(console, ...args)
  },
  notice(...args) {
    if (logLevel < LogLevels.notice) return
    console.log.call(console, ...args)
  },
  verbose(...args) {
    if (logLevel < LogLevels.verbose) return
    // TODO: add gray styles or something. It's low importance logs
    console.log.call(console, ...args)
  }
}

const setLogLevel = (val: string) => {
  switch (val) {
    case 'silent':
      logLevel = LogLevels.silent
      break
    case 'error':
      logLevel = LogLevels.error
      break
    case 'warn':
      logLevel = LogLevels.warn
      break
    case 'info':
      logLevel = LogLevels.info
      break
    case 'notice':
      logLevel = LogLevels.notice
      break
    case 'verbose':
      logLevel = LogLevels.verbose
      break
    case 'true':
      logLevel = LogLevels.notice
      break
    default:
      logLevel = LogLevels.silent
  }
}

try {
  if (localStorage && localStorage.getItem('cardsDebug')) {
    setLogLevel(localStorage.getItem('cardsDebug'))
  }
} catch (e) {
  // disabled
}
