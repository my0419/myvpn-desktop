const VOWELS = 'aeiou'.split('')
const CONSONANTS = 'bcdfghjklmnprstvwxyz'.split('')
const VOWELS_LENGTH = VOWELS.length
const CONSONANTS_LENGTH = CONSONANTS.length

export function generateRandomString (length) {
  let result = ''
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function generateHumanString (length) {
  let randomstring = ''
  let salt = Math.floor(Math.random() * 2)
  for (let i = length + salt, end = 0 + salt; i > end; i -= 1) {
    if (i % 2 === 0) {
      randomstring += CONSONANTS[Math.floor(Math.random() * CONSONANTS_LENGTH)]
    } else {
      randomstring += VOWELS[Math.floor(Math.random() * VOWELS_LENGTH)]
    }
  }
  return randomstring
}

export function validateIPaddress (ipaddress) {
  return (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))
}