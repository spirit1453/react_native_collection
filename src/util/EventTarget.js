class EventTarget {
  static _listeners=new Map();

  static on (event, fun) {
    let ary = EventTarget._listeners.get(event)
    if (!ary) {
      ary = []
      EventTarget._listeners.set(event, ary)
    }
    if (ary.indexOf(fun) === -1) {
      ary.push(fun)
    }
  }
  static un (event, fun) {
    let ary = EventTarget._listeners.get(event)
    ary.splice(ary.indexOf(fun), 1)
  }
  static fire (event, params) {
    let ary = EventTarget._listeners.get(event)
    if (ary) {
      ary.forEach(function (o) {
        o(params)
      })
    }
  }
}

export default EventTarget
