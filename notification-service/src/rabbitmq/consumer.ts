import * as amqp from 'amqplib';

export async function consumeFromQueue() {
  const queue = 'payment-notify';
  let retries = 5;

  while (retries) {
    try {
      const connection = await amqp.connect('amqp://admin:admin@rabbitmq:5672');
      const channel = await connection.createChannel();

      await channel.assertQueue(queue);
      console.log(`📡 Aguardando mensagens na fila: ${queue}`);

      channel.consume(queue, (msg) => {
        if (msg) {
          const data = JSON.parse(msg.content.toString());

          switch (data.type) {
            case 'transaction_received':
              console.log(`📬 Notificação: Solicitação recebida para pagamento ${data.paymentId} (usuário ${data.userId})`);
              break;
            case 'transaction_confirmed':
              console.log(`✅ Notificação: Pagamento ${data.paymentId} confirmado para usuário ${data.userId}`);
              break;
            default:
              console.warn('⚠️ Tipo de mensagem desconhecido:', data);
          }

          channel.ack(msg);
        }
      });

      break;
    } catch (err) {
      console.error('❌ Erro ao consumir mensagens do RabbitMQ:', (err as Error).message);
      retries--;
      console.log(`⏳ Tentando novamente... (${5 - retries}/5)`);
      await new Promise(res => setTimeout(res, 5000));
    }
  }

  if (retries === 0) {
    throw new Error('❌ Não foi possível conectar ao RabbitMQ após várias tentativas.');
  }
}