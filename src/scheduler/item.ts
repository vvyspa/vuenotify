import requestTimeout, { FrameState } from './utils/requestTimeout'
import { STATUS, ERRORS_ITEM } from './consts'
import { isNumber } from './utils/numbers'
import { isObject } from './utils/objects'

let itemID: number = 0

class SchedulerItem {
  public value = {}
  readonly id = itemID++
  private _timeout = {
    value: 0,
    delta: 0
  }
  private _time = 0
  private _status = STATUS.HOLD
  private _delta = 0
  constructor (value: object = {}, time: number = 0) {
    if (!isNumber(time)) {
      throw new Error(ERRORS_ITEM.TIME_IS_NUMBER)
    }

    this._time = time

    if (!isObject(value)) {
      throw new Error(ERRORS_ITEM.VALUE_IS_OBJECT)
    }

    this.value = { ...value }
  }

  public get status (): string {
    return this._status
  }

  public get delta (): number {
    return this._delta
  }

  public get time (): number {
    return this._time
  }

  public get timeout (): FrameState {
    return this._timeout
  }

  public run (): Promise<void> {
    return new Promise((resolve) => {
      if (this.isStatus(STATUS.HOLD) || this.isStatus(STATUS.STOPPED)) {
        this.changeStatus(STATUS.PENDING)
        this._timeout = requestTimeout(() => {
          this.finish()
          resolve()
        }, this._delta || this._time)
      } else {
        resolve()
      }
    })
  }

  public stop (): void {
    if (this.isStatus(STATUS.PENDING)) {
      this._delta = this._time - this._timeout.delta
      cancelAnimationFrame(this._timeout.value)
      this.changeStatus(STATUS.STOPPED)
    }
  }

  public finish (): void {
    cancelAnimationFrame(this._timeout.value)
    this._timeout = {
      value: 0,
      delta: 0
    }
    this._delta = 0
    this.changeStatus(STATUS.FINISHED)
  }

  public isStatus (status: string): boolean {
    return this.status === status
  }

  private changeStatus (status: string): void {
    this._status = status
  }
}
export default SchedulerItem
