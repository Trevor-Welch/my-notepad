<script lang="ts">
	import { auth } from '$lib/firebase';
	import { signInWithPopup, GoogleAuthProvider, type User } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth';

	let loading = false;

	onMount(() => {
		if (auth) {
			const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
				if (user) {
					goto('/');
				}
			});
			return () => unsubscribe();
		}
	});

	async function signInWithGoogle() {
		if (!auth) return;
		
		loading = true;
		try {
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider);
			goto('/');
		} catch (err) {
			console.error('Sign-in error:', err);
		} finally {
			loading = false;
		}
	}
</script>

<main>
	<button on:click={signInWithGoogle} disabled={loading}>
		{loading ? 'Loading...' : 'Sign in with Google'}
	</button>
</main>

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
	}

	button {
		padding: 1rem 2rem;
		background: #fff;
		color: #000;
		border: none;
		font-size: 1rem;
		cursor: pointer;
		font-weight: 500;
	}

	button:hover:not(:disabled) {
		background: #ddd;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>