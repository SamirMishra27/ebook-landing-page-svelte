import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { STRIPE_API_KEY, PRICE_ID } from '$env/static/private';

const stripe = new Stripe(STRIPE_API_KEY);

export async function POST(request) {
	const { protocol, host } = request.url;
	const clientHost = `${protocol}//${host}`;

	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'], // , 'paypal'
			line_items: [
				{
					price: PRICE_ID,
					quantity: 1
				}
			],
			mode: 'payment',
			success_url: `${clientHost}/checkout/success`,
			cancel_url: `${clientHost}/checkout/failure`
		});

		// console.log(request)
		// return json({ message: 'Hello from the server!' });
		return json({ sessionId: session.id });
	} catch (error) {
		return json({ error }, { status: 500 });
	}
}
