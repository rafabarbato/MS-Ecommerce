import * as amqp from 'amqplib';

let channel: amqp.Channel;

export async function connectRabbitMQ() {
  let retries = 5;

  while (retries) {
    try {
      const connection = await amqp.connect('amqp://admin:admin@rabbitmq:5672');
      channel = await connection.createChannel();

      await channel.assertQueue('payment-notify');
      console.log('✅ Conectado ao RabbitMQ (payment-service)');
      break;
    } catch (err) {
      console.error(`❌ Erro ao conectar ao RabbitMQ: ${(err as Error).message}`);
      retries--;
      console.log(`⏳ Tentando novamente... (${5 - retries}/5)`);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }

  if (!channel) {
    throw new Error('❌ Falha ao conectar ao RabbitMQ após várias tentativas.');
  }
}

export function publishToQueue(message: object) {
  if (!channel) {
    console.error('❌ Canal RabbitMQ não inicializado.');
    return;
  }

  channel.sendToQueue('payment-notify', Buffer.from(JSON.stringify(message)));
  console.log('📨 Mensagem publicada na fila: payment-notify', message);
}