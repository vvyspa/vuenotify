import Scheduler from '@/scheduler'
import Vue from 'vue'

export type Args = {
  autorun?: boolean,
  autoremove?: boolean,
  name?: string
}

const Vuenotify = {
  install(Vue: Vue, args: Args = {
    autorun: true,
    autoremove: true
  }) {
    const name = args.name ? args.name : 'vuenotify'

    Vue.prototype['$' + name] = new Scheduler(args)
  }
}

export default Vuenotify
