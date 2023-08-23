import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';


const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-08-16'
});

export  async function  POST (req: NextRequest, res: NextResponse) {
  const baseUrl = req.nextUrl.origin
    try {
      const { customerId } = await req.json()

      const currency = 'eur';
      const lineItems = [
        {
          quantity: 1,
          price_data: {
            currency,
            product_data: {
              name: 'Test',
              description: `Seller is me`,
            },
            unit_amount: 20 * 100
          },
        }
      ]
      const session = await stripe.checkout.sessions.create({
        line_items: [...lineItems],
        customer: customerId,
        payment_method_types: ['card', 'giropay', 'sofort', 'ideal'],
        expires_at: Math.floor((Date.now() + 36000000) / 1000),
        mode: 'payment',
        success_url: `${baseUrl}/users?redirect_status=succeeded&id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/users`,
        locale: 'en',
      });
      return new NextResponse(JSON.stringify({ id: session.id, url: session.url, pi: session.payment_intent }), {
        status: 200,
      });
    } catch (err: any) {
      return new NextResponse(JSON.stringify({ message: err.message }), {
        status: 500,
      });
    }
};
