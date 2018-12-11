export const STATUS = {
  HOLD: 'hold',
  STOPPED: 'stopped',
  PENDING: 'pending',
  FINISHED: 'finished'
}
export const ERRORS_ITEM = {
  TIME_IS_NUMBER: 'time should be a number',
  VALUE_IS_OBJECT: 'You have to pass object as value to new scheduler item'
}
export const ERRORS_SCHEDULER = {
  ID_IS_NUMBER: 'id should be a number'
}
export const WARNS_SCHEDULER = {
  IS_RUNING: 'Scheduler is already running',
  NO_PENDING_ITEM: 'There is no item with pending status'
}
