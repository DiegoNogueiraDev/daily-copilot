import { v4 as uuidv4 } from 'uuid';

export type Tag = {
  id?: string;
  name: string;
};

export type Blocker = {
  id?: string;
  name: string;
};

export type Suggestion = {
  id?: string;
  text: string;
};

export class Summary {
  private readonly _id: string;
  private _text: string;
  private _date: Date;
  private readonly _userId: string;
  private readonly _projectId: string;
  private _tags: Tag[];
  private _blockers: Blocker[];
  private _suggestions: Suggestion[];
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    text: string,
    userId: string,
    projectId: string,
    date?: Date | string,
    tags: Tag[] = [],
    blockers: Blocker[] = [],
    suggestions: Suggestion[] = [],
    id?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this._id = id || uuidv4();
    this._text = text;
    this._userId = userId;
    this._projectId = projectId;
    
    // Normalize date format
    if (typeof date === 'string') {
      this._date = new Date(date);
    } else {
      this._date = date || new Date();
    }
    
    this._tags = tags;
    this._blockers = blockers;
    this._suggestions = suggestions;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
  }

  get id(): string {
    return this._id;
  }

  get text(): string {
    return this._text;
  }

  set text(text: string) {
    this._text = text;
    this._updatedAt = new Date();
  }

  get date(): Date {
    return this._date;
  }

  set date(date: Date | string) {
    if (typeof date === 'string') {
      this._date = new Date(date);
    } else {
      this._date = date;
    }
    this._updatedAt = new Date();
  }

  get userId(): string {
    return this._userId;
  }

  get projectId(): string {
    return this._projectId;
  }

  get tags(): Tag[] {
    return [...this._tags];
  }

  set tags(tags: Tag[]) {
    this._tags = tags;
    this._updatedAt = new Date();
  }

  addTag(tag: Tag): void {
    if (!this._tags.some(t => t.name === tag.name)) {
      this._tags.push(tag);
      this._updatedAt = new Date();
    }
  }

  get blockers(): Blocker[] {
    return [...this._blockers];
  }

  set blockers(blockers: Blocker[]) {
    this._blockers = blockers;
    this._updatedAt = new Date();
  }

  addBlocker(blocker: Blocker): void {
    if (!this._blockers.some(b => b.name === blocker.name)) {
      this._blockers.push(blocker);
      this._updatedAt = new Date();
    }
  }

  get suggestions(): Suggestion[] {
    return [...this._suggestions];
  }

  set suggestions(suggestions: Suggestion[]) {
    this._suggestions = suggestions;
    this._updatedAt = new Date();
  }

  addSuggestion(suggestion: Suggestion): void {
    this._suggestions.push(suggestion);
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
      text: this._text,
      date: this._date,
      userId: this._userId,
      projectId: this._projectId,
      tags: this._tags,
      blockers: this._blockers,
      suggestions: this._suggestions,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
} 