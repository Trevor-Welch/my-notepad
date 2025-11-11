<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/firebase';
	import { onAuthStateChanged, type User } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { ALLOWED_EMAIL } from '$lib/config';

	let loading = true;
	let user: User | null = null;

	onMount(() => {
		if (auth) {
			const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
				user = currentUser;
				
				if (!currentUser || currentUser.email !== ALLOWED_EMAIL) {
					goto('/');
					return;
				}

				loading = false;
			});

			return () => unsubscribe();
		}
	});

	async function signOut() {
		if (auth) {
			await auth.signOut();
			goto('/login');
		}
	}
</script>

{#if loading}
	<main>
		<p>Loading...</p>
	</main>
{:else}
	<main>
		<div>
			<p>Success! You made it.</p>
			<p class="email">{user?.email}</p>
			<button on:click={signOut}>Sign out</button>
		</div>
	</main>
{/if}

<style>
	:global(body) {
		margin: 0;
		background: #000;
		color: #fff;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
	}

	main {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		text-align: center;
	}

	p {
		margin: 0 0 1.5rem 0;
		font-size: 1.1rem;
	}

	.email {
		font-size: 0.9rem;
		color: #888;
	}

	button {
		padding: 1rem 2rem;
		background: #fff;
		color: #000;
		border: none;
		font-size: 1rem;
		cursor: pointer;
		font-weight: 500;
		margin-top: 1rem;
	}

	button:hover {
		background: #ddd;
	}
</style>