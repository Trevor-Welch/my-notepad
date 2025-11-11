<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/firebase';
	import { onAuthStateChanged, type User } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { ALLOWED_EMAIL } from '$lib/config';
	import { notesStore } from '$lib/stores/notes';
	import AddNote from '$lib/components/AddNote.svelte';
	import NotesList from '$lib/components/NotesList.svelte';

	let loading = true;
	let loadingNotes = false;
	let user: User | null = null;
	let isAllowed = false;

	$: notes = $notesStore;

	onMount(() => {
		if (!auth) return;

		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			user = currentUser;
			
			if (!currentUser) {
				goto('/login');
				return;
			}

			isAllowed = currentUser.email === ALLOWED_EMAIL;
			
			if (isAllowed) {
				loadingNotes = true;
				await notesStore.load();
				loadingNotes = false;
			}
			
			loading = false;
		});

		return unsubscribe;
	});

	async function handleAddNote(content: string) {
		await notesStore.add(content);
	}

	async function handleDeleteNote(id: string) {
		await notesStore.delete(id);
	}

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
{:else if !isAllowed}
	<main>
		<div>
			<p>You are not allowed to use this app, sorry</p>
			<p class="email">Logged in as: {user?.email}</p>
			<button on:click={signOut}>Sign out</button>
		</div>
	</main>
{:else}
	<main>
		<div class="container">
			<div class="header">
				<p>You're logged in as {user?.email}</p>
				<button on:click={signOut}>Sign out</button>
			</div>

			<AddNote onAdd={handleAddNote} />
			<NotesList {notes} loading={loadingNotes} onDelete={handleDeleteNote} />
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
		padding: 2rem;
	}

	.container {
		width: 100%;
		max-width: 800px;
	}

	.header {
		text-align: center;
		margin-bottom: 3rem;
	}

	p {
		margin: 0 0 1.5rem 0;
		font-size: 1.1rem;
	}

	.email {
		font-size: 0.9rem;
		color: #888;
		margin-bottom: 1.5rem;
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

	button:hover {
		background: #ddd;
	}
</style>