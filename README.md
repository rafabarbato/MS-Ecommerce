# ms-ecommerce

## Como executar

1. Instale Node.js e Docker Desktop.
2. Clone o repositório e acesse a pasta.
3. Execute `docker-compose up --build`.
4. Envie um pagamento:
   ```sh
   curl -X POST http://localhost:3001/payments -H "Content-Type: application/json" -d '{"userId": 101, "amount": 50.00}'
   ```
5. Veja as notificações no terminal do notification-service.

## Estrutura

- `payment-service`: Serviço de pagamentos (Node.js, Express, Postgres, RabbitMQ)
- `notification-service`: Serviço de notificações (Node.js, RabbitMQ)