
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface Note {
  id: string;
  content: string;
  color: string;
  createdAt: Date;
}

const StickyNotesApp = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [noteContent, setNoteContent] = useState<string>('');
  const [noteColor, setNoteColor] = useState<string>('#f9dc5c');

  const colorOptions = [
    { value: '#f9dc5c', label: 'Yellow' },
    { value: '#f2c6de', label: 'Pink' },
    { value: '#c1e7e3', label: 'Blue' },
    { value: '#d0f4de', label: 'Green' },
    { value: '#c2aff0', label: 'Purple' }
  ];

  // Load notes from localStorage on mount
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('orbitOS-sticky-notes');
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        // Convert string dates back to Date objects
        const notesWithDates = parsedNotes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt)
        }));
        setNotes(notesWithDates);
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
      toast.error('Failed to load notes');
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('orbitOS-sticky-notes', JSON.stringify(notes));
    } catch (error) {
      console.error('Failed to save notes:', error);
      toast.error('Failed to save notes');
    }
  }, [notes]);

  const createNewNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      content: '',
      color: noteColor,
      createdAt: new Date()
    };
    
    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
    setNoteContent('');
    toast.success('Created new note');
  };

  const updateNote = () => {
    if (!activeNote) return;
    
    const updatedNotes = notes.map(note => 
      note.id === activeNote.id 
        ? { ...note, content: noteContent, color: noteColor }
        : note
    );
    
    setNotes(updatedNotes);
    setActiveNote(null);
    toast.success('Note updated');
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    
    if (activeNote && activeNote.id === id) {
      setActiveNote(null);
    }
    
    toast.success('Note deleted');
  };

  const editNote = (note: Note) => {
    setActiveNote(note);
    setNoteContent(note.content);
    setNoteColor(note.color);
  };

  const cancelEdit = () => {
    setActiveNote(null);
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex h-full bg-navy-950 text-white">
      {/* Sidebar with note list */}
      <div className="w-72 border-r border-navy-800 flex flex-col">
        <div className="p-3 border-b border-navy-800 flex items-center justify-between">
          <h2 className="font-medium">Notes</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 bg-navy-800"
            onClick={createNewNote}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <ScrollArea className="flex-grow">
          <div className="p-3 space-y-2">
            {notes.length > 0 ? (
              notes.map(note => (
                <div 
                  key={note.id}
                  className={`p-3 rounded-md cursor-pointer hover:bg-navy-800 transition-colors ${
                    activeNote && activeNote.id === note.id ? 'bg-navy-800' : ''
                  }`}
                  style={{ borderLeft: `3px solid ${note.color}` }}
                  onClick={() => editNote(note)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <p className="text-sm line-clamp-2">
                        {note.content || 'Empty note'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(note.createdAt)}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 shrink-0 text-gray-400 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No notes yet</p>
                <p className="text-sm mt-1">Click the + button to create one</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      
      {/* Note editor */}
      <div className="flex-grow flex flex-col">
        {activeNote ? (
          <>
            <div className="p-3 border-b border-navy-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Select color:</span>
                <div className="flex space-x-1">
                  {colorOptions.map(color => (
                    <button
                      key={color.value}
                      className={`w-5 h-5 rounded-full border ${
                        noteColor === color.value ? 'border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setNoteColor(color.value)}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-green-500"
                  onClick={updateNote}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-400"
                  onClick={cancelEdit}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
            <div className="flex-grow p-3">
              <textarea
                className="w-full h-full bg-navy-900 border border-navy-800 rounded-md p-3 text-white resize-none focus:outline-none focus:ring-1 focus:ring-navy-700"
                placeholder="Write your note here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                autoFocus
              />
            </div>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-400">
            <div className="p-8 text-center">
              <h3 className="text-xl mb-3">No Note Selected</h3>
              <p className="mb-5">Select a note from the sidebar or create a new one</p>
              <Button onClick={createNewNote}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Note
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyNotesApp;
