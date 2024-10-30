<script lang="ts">
	import type { Snippet } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js';
	import { PUBLIC_STRIPE_KEY } from '$env/static/public';
	import { goto } from '$app/navigation';
	console.log(PUBLIC_STRIPE_KEY);

	let { children, ...props }: { children: Snippet } = $props();

	async function onClick() {
		try {
			const stripe = await loadStripe(PUBLIC_STRIPE_KEY);

			const response = await fetch('api/checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			// .then(res => res.json())
			// .then(res => console.log(res))

			const { sessionId } = await response.json();

			await stripe.redirectToCheckout({ sessionId });
		} catch (error) {
			goto('/checkout/failure');
		}
	}
</script>

<button {...props} onclick={onClick}>{@render children()}</button>

<style>
	button {
		background-color: black;
		color: white;
		padding: 20px 24px;
		font-weight: normal;
		font-size: 22px;
		text-transform: uppercase;
		transition: all 300ms;
		border: 1px solid white;
	}

	button:hover {
		background-color: white;
		color: black;
	}
</style>
