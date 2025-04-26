import { v4 as uuidv4 } from 'uuid';

export class User {
  private readonly _id: string;
  private _name: string;
  private _email: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    name: string,
    email: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this._id = id || uuidv4();
    this._name = name;
    this._email = email;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
    this._updatedAt = new Date();
  }

  get email(): string {
    return this._email;
  }

  set email(email: string) {
    this._email = email;
    this._updatedAt = new Date();
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
} 