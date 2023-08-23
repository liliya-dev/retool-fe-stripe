"use client"
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import UsersScene from '../../../components/scenes/UsersScene'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '', {
  locale: 'en',
});

export default function Page() {
  return (
    <Elements stripe={stripePromise}>
      <UsersScene />
    </Elements>
  )
}
