export interface Char {
  char: string;
  charState?: CharState;
}

export enum CharState {
  REMOVED = 'removed',
  ADDED = 'added'
}
