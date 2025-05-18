import express from 'express';
import { connectRabbitMQ } from './config/rabbitmq';
import paymentRoutes from './routes/payment.routes';

const app = express();
app.use(express.json());
app.use('/payments', paymentRoutes);

app.listen(3001, async () => {
  console.log('🚀 Payment Service rodando na porta 3001');
  await connectRabbitMQ();
});