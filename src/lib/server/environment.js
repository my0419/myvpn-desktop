/**
 * Converts the object to ENV Variable format
 */
class Environment {

  /**
   * @param {Object} variables - object with key / value
   */
  constructor (variables) {
    this.variables = variables
  }

  /**
   * Convert params to array of string env
   *
   * @returns {[]}
   */
  convertToArray() {
    let envArray = []
    Object.keys(this.variables).forEach((key) => {
      const value = this.variables[key]
      let envValue = null
      switch (typeof value) {
        case 'string':
        case 'number':
          envValue = value
          break
        case 'boolean':
          envValue = value ? '1' : '0'
          break
        case 'object':
          if (Array.isArray(value)) {
            /**
             * Convert object: "vpn_user": [{ "login": "val1", "pass": "val2" }, ...]
             * to: VPN_USER_LOGIN_1=val1, VPN_USER_PASS_1=val2
             */
            value.forEach((subValue, index) => {
              Object.keys(subValue).forEach((objKey) => {
                const objValue = subValue[objKey]
                envArray.push(`${key.toUpperCase()}_${objKey.toUpperCase()}_${index+1}=${objValue}`)
              })
            })
            break
          }
        default:
          throw new Error(`Invalid type "${typeof value}" of environment value.`)
      }

      if (envValue !== null) {
        envArray.push(`${key.toUpperCase()}=${envValue}`)
      }
    });

    return envArray
  }

  /**
   * Convert params to string env
   *
   * @param prefix - optional
   * @returns {string}
   */
  convertToString(prefix) {
    let envArray = this.convertToArray()
    if (prefix) {
      envArray = envArray.map((val, key) => {
        return `${prefix}${val}`
      })
    }
    return envArray.join("\n")
  }

}

export default Environment