/* eslint-disable import/order */
import 'module-alias/register';
/* eslint-enable import/order */

import { LoggerProvider } from '@logging';
import { Worker } from '@workers';

const logger = LoggerProvider.getLogger();
const worker = new Worker();

worker.start();

 process.on('SIGTERM', async () => {
    logger.info('Shutting down...');
    worker.stop();
    logger.info('Shut down');
    process.exit(0);
  });
