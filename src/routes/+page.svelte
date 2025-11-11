<script>
	import { onMount } from 'svelte';
	import { auth, db } from '$lib/firebase';
	import { onAuthStateChanged } from 'firebase/auth';
	import { doc, setDoc, onSnapshot } from 'firebase/firestore';
	import { goto } from '$app/navigation';

	let noteContent = '';
	let loading = true;
	let user = null;

	onMount(() => {
		if (auth) {
			const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
				user = currentUser;
				
				if (!currentUser) {
					goto('/login');
					return;
				}

				// Listen to note changes in real-time
				const noteRef = doc(db, 'notes', currentUser.uid);
				const unsubscribeSnapshot = onSnapshot(noteRef, (doc) => {
					if (doc.exists()) {
						noteContent = doc.data().content || '';
					}
					loading = false;
				});

				return () => unsubscribeSnapshot();
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

	async function saveNote() {
		if (db && user) {
			await setDoc(doc(db, 'notes', user.uid), {
				content: noteContent,
				updatedAt: new Date()
			});
		}
	}

	// Auto-save with debouncing
	let saveTimeout;
	function handleInput() {
		clearTimeout(saveTimeout);
		saveTimeout = setTimeout(saveNote, 1000);
	}
</script>

<main>
	{#if loading}
		<div class="loading">Loading...</div>
	{:else}
		<div class="header">
			<h1>My Notepad</h1>
			<div class="user-info">
				<span>{user?.email}</span>
				<button on:click={signOut}>Sign Out</button>
			</div>
		</div>
		<textarea
			bind:value={noteContent}
			on:input={handleInput}
			placeholder="Start writing your notes..."
		/>
	{/if}
</main>

<style>
	main {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;
		min-height: 100vh;
	}

	.loading {
		text-align: center;
		padding: 4rem;
		color: #666;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 2px solid #eee;
	}

	h1 {
		margin: 0;
		color: #333;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.user-info span {
		color: #666;
		font-size: 0.9rem;
	}

	button {
		padding: 0.5rem 1rem;
		background: #4285f4;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.9rem;
	}

	button:hover {
		background: #357ae8;
	}

	textarea {
		width: 100%;
		min-height: calc(100vh - 200px);
		padding: 1.5rem;
		font-size: 1rem;
		line-height: 1.6;
		border: 1px solid #ddd;
		border-radius: 8px;
		resize: vertical;
		font-family: inherit;
	}

	textarea:focus {
		outline: none;
		border-color: #4285f4;
	}
</style>