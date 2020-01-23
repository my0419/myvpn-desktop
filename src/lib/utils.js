export function redirectTo(link, newTab=true) {
  try {
    newTab ? window.open(link, '_blank') : window.open(link, '_self')
  } catch(error) {
    console.log(`error redirect to link ${link}\n${error.message}`)
  }
}

export const localStorageService = {
  set(key, value) {
    localStorage.setItem(key, value)
  },
  get(key) {
    return localStorage.getItem(key)
  },
  remove(key) {
    localStorage.removeItem(key, value)
  }
}
