import { Doc } from 'yjs';

let ydoc: Doc | null = null;

export function getYDoc() {
  if (!ydoc) {
    ydoc = new Doc();
  }
  return ydoc;
}
