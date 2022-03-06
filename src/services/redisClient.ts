import * as redis from 'redis';

const client = redis.createClient();

client.on('connect', () => {
  console.log('Client connected to redis...');
});

client.on('ready', () => {
  console.log('Client connected to redis and ready to use...');
});

client.on('error', (error: { message: string }) => {
  console.log(error.message);
});

client.on('end', () => {
  console.log('Client disconnected from redis');
});

process.on('SIGINT', () => {
  client.quit();
});

export default client;
