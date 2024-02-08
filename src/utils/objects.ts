export type FieldsMap = {
  [key: string | 'all']: {
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
    if (!params) {
      continue;
    }
    if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
      switch (params.type) {
        case 'string':
          if (!(typeof obj[key] === 'string')) {
            return true;
          }
          break;
        case 'array':
          if (!(obj[key] instanceof Array)) {
            return true;
          } else if (params.required && !obj[key].length) {
            return true;
          } else if (params.child && obj[key].length) {
            const arrayObject: Array<any> = obj[key];
            if (params.child.all) {
              const map = {};
              const object = Object.assign({}, ...arrayObject);
              arrayObject.reduce((result, el, index) => {
                result[index] = el;
                return result;
              }, map);
              return hasRequiredFields(object, map);
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
