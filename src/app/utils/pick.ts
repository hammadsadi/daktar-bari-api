const pick = <O extends Record<string, unknown>, K extends keyof O>(
  obj: O,
  keys: K[]
): Partial<O> => {
  const finalObject: Partial<O> = {};
  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObject[key] = obj[key];
    }
  }
  return finalObject;
};

export default pick;
