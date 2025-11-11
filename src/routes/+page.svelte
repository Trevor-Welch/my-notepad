<script>
	import { onMount } from 'svelte';
	import { auth, db } from '$lib/firebase';
	import { signInAnonymously } from 'firebase/auth';
	import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

	let noteContent = '';
	let loading = true;
	let userId = '';

	onMount(async () => {
		if (auth) {
			const userCredential = await signInAnonymously(auth);
			userId = userCredential.user.uid;

			// Listen to note changes in real-time
			const noteRef = doc(db, 'notes', userId);
			onSnapshot(noteRef, (doc) => {
				if (doc.exists()) {
					noteContent = doc.data().content || '';
				}
				loading = false;
			});
		}
	});

	async function saveNote() {
		if (db && userId) {
			await setDoc(doc(db, 'notes', userId), {
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
		<p>Loading...</p>
	{:else}
		<textarea
			bind:value={noteContent}
			on:input={handleInput}
			placeholder="Start writing..."
		/>
	{/if}
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	textarea {
		width: 100%;
		min-height: 80vh;
		padding: 1rem;
		font-size: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		resize: vertical;
	}
</style>