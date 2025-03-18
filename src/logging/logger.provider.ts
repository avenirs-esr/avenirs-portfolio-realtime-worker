import pino from 'pino';

export class LoggerProvider {
  private static instance: pino.Logger;

  private constructor() {}

  public static getLogger(source?: string): pino.Logger {
    if (!LoggerProvider.instance) {
      console.log(`LoggerProvider  ${process.env.NODE_ENV})}`);
      const isDev = process.env.NODE_ENV == 'dev';

      LoggerProvider.instance = pino(
        isDev
          ? {
              level: 'trace',
              transport: {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'HH:MM:ss Z',
                  ignore: 'pid,hostname,source',
                  messageFormat: '{source} - {msg}',
                },
              },
            }
          : { level: 'info' }
      );
    }
    
    return source 
      ? LoggerProvider.instance.child({ source })
      : LoggerProvider.instance;
  }

  public static getLoggerForClass<T>(classType: new (...args: any[]) => T): pino.Logger {
    return this.getLogger(classType.name);
  }
}
