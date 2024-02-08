import { UUID } from '../db';

export default interface User {
  id?: UUID;
  username: string;
  age: number;
  hobbies: string[];
}
