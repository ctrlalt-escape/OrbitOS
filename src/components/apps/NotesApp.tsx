
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Save, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
}

const NotesApp = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = localStorage.getItem('orbit-notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (err) {
        console.error('Failed to parse saved notes', err);
      }
    }
  }, []);
  
  useEffect(() => {
    // Save whenever notes change
    localStorage.setItem('orbit-notes', JSON.stringify(notes));
  }, [notes]);
  
  useEffect(() => {
    if (activeNoteId) {
      const note = notes.find(n => n.id === activeNoteId);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
      }
    } else {
      setTitle('');
      setContent('');
    }
  }, [activeNoteId, notes]);
  
  const createNewNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'New Note',
      content: '',
      lastModified: new Date()
    };
    
    setNotes([...notes, newNote]);
    setActiveNoteId(newNote.id);
  };
  
  const saveNote = () => {
    if (!activeNoteId) {
      // Create new note if none is active
      const newNote: Note = {
        id: `note-${Date.now()}`,
        title: title || 'Untitled',
        content,
        lastModified: new Date()
      };
      
      setNotes([...notes, newNote]);
      setActiveNoteId(newNote.id);
      toast.success('Note created!');
    } else {
      // Update existing note
      setNotes(notes.map(note => 
        note.id === activeNoteId 
          ? { 
              ...note, 
              title: title || 'Untitled', 
              content, 
              lastModified: new Date() 
            } 
          : note
      ));
      toast.success('Note saved!');
    }
  };
  
  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(null);
      setTitle('');
      setContent('');
    }
    toast.info('Note deleted');
  };
  
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 border-r border-gray-200 flex flex-col h-full">
        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-medium">My Notes</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={createNewNote}
          >
            <PlusCircle size={18} />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {notes.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <FileText className="mx-auto mb-2 h-8 w-8 text-gray-400" />
              <p className="text-sm">No notes yet</p>
              <p className="text-xs mt-1">Click the + button to create one</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notes
                .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
                .map(note => (
                  <div 
                    key={note.id} 
                    className={`p-3 cursor-pointer hover:bg-gray-200 transition-colors ${activeNoteId === note.id ? 'bg-gray-200' : ''}`}
                    onClick={() => setActiveNoteId(note.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="truncate">
                        <h3 className="font-medium truncate">{note.title}</h3>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {new Date(note.lastModified).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0" 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {note.content.substring(0, 50)}
                      {note.content.length > 50 ? '...' : ''}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Editor */}
      <div className="flex-1 flex flex-col">
        <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-white">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="border-none font-medium text-lg px-0 focus-visible:ring-0"
          />
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={saveNote}
            disabled={!title && !content}
          >
            <Save size={16} className="mr-1" />
            Save
          </Button>
        </div>
        
        <div className="flex-1 p-3 overflow-auto">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            className="min-h-[300px] h-full resize-none border-none focus-visible:ring-0"
          />
        </div>
      </div>
    </div>
  );
};

export default NotesApp;
