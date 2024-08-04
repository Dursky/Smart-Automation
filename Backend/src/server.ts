import { app, httpServer } from './app';
import config from './config';

const PORT = config.port;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
