import { Omit } from '../'

export const omit = <T extends {}, K extends keyof T>(
  obj: T,
  props: K | K[],
): Omit<T, K> => {
  const propsArray: K[] = Array.isArray(props) ? props : [props]

  return Object.keys(obj).reduce((prev, k) => {
    const key = k as K
    if (!propsArray.includes(key)) {
      prev[key] = obj[key]
    }
    return prev
  }, {} as any)
}

export const pick = <T extends {}, K extends keyof T>(
  obj: T,
  props: K | K[],
): Pick<T, K> => {
  const propsArray: K[] = Array.isArray(props) ? props : [props]

  return Object.keys(obj).reduce((prev, k) => {
    const key = k as K
    if (propsArray.includes(key)) {
      prev[key] = obj[key]
    }
    return prev
  }, {} as any)
}
