const parallastic = (scrollable = window) => {
  const listeners = []
  const eventTarget = scrollable
  const propertyProvider = scrollable === window ? document.body : scrollable

  const handleScroll = (e) => {
    const toRemove = []
    // Give every listener a chance
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      const ret = listener(e)
      if (ret) toRemove.push(listener)
    }
    // Remove the ones which reported they are done
    // (Not removed before because can't remove during for on same array)
    for (let i = 0; i < toRemove.length; i++) {
      const listener = toRemove[i]
      removeListener(listener)
    }
  }

  const addListener = (func) => {
    listeners.push(func)
    if (listeners.length === 1) {
      eventTarget.addEventListener('scroll', handleScroll)
    }
    return func
  }

  const removeListener = (func) => {
    const idx = listeners.indexOf(func)
    if (idx >= 0) listeners.splice(idx, 1)
    if (listeners.length === 0) {
      eventTarget.removeEventListener('scroll', handleScroll)
    }
    return func
  }

  const teardown = () => {
    if (listeners.length > 0) {
      eventTarget.removeEventListener('scroll', handleScroll)
    }
    listeners.splice(0, listeners.length)
  }

  const addToggler = (target, className, position, opts = {}) => {
    if (!target) {
      console.warn('AddToggler: No target specified.')
      return
    }
    // Accept previous "reverse" parameter for now
    if (opts === true) opts = { reverse: true }
    const classTarget = opts.classTarget || target
    // Add the listener and return it so it can be removed
    return addListener((e) => {
      const delta = target.getBoundingClientRect().top
      const percent = 1 - delta / propertyProvider.clientHeight
      if (percent >= position) {
        classTarget.classList.add(className)
        return !opts.reverse
      } else if (opts.reverse) {
        classTarget.classList.remove(className)
      }
    })
  }

  const addProportional = (target, yStart, yEnd, property, propertyStart, propertyEnd, opts = {}) => {
    if (!target) {
      console.warn('AddProportional: No target specified.')
      return
    }
    return addListener((e) => {
      const ref = opts.ref || propertyProvider
      let thisYStart = yStart
      let thisYEnd = yEnd
      if (opts.units === '%') {
        thisYStart *= ref.clientHeight / 100
        thisYEnd *= ref.clientHeight / 100
      }
      thisYStart += ref.offsetTop
      thisYEnd += ref.offsetTop
      if (opts.ref) thisYStart -= propertyProvider.clientHeight
      const scrollTop = propertyProvider.scrollTop || window.scrollY
      let percent = (scrollTop - thisYStart) / (thisYEnd - thisYStart)
      if (percent < 0) percent = 0
      if (percent > 1) percent = 1
      let value = propertyStart + percent * (propertyEnd - propertyStart)
      if (opts.prefix) value = opts.prefix + value
      if (opts.suffix) value += opts.suffix
      target.style[property] = value
    })
  }

  return {
    addToggler: addToggler,
    addProportional: addProportional,
    removeListener: removeListener,
    forceUpdate: handleScroll,
    teardown: teardown
  }
}

module.exports = parallastic
