import { Request, Response } from 'express';
import db from '../config/db';
import { publishToQueue } from '../config/rabbitmq';

export async function createPayment(req: Request, res: Response) {
  const { userId, amount } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO payments (user_id, amount, status) VALUES ($1, $2, $3) RETURNING *',
      [userId, amount, 'pendente']
    );

    const payment = result.rows[0];

    // Notificar recebimento
    publishToQueue({
      type: 'transaction_received',
      userId,
      paymentId: payment.id,
      amount
    });

    // Confirmar após 5 segundos
    setTimeout(async () => {
      await db.query('UPDATE payments SET status = $1 WHERE id = $2', ['sucesso', payment.id]);

      publishToQueue({
        type: 'transaction_confirmed',
        userId,
        paymentId: payment.id,
        amount
      });
    }, 5000);

    res.status(201).json(payment);
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    res.status(500).json({ error: 'Erro interno ao processar pagamento' });
  }
}