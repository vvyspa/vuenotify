import SchedulerItem from '@/scheduler/item'
import { STATUS, ERRORS_ITEM } from '@/scheduler/consts'

let spy

afterEach(() => {
  if (spy) {
    spy.mockClear()
  }
})

describe('Scheduler Item', () => {
  it('should create new item with default setup', () => {
    const item = new SchedulerItem()
    expect(item).toEqual({
      id: 0,
      _time: 0,
      _status: STATUS.HOLD,
      _delta: 0,
      _timeout: {
        value: 0,
        delta: 0
      },
      value: {}
    })
  })

  it('should assign object to value when passed as first argument', () => {
    const item1 = new SchedulerItem({ val: 1 })
    const item2 = new SchedulerItem(null)
    expect(item1.value).toEqual({
      val: 1
    })
    expect(item2.value).toEqual({})
  })

  it('should throw error if first argument is not an object', () => {
    expect(() => new SchedulerItem(1)).toThrowError(ERRORS_ITEM.VALUE_IS_OBJECT)
    expect(() => new SchedulerItem('abc')).toThrowError(ERRORS_ITEM.VALUE_IS_OBJECT)
    expect(() => new SchedulerItem([])).toThrowError(ERRORS_ITEM.VALUE_IS_OBJECT)
    expect(() => new SchedulerItem(() => {})).toThrowError(ERRORS_ITEM.VALUE_IS_OBJECT)
  })

  it('should throw error if second argument is not a number', () => {
    expect(() => new SchedulerItem(null, {})).toThrowError(ERRORS_ITEM.TIME_IS_NUMBER)
    expect(() => new SchedulerItem(null, 'abc')).toThrowError(ERRORS_ITEM.TIME_IS_NUMBER)
    expect(() => new SchedulerItem(null, [])).toThrowError(ERRORS_ITEM.TIME_IS_NUMBER)
    expect(() => new SchedulerItem(null, () => {})).toThrowError(ERRORS_ITEM.TIME_IS_NUMBER)
  })

  describe('run()', () => {
    it('should change status from hold to pending', () => {
      const item = new SchedulerItem(null, 1000)
      expect(item.status).toBe(STATUS.HOLD)
      item.run()
      expect(item.status).toBe(STATUS.PENDING)
    })

    it('should change status to pending after stop', () => {
      const item = new SchedulerItem(null, 1000)
      expect(item.status).toBe(STATUS.HOLD)
      item.run()
      expect(item.status).toBe(STATUS.PENDING)
      item.stop()
      expect(item.status).toBe(STATUS.STOPPED)
      item.run()
      expect(item.status).toBe(STATUS.PENDING)
    })

    it('should call finish function after 1000ms', async () => {
      const item = new SchedulerItem(null, 1000)
      spy = jest.spyOn(SchedulerItem.prototype, 'finish')
      await item.run()
      expect(spy).toHaveBeenCalled()
    })

    it('should call finish function only once if item is already finished', async () => {
      const item = new SchedulerItem(null, 1000)
      spy = jest.spyOn(SchedulerItem.prototype, 'finish')
      await item.run()
      await item.run()
      await item.run()
      await item.run()
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should not reset timeout if called more then one time', (done) => {
      const item = new SchedulerItem(null, 1000)
      item.run()
      setTimeout(() => {
        item.run()
        expect(item.timeout.delta).toBeGreaterThan(400)
        done()
      }, 500)
    })
  })

  describe('stop()', () => {
    it('shoud change delta time when status is pending', (done) => {
      const item = new SchedulerItem(null, 1000)
      expect(item.delta).toBe(0)
      item.run()
      setTimeout(() => {
        item.stop()
        expect(item.delta).toBeGreaterThan(0)
        done()
      }, 100)
    })
    it('shoud change status from pending to stopped', () => {
      const item = new SchedulerItem(null, 1000)
      item.run()
      expect(item.status).toBe(STATUS.PENDING)
      item.stop()
      expect(item.status).toBe(STATUS.STOPPED)
    })
    it('shoud not change status if current status is hold', () => {
      const item = new SchedulerItem(null, 1000)
      expect(item.status).toBe(STATUS.HOLD)
      item.stop()
      expect(item.status).not.toBe(STATUS.STOPPED)
    })
    it('shoud not change status if current status is finished', async () => {
      const item = new SchedulerItem(null, 1000)
      await item.run()
      expect(item.status).toBe(STATUS.FINISHED)
      item.stop()
      expect(item.status).not.toBe(STATUS.STOPPED)
    })
    it('shoud cancel animation frame when stopped', (done) => {
      const item = new SchedulerItem(null, 1000)
      let animationFrame = 0
      item.run()
      item.stop()
      animationFrame = item.timeout.value
      setTimeout(() => {
        expect(item.timeout.value).toBe(animationFrame)
        item.run()
        setTimeout(() => {
          expect(item.timeout.value).toBeGreaterThan(animationFrame)
          done()
        }, 100)
      }, 100)
    })
  })
})
