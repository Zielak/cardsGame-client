const METHODS = ['log', 'warn', 'info', 'error']
const NOOP = () => { }

export let log = () => { }

METHODS.forEach(methodName => log[methodName] = NOOP)
log.enabled = false

try {
  if (localStorage && localStorage.getItem('debug') === 'true') {
    log = console.log.bind(console)
    METHODS.forEach(methodName => log[methodName] = console[methodName].bind(console))
    log.enabled = true
  }
} catch (e) {
  // disabled
}
