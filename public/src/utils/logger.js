/**
 * Centralized application logger.
 *
 * Logs are shown only in development mode.
 * Production builds automatically suppress them.
 */

const DEBUG = import.meta.env.DEV;

export const logger = {
  log: (...args) => {
    if (DEBUG) console.log(...args);
  },

  info: (...args) => {
    if (DEBUG) console.info(...args);
  },

  warn: (...args) => {
    if (DEBUG) console.warn(...args);
  },

  error: (...args) => {
    if (DEBUG) console.error(...args);
  },

  table: (...args) => {
    if (DEBUG) console.table(...args);
  },

  group: (...args) => {
    if (DEBUG) console.group(...args);
  },

  groupCollapsed: (...args) => {
    if (DEBUG) console.groupCollapsed(...args);
  },

  groupEnd: () => {
    if (DEBUG) console.groupEnd();
  },

  time: (label) => {
    if (DEBUG) console.time(label);
  },

  timeEnd: (label) => {
    if (DEBUG) console.timeEnd(label);
  }
};

export default logger;