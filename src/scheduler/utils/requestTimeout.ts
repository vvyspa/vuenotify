/**
 * Behaves the same as setTimeout except uses requestAnimationFrame() where possible for better performance
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */

type CallbackFn = (...args: any[]) => void

export type FrameState = {
  value: number,
  delta: number
}

export default (fn: any, delay: number) => {
  const start = new Date().getTime()
  const handle: FrameState = {
    value: 0,
    delta: 0
  }

  function loop () {
    const current = new Date().getTime()
    const delta = current - start

    if (delta >= delay) {
      fn.call()
    } else {
      handle.value = requestAnimationFrame(loop)
      handle.delta = delta
    }
  }

  handle.value = requestAnimationFrame(loop)
  return handle
}
