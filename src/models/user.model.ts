import ModelInterface from './model.interface';

import { ModelErrorFields } from './../exceptions/model.exception';
import { FieldsMap, hasRequiredFields } from './../utils/objects';

export default interface UserInterface extends ModelInterface {
  username: string;
  age: number;
  hobbies: string[];
}

const requiredFields: FieldsMap = {
  username: {
    required: true,
    type: 'string',
  },
  age: {
    required: true,
    type: 'number',
  },
  hobbies: {
    required: false,
    type: 'array',
    child: <FieldsMap>{
      '*': {
        required: true,
        type: 'string',
      },
    },
  },
};

export const createUserModel = (obj: object): UserInterface => {
  if (hasRequiredFields<UserInterface>(obj, requiredFields)) {
    throw new ModelErrorFields();
  }
  const newObject = obj as UserInterface;
  newObject.hobbies = newObject.hobbies ?? [];

  return newObject;
};
