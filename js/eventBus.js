const listeners = new Map();

export function on(eventName, callback) {
  if (!listeners.has(eventName)) {
    listeners.set(eventName, new Set());
  }
  listeners.get(eventName).add(callback);
  return () => off(eventName, callback);
}

export function off(eventName, callback) {
  const eventSet = listeners.get(eventName);
  if (!eventSet) {
    return;
  }
  eventSet.delete(callback);
  if (eventSet.size === 0) {
    listeners.delete(eventName);
  }
}

export function emit(eventName, payload) {
  const eventSet = listeners.get(eventName);
  if (!eventSet) {
    return;
  }
  eventSet.forEach((cb) => cb(payload));
}
