import axios from 'axios'

export type ResponseType = {
  headers: object
  statusCode: number
  statusMessage: string
  body: string
}

export const postRequest = (options: any, data?: string): Promise<ResponseType> => {
  return new Promise((resolve, reject) => {
    const headers = options.headers || {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    }
    axios({ method: 'post', url: options.url, data, headers })
      .then(res => {
        const resp = {
          headers: res.headers,
          statusCode: res.status,
          statusMessage: res.statusText,
          body: res.data,
        }
        resolve(resp)
      })
      .catch(err => {
        const res = err.response
        reject(new Error(`${res.status} - ${res.statusText} : ${res.data}`))
      })
  })
}
