const isDev = process.env.NODE_ENV === 'development';

function log(...args) {
  if (isDev) {
    console.log(...args);
  }
}

function error(...args) {
  if (isDev) {
    console.error(...args);
  }
}

const logger = { log, error };
export default logger;
