export const flattenMessages = (nestedMessages, prefix = "") => {
  if (nestedMessages === null) {
    return {};
  }
  return Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "string") {
      Object.assign(messages, {[prefixedKey]: value});
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }
    return messages;
  }, {});
};

export const unflattenMessages = (data) => {
  if (Object(data) !== data || Array.isArray(data)) return data;
  const regex = /\.?([^.\[\]]+)$|\[(\d+)\]$/;
  const props = Object.keys(data);
  let result, p;
  while ((p = props.shift())) {
    const m = regex.exec(p);
    let target;
    if (m.index) {
      const rest = p.slice(0, m.index);
      if (!(rest in data)) {
        data[rest] = m[2] ? [] : {};
        props.push(rest);
      }
      target = data[rest];
    } else {
      if (!result) {
        result = m[2] ? [] : {};
      }
      target = result;
    }
    target[m[2] || m[1]] = data[p];
  }
  return result;
};
