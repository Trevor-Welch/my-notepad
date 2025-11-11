<script lang="ts">
	export let id: string;
	export let content: string;
	export let onDelete: (id: string) => void;
</script>

<div class="note">
	<button class="delete-btn" on:click={() => onDelete(id)}>×</button>
	<p>{content}</p>
</div>

<style>
	.note {
		position: relative;
		background: #1a1a1a;
		border: 1px solid #333;
		padding: 1.5rem;
		border-radius: 8px;
	}

	.note p {
		margin: 0;
		line-height: 1.6;
		white-space: pre-wrap;
	}

	.delete-btn {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		width: 2rem;
		height: 2rem;
		padding: 0;
		background: #ff0000;
		color: #fff;
		border: none;
		border-radius: 4px;
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		opacity: 0;
		transition: opacity 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.note:hover .delete-btn {
		opacity: 1;
	}

	.delete-btn:hover {
		background: #cc0000;
	}
</style>