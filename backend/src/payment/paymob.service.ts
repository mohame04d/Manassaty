import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymobService {
  private readonly apiKey = process.env.PAYMOB_API_KEY || 'dummy_api_key';
  private readonly integrationId = process.env.PAYMOB_INTEGRATION_ID || 'dummy_integration_id';

  async authenticate(): Promise<string> {
    if (this.apiKey === 'dummy_api_key') return 'dummy_token';

    const response = await fetch('https://accept.paymob.com/api/auth/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: this.apiKey })
    });
    const data = await response.json();
    return data.token;
  }

  async registerOrder(authToken: string, amountCents: number, merchantOrderId: string): Promise<string> {
    if (authToken === 'dummy_token') return `order_${merchantOrderId}`;

    const response = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: 'false',
        amount_cents: amountCents,
        currency: 'EGP',
        merchant_order_id: merchantOrderId,
        items: []
      })
    });
    const data = await response.json();
    return data.id;
  }

  async getPaymentKey(authToken: string, orderId: string, amountCents: number, billingData: any): Promise<string> {
    if (authToken === 'dummy_token') return 'dummy_payment_key';

    const response = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: amountCents,
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          apartment: 'NA',
          email: billingData.email || 'test@test.com',
          floor: 'NA',
          first_name: billingData.firstName || 'Teacher',
          street: 'NA',
          building: 'NA',
          phone_number: billingData.phone || '+201000000000',
          shipping_method: 'NA',
          postal_code: 'NA',
          city: 'Cairo',
          country: 'EG',
          last_name: billingData.lastName || 'User',
          state: 'NA'
        },
        currency: 'EGP',
        integration_id: this.integrationId
      })
    });
    const data = await response.json();
    return data.token;
  }

  // Generates the iframe URL for Paymob checkout
  async createPaymentSession(amount: number, orderId: string, billingData: any): Promise<string> {
    const amountCents = amount * 100;
    try {
      const token = await this.authenticate();
      const paymobOrderId = await this.registerOrder(token, amountCents, orderId);
      const paymentKey = await this.getPaymentKey(token, paymobOrderId, amountCents, billingData);

      if (paymentKey === 'dummy_payment_key') {
        return `http://localhost:5173/payment-simulation?order=${orderId}&amount=${amount}`;
      }

      return `https://accept.paymob.com/api/acceptance/iframes/YOUR_IFRAME_ID?payment_token=${paymentKey}`;
    } catch (e) {
      console.error('Paymob integration error:', e);
      throw new Error('فشل الاتصال ببوابة الدفع. تأكد من إعدادات Paymob.');
    }
  }
}
