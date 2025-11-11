<script lang="ts">
	import Note from './Note.svelte';
	import type { Note as NoteType } from '$lib/stores/notes';

	export let notes: NoteType[];
	export let loading: boolean;
	export let onDelete: (id: string) => void;
</script>

<div class="notes-section">
	<h2>Notes</h2>
	
	{#if loading}
		<p class="loading">Loading notes...</p>
	{:else if notes.length === 0}
		<p class="empty">No notes found</p>
	{:else}
		<div class="notes-list">
			{#each notes as note (note.id)}
				<Note {...note} {onDelete} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.notes-section {
		margin-top: 2rem;
	}

	h2 {
		font-size: 1.5rem;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.loading,
	.empty {
		text-align: center;
		color: #888;
	}

	.notes-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>