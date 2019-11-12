export const ping = {
  mean: (values) => {
    let sum = 0
    values.forEach((value) => {
      sum = sum + value
    })
    return sum / values.length
  },
  median: (values) => {
    values.sort((a, b) => {
      return a - b
    })
    let half = Math.floor(values.length / 2)
    if (values.length % 2) {
      return values[half]
    } else {
      return (values[half - 1] + values[half]) / 2.0
    }
  },
  lowest: (values) => {
    return Math.min.apply(null, values)
  },
  highest: (values) => {
    return Math.max.apply(null, values)
  },
  highlight: (values, stepValue) => {
    values = values.sort(function (a, b) {
      if (a < b) {
        return -1
      } else if (a > b) {
        return 1
      } else {
        return 0
      }
    })
    let leastLatency = values[0]
    let mostLatency = values[values.length - 1]
    let diffLatency = mostLatency - leastLatency
    return 'hsl(' + ((mostLatency - stepValue) * 135 / diffLatency) + ', 100%, 50%)'
  }
}
