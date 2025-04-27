import { v4 as uuidv4 } from 'uuid';

export type ErrorType = 'build' | 'test' | 'lint' | 'typecheck' | 'runtime';

export type ErrorSeverity = 'critical' | 'high' | 'medium' | 'low';

export class BuildError {
  private readonly _id: string;
  private _message: string;
  private _stack?: string;
  private _type: ErrorType;
  private _severity: ErrorSeverity;
  private _file?: string;
  private _line?: number;
  private _column?: number;
  private _projectId: string;
  private _userId: string;
  private _solved: boolean;
  private _solutionApplied?: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    message: string,
    type: ErrorType,
    severity: ErrorSeverity,
    projectId: string,
    userId: string,
    stack?: string,
    file?: string,
    line?: number,
    column?: number,
    id?: string,
    solved = false,
    solutionApplied?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this._id = id || uuidv4();
    this._message = message;
    this._stack = stack;
    this._type = type;
    this._severity = severity;
    this._file = file;
    this._line = line;
    this._column = column;
    this._projectId = projectId;
    this._userId = userId;
    this._solved = solved;
    this._solutionApplied = solutionApplied;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
  }

  get id(): string {
    return this._id;
  }

  get message(): string {
    return this._message;
  }

  set message(message: string) {
    this._message = message;
    this._updatedAt = new Date();
  }

  get stack(): string | undefined {
    return this._stack;
  }

  set stack(stack: string | undefined) {
    this._stack = stack;
    this._updatedAt = new Date();
  }

  get type(): ErrorType {
    return this._type;
  }

  set type(type: ErrorType) {
    this._type = type;
    this._updatedAt = new Date();
  }

  get severity(): ErrorSeverity {
    return this._severity;
  }

  set severity(severity: ErrorSeverity) {
    this._severity = severity;
    this._updatedAt = new Date();
  }

  get file(): string | undefined {
    return this._file;
  }

  set file(file: string | undefined) {
    this._file = file;
    this._updatedAt = new Date();
  }

  get line(): number | undefined {
    return this._line;
  }

  set line(line: number | undefined) {
    this._line = line;
    this._updatedAt = new Date();
  }

  get column(): number | undefined {
    return this._column;
  }

  set column(column: number | undefined) {
    this._column = column;
    this._updatedAt = new Date();
  }

  get projectId(): string {
    return this._projectId;
  }

  get userId(): string {
    return this._userId;
  }

  get solved(): boolean {
    return this._solved;
  }

  set solved(solved: boolean) {
    this._solved = solved;
    this._updatedAt = new Date();
  }

  get solutionApplied(): string | undefined {
    return this._solutionApplied;
  }

  set solutionApplied(solution: string | undefined) {
    this._solutionApplied = solution;
    if (solution) {
      this._solved = true;
    }
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
      message: this._message,
      stack: this._stack,
      type: this._type,
      severity: this._severity,
      file: this._file,
      line: this._line,
      column: this._column,
      projectId: this._projectId,
      userId: this._userId,
      solved: this._solved,
      solutionApplied: this._solutionApplied,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
} 