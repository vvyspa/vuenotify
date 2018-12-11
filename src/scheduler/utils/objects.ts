export const isObject = (value: object) => !Array.isArray(value) && typeof value === 'object'
