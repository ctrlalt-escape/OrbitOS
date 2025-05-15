
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { FolderOpen, File, ArrowLeft, ArrowRight, Home, Upload, FolderPlus, Plus, Trash2, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

// Mock file system interface
interface FSItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FSItem[];
  size?: number;
  created: Date;
  modified: Date;
}

const FilesApp = () => {
  const [fileSystem, setFileSystem] = useState<FSItem[]>([]);
  const [currentPath, setCurrentPath] = useState<FSItem[]>([]);
  const [currentItems, setCurrentItems] = useState<FSItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<FSItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Initialize file system
  useEffect(() => {
    const savedFS = localStorage.getItem('orbit-files');
    if (savedFS) {
      try {
        setFileSystem(JSON.parse(savedFS));
      } catch (err) {
        console.error('Failed to parse saved file system', err);
        initializeFileSystem();
      }
    } else {
      initializeFileSystem();
    }
  }, []);

  // Save file system changes
  useEffect(() => {
    if (fileSystem.length) {
      localStorage.setItem('orbit-files', JSON.stringify(fileSystem));
    }
  }, [fileSystem]);

  // Update current items when path changes
  useEffect(() => {
    navigateToCurrentPath();
  }, [currentPath, fileSystem]);

  const initializeFileSystem = () => {
    // Create a default file system with some mock files
    const defaultFS: FSItem[] = [
      {
        id: 'folder-documents',
        name: 'Documents',
        type: 'folder',
        created: new Date(),
        modified: new Date(),
        children: [
          {
            id: 'file-welcome',
            name: 'Welcome.txt',
            type: 'file',
            content: 'Welcome to OrbitOS File Manager!',
            size: 32,
            created: new Date(),
            modified: new Date()
          },
          {
            id: 'file-notes',
            name: 'Notes.txt',
            type: 'file',
            content: 'This is a sample text file.',
            size: 28,
            created: new Date(),
            modified: new Date()
          }
        ]
      },
      {
        id: 'folder-pictures',
        name: 'Pictures',
        type: 'folder',
        created: new Date(),
        modified: new Date(),
        children: []
      },
      {
        id: 'folder-music',
        name: 'Music',
        type: 'folder',
        created: new Date(),
        modified: new Date(),
        children: []
      },
      {
        id: 'folder-downloads',
        name: 'Downloads',
        type: 'folder',
        created: new Date(),
        modified: new Date(),
        children: []
      }
    ];
    
    setFileSystem(defaultFS);
  };

  const navigateToCurrentPath = () => {
    let items: FSItem[] = fileSystem;
    
    // Navigate through path
    for (const pathItem of currentPath) {
      const folder = items.find(item => item.id === pathItem.id);
      if (folder && folder.type === 'folder' && folder.children) {
        items = folder.children;
      } else {
        break;
      }
    }
    
    setCurrentItems(items);
    setSelectedItems([]);
  };

  const handleItemClick = (item: FSItem) => {
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, item]);
    } else {
      // Handle file click - could open a preview
      toast.info(`Opening ${item.name}`);
      // For now, let's just select it
      toggleItemSelection(item);
    }
  };

  const toggleItemSelection = (item: FSItem) => {
    if (selectedItems.some(i => i.id === item.id)) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleNavigateUp = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const handleNavigateHome = () => {
    setCurrentPath([]);
  };

  const createFolder = () => {
    if (!newFolderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }
    
    // Check if a folder with this name already exists
    if (currentItems.some(item => item.name === newFolderName && item.type === 'folder')) {
      toast.error('A folder with this name already exists');
      return;
    }
    
    const newFolder: FSItem = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      type: 'folder',
      created: new Date(),
      modified: new Date(),
      children: []
    };
    
    // If we're in the root
    if (currentPath.length === 0) {
      setFileSystem([...fileSystem, newFolder]);
    } else {
      // We're in a subfolder, need to update the nested structure
      let updatedFS = [...fileSystem];
      let currentItems = updatedFS;
      let currentItem;
      
      // Navigate to the current folder
      for (const pathItem of currentPath) {
        currentItem = currentItems.find(item => item.id === pathItem.id);
        if (currentItem && currentItem.type === 'folder' && currentItem.children) {
          currentItems = currentItem.children;
        } else {
          break;
        }
      }
      
      // Add new folder to current location
      if (Array.isArray(currentItems)) {
        currentItems.push(newFolder);
        setFileSystem(updatedFS);
      }
    }
    
    setIsCreatingFolder(false);
    setNewFolderName('');
    toast.success('Folder created');
  };

  const deleteSelectedItems = () => {
    if (selectedItems.length === 0) {
      return;
    }
    
    // Filter out selected items
    if (currentPath.length === 0) {
      // If we're in the root
      const newFS = fileSystem.filter(item => !selectedItems.some(selected => selected.id === item.id));
      setFileSystem(newFS);
    } else {
      // We're in a subfolder
      let updatedFS = [...fileSystem];
      let currentItems = updatedFS;
      let currentItem;
      
      // Navigate to the current folder
      for (const pathItem of currentPath) {
        currentItem = currentItems.find(item => item.id === pathItem.id);
        if (currentItem && currentItem.type === 'folder' && currentItem.children) {
          currentItems = currentItem.children;
        } else {
          break;
        }
      }
      
      // Remove selected items
      if (Array.isArray(currentItems) && currentItem) {
        currentItem.children = currentItems.filter(
          item => !selectedItems.some(selected => selected.id === item.id)
        );
        setFileSystem(updatedFS);
      }
    }
    
    toast.info(`Deleted ${selectedItems.length} item(s)`);
    setSelectedItems([]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-2 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleNavigateUp}
          disabled={currentPath.length === 0}
        >
          <ArrowLeft size={16} className="mr-1" />
          Up
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleNavigateHome}
          disabled={currentPath.length === 0}
        >
          <Home size={16} className="mr-1" />
          Home
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCreatingFolder(true)}
        >
          <FolderPlus size={16} className="mr-1" />
          New Folder
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          disabled={true} // Not implemented for this demo
        >
          <Plus size={16} className="mr-1" />
          New File
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          disabled={true} // Not implemented for this demo
        >
          <Upload size={16} className="mr-1" />
          Upload
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Button
          variant="outline"
          size="sm"
          onClick={deleteSelectedItems}
          disabled={selectedItems.length === 0}
        >
          <Trash2 size={16} className="mr-1" />
          Delete
        </Button>
        
        <div className="flex-1" />
        
        <Button
          variant="ghost"
          size="sm"
          className="px-2"
          onClick={() => setViewMode('grid')}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="px-2"
          onClick={() => setViewMode('list')}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
            <line x1="21" y1="6" x2="3" y2="6" />
            <line x1="21" y1="12" x2="3" y2="12" />
            <line x1="21" y1="18" x2="3" y2="18" />
          </svg>
        </Button>
      </div>
      
      {/* Path breadcrumb */}
      <div className="bg-gray-50 px-3 py-1 border-b border-gray-200 flex items-center text-sm overflow-x-auto">
        <span 
          className="cursor-pointer hover:underline mr-1"
          onClick={handleNavigateHome}
        >
          Home
        </span>
        
        {currentPath.map((item, index) => (
          <div key={item.id} className="flex items-center">
            <span className="mx-1">/</span>
            <span 
              className={`cursor-pointer hover:underline ${index === currentPath.length - 1 ? 'font-medium' : ''}`}
              onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
            >
              {item.name}
            </span>
          </div>
        ))}
      </div>
      
      {/* File browser */}
      <div className="flex-1 overflow-auto p-3 bg-white">
        {currentItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FolderOpen size={48} className="mb-3 text-gray-300" />
            <p>This folder is empty</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setIsCreatingFolder(true)}
            >
              <FolderPlus size={16} className="mr-1" />
              Create a folder
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
            {currentItems.map(item => (
              <div
                key={item.id}
                className={`flex flex-col items-center p-2 rounded cursor-pointer transition-colors ${
                  selectedItems.some(i => i.id === item.id) 
                    ? 'bg-blue-100' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleItemClick(item)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  toggleItemSelection(item);
                }}
              >
                {item.type === 'folder' ? (
                  <FolderOpen size={48} className="mb-2 text-amber-500" />
                ) : (
                  <File size={48} className="mb-2 text-blue-500" />
                )}
                <span className="text-center text-sm break-words w-full">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {currentItems.map(item => (
              <div
                key={item.id}
                className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                  selectedItems.some(i => i.id === item.id) 
                    ? 'bg-blue-100' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleItemClick(item)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  toggleItemSelection(item);
                }}
              >
                {item.type === 'folder' ? (
                  <FolderOpen size={20} className="mr-3 text-amber-500" />
                ) : (
                  <File size={20} className="mr-3 text-blue-500" />
                )}
                <div className="flex-1">
                  <span className="block">{item.name}</span>
                  <span className="text-xs text-gray-500">
                    {item.type === 'folder' 
                      ? 'Folder' 
                      : `${item.size} bytes · ${new Date(item.modified).toLocaleDateString()}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Status bar */}
      <div className="px-3 py-1 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex items-center">
        <span>{currentItems.length} items</span>
        <span className="mx-2">·</span>
        <span>{selectedItems.length} selected</span>
      </div>

      {/* New Folder Dialog */}
      <Dialog open={isCreatingFolder} onOpenChange={setIsCreatingFolder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Folder Name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingFolder(false)}>Cancel</Button>
            <Button onClick={createFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FilesApp;
