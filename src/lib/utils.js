import { xs, lg } from '../renderer/assets/css/variables.scss';

export function useBreakpoints() {
  const getWidth = () => window.innerWidth

  const xs_value = parseInt(xs)
  const lg_value = parseInt(lg)

  const getType = (windowWidth) => {
    if (windowWidth < xs_value - 1) return 'xs'
    if (windowWidth > xs_value && windowWidth < lg_value) return 'md'
    if (windowWidth > lg_value - 1) return 'lg'
  }

  let width = getWidth()
  let type = getType(width)

  return ({ width, type })
}

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

export const isMobile = {
  Android: function() {
      return /Android/i.test(navigator.userAgent);
  },
  BlackBerry: function() {
      return /BlackBerry/i.test(navigator.userAgent);
  },
  iOS: function() {
      return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  },
  Opera: function() {
      return /Opera Mini/i.test(navigator.userAgent);
  },
  Windows: function() {
      return /IEMobile/i.test(navigator.userAgent) || /WPDesktop/i.test(navigator.userAgent);
  },
  any: function() {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
}

export const getBrowserName = () => {
  const test = (regexp) => regexp.test(window.navigator.userAgent);

  switch (true) {
    case test(/edg/i): return 'Edge';
    case test(/trident/i): return 'IE';
    case test(/firefox|fxios/i): return 'Firefox';
    case test(/opr\//i): return 'Opera';
    case test(/ucbrowser/i): return 'UC';
    case test(/samsungbrowser/i): return 'Samsung';
    case test(/chrome|chromium|crios/i): return 'Chrome';
    case test(/safari/i): return 'Safari';
    default: return 'Other';
  }
};
