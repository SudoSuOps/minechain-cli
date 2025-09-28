import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const MEMORY_FILE = join(process.cwd(), '.minechain-memory.json');

export function saveMemory(memory: any) {
  try {
    writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
  } catch (error) {
    // Silent fail
  }
}

export function loadMemory(): any {
  try {
    if (existsSync(MEMORY_FILE)) {
      return JSON.parse(readFileSync(MEMORY_FILE, 'utf8'));
    }
  } catch (error) {
    // Silent fail
  }
  return null;
}
