import { consumeFromQueue } from './rabbitmq/consumer';

console.log('🚀 Notification Service iniciando...');
consumeFromQueue();