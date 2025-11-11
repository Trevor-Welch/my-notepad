import { writable } from 'svelte/store';
import { db } from '$lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

export interface Note {
	id: string;
	content: string;
}

function createNotesStore() {
	const { subscribe, set, update } = writable<Note[]>([]);

	return {
		subscribe,
		load: async () => {
			if (!db) return;
			
			try {
				const notesCollection = collection(db, 'notes');
				const notesSnapshot = await getDocs(notesCollection);
				const notes = notesSnapshot.docs.map(doc => ({
					id: doc.id,
					content: doc.data().content
				}));
				set(notes);
			} catch (error) {
				console.error('Error loading notes:', error);
			}
		},
		add: async (content: string) => {
			if (!db || !content.trim()) return;
			
			try {
				const docRef = await addDoc(collection(db, 'notes'), { content });
				update(notes => [...notes, { id: docRef.id, content }]);
			} catch (error) {
				console.error('Error adding note:', error);
				throw error;
			}
		},
		delete: async (noteId: string) => {
			if (!db) return;
			
			try {
				await deleteDoc(doc(db, 'notes', noteId));
				update(notes => notes.filter(note => note.id !== noteId));
			} catch (error) {
				console.error('Error deleting note:', error);
				throw error;
			}
		}
	};
}

export const notesStore = createNotesStore();