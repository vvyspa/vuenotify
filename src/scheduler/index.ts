import SchedulerItem from './item'
import { STATUS, ERRORS_SCHEDULER, WARNS_SCHEDULER } from './consts'
import { isNumber } from './utils/numbers'
import { isProduction } from './utils/env'
import Vue from 'vue'
import { Args } from '@/vue-plugin'

export const createItem = (items: SchedulerItem[], ...opts: [object, number]): SchedulerItem[] => {
  const item = new SchedulerItem(...opts)
  return [...items, item]
}

export const removeItem = (items: SchedulerItem[], id: number): SchedulerItem[] => {
  if (!isNumber(id)) {
    throw new Error(ERRORS_SCHEDULER.ID_IS_NUMBER)
  }
  return items.filter((item) => item.id !== id)
}

export const stop = (items: SchedulerItem[]) => {
  const pendingItem = items.find((item) => item.isStatus(STATUS.PENDING))
  if (pendingItem) {
    pendingItem.stop()
  }
}

export default class Scheduler {
  private _items: SchedulerItem[] = []
  private _autorun: boolean = true
  private _autoremove: boolean = true
  private _pending: boolean = false
  private _changed: boolean = false
  private _stopped: boolean = false
  constructor (args: Args = {}) {
    this._autorun = !!args.autorun
    this._autoremove = !!args.autoremove
    Vue.util.defineReactive(this, '_items', [])
  }
  public get items () {
    return [...this._items]
  }
  public createItem (...opts: [object, number]) {
    this._items = createItem(this._items, ...opts)
    this.runAutorun()
  }
  public removeItem (id: number) {
    this._items = removeItem(this._items, id)
  }
  public clearItems () {
    this._items = []
  }
  public async run () {
    if (!this._pending) {
      this._pending = true
      this._stopped = false
      for (const item of this._items) {
        await item.run()
        if (this._autoremove) {
          this._items = removeItem(this._items, item.id)
        }
      }
      this._pending = false
      await this.runChanged()
    }
  }
  private async runChanged () {
    if (this._changed) {
      this._changed = false
      await this.run()
    }
  }
  private runAutorun () {
    if (this._autorun && !this._stopped) {
      if (this._pending) {
        this._changed = true
      } else {
        this.run()
      }
    }
  }
  public stop () {
    this._stopped = true
    this._pending = false
    stop(this._items)
  }
}
