export type FieldsMap = {
  [key: string | '*']: {
    required: boolean;
    type: 'array' | 'number' | 'string';
    child?: FieldsMap;
  };
};

export const hasRequiredFields = <T>(
  obj: any,
  requiredFields: FieldsMap,
): obj is T => {
  for (const key of Object.keys(requiredFields)) {
    const params = requiredFields[key];
    const objectItem = obj[key];
    if (!params) {
      continue;
    }
    if (obj.hasOwnProperty(key) && objectItem !== undefined) {
      switch (params.type) {
        case 'string':
          if (
            !(typeof objectItem === 'string') ||
            (params.required && !objectItem.length)
          ) {
            return true;
          }
          break;
        case 'array':
          if (!(objectItem instanceof Array)) {
            return true;
          } else if (params.required && !objectItem.length) {
            return true;
          } else if (params.child && objectItem.length) {
            const arrayObject: { [key: number]: any } = {};
            const childForAll = params.child['*'];

            objectItem.map((el, key) => {
              arrayObject[key] = el;
            });

            if (childForAll) {
              const map: FieldsMap = {};
              objectItem.map(({}, key) => {
                map[key] = childForAll;
              });
              return hasRequiredFields(arrayObject, map);
            } else {
              return hasRequiredFields(arrayObject, params.child);
            }
          }
          break;
        case 'number':
          if (!(typeof obj[key] === 'number')) {
            return true;
          }
          break;
      }
    } else if (params.required) {
      return true;
    }
  }
  return false;
};
