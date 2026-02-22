export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.info(message, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(message, ...args);
  },
  debug: (message: string, ...args: unknown[]) => {
    console.debug(message, ...args);
  },
};
