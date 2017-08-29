const parallastic = (scrollable = window) => {
  const listeners = []
  const eventTarget = scrollable
  const propertyProvider = scrollable === window ? document.body : scrollable

  const handleScroll = (e) => {
    const toRemove = []
    // Give every listener a chance
    for (const listener of listeners) {
      const ret = listener(e)
      if (ret) toRemove.push(listener)
    }
    // Remove the ones which reported they are done
    // (Not removed before because can't remove during for on same array)
    for (const listener of toRemove) {
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

  const addToggler = (target, className, position, reverse) => {
    // Add the listener and return it so it can be removed
    return addListener((e) => {
      const delta = target.getBoundingClientRect().top
      const percent = 1 - delta / propertyProvider.clientHeight
      if (percent >= position) {
        target.classList.add(className)
        return !reverse
      } else if (reverse) {
        target.classList.remove(className)
      }
    })
  }

  const addProportional = (target, yStart, yEnd, property, propertyStart, propertyEnd, opts = {}) => {
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
      let percent = (propertyProvider.scrollTop - thisYStart) / (thisYEnd - thisYStart)
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
    forceUpdate: handleScroll
  }
}

module.exports = parallastic
