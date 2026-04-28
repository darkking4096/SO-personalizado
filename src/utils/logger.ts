/**
 * Logger Utility
 * Centralized logging for development and debugging
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export class Logger {
  private static logLevel = LogLevel.INFO

  static setLogLevel(level: LogLevel) {
    this.logLevel = level
  }

  static debug(message: string, ...args: unknown[]) {
    if (this.logLevel <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...args)
    }
  }

  static info(message: string, ...args: unknown[]) {
    if (this.logLevel <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, ...args)
    }
  }

  static warn(message: string, ...args: unknown[]) {
    if (this.logLevel <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, ...args)
    }
  }

  static error(message: string, error?: Error) {
    if (this.logLevel <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, error || '')
    }
  }

  static group(label: string) {
    console.group(label)
  }

  static groupEnd() {
    console.groupEnd()
  }
}
