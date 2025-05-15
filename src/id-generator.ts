import { v4 as uuidv4 } from "uuid";

export type EntityId = string;

export class IdGenerator {
  constructor() {}
  generate(): EntityId {
    return uuidv4();
  }
}
