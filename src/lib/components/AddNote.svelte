<script lang="ts">
	export let onAdd: (content: string) => Promise<void>;

	let content = '';
	let adding = false;

	async function handleAdd() {
		adding = true;
		try {
			await onAdd(content);
			content = '';
		} finally {
			adding = false;
		}
	}
</script>

<div class="add-note-section">
	<h2>Add New Note</h2>
	<textarea 
		bind:value={content}
		placeholder="Enter your note here..."
		disabled={adding}
	></textarea>
	<button on:click={handleAdd} disabled={adding || !content.trim()}>
		{adding ? 'Adding...' : 'Add Note'}
	</button>
</div>

<style>
	.add-note-section {
		margin-bottom: 3rem;
		padding: 2rem;
		background: #1a1a1a;
		border: 1px solid #333;
		border-radius: 8px;
	}

	h2 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.5rem;
		text-align: center;
	}

	textarea {
		width: 100%;
		min-height: 150px;
		padding: 1rem;
		background: #000;
		color: #fff;
		border: 1px solid #333;
		border-radius: 4px;
		font-family: inherit;
		font-size: 1rem;
		resize: vertical;
		margin-bottom: 1rem;
		box-sizing: border-box;
	}

	textarea:focus {
		outline: none;
		border-color: #666;
	}

	textarea:disabled {
		opacity: 0.5;
		cursor: not-allowed;
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

	button:disabled {
		background: #555;
		color: #888;
		cursor: not-allowed;
	}
</style>