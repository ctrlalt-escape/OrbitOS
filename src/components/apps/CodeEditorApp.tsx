
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Save, Play, FileText, FolderOpen, Plus, ChevronRight, ChevronDown, Code, Settings, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '../ui/input';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
  children?: FileNode[];
  isOpen?: boolean;
}

const CodeEditorApp = () => {
  const [files, setFiles] = useState<FileNode[]>([
    {
      id: 'root',
      name: 'project',
      type: 'folder',
      isOpen: true,
      children: [
        {
          id: 'src',
          name: 'src',
          type: 'folder',
          isOpen: true,
          children: [
            {
              id: 'index',
              name: 'index.js',
              type: 'file',
              language: 'javascript',
              content: `import React from 'react';\nimport ReactDOM from 'react-dom';\nimport App from './App';\n\nReactDOM.render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>,\n  document.getElementById('root')\n);`
            },
            {
              id: 'app',
              name: 'App.js',
              type: 'file',
              language: 'javascript',
              content: `import React, { useState } from 'react';\n\nfunction App() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div className="App">\n      <header className="App-header">\n        <h1>Hello CodeEditor</h1>\n        <p>Count: {count}</p>\n        <button onClick={() => setCount(count + 1)}>\n          Increment\n        </button>\n      </header>\n    </div>\n  );\n}\n\nexport default App;`
            },
            {
              id: 'styles',
              name: 'styles.css',
              type: 'file',
              language: 'css',
              content: `.App {\n  text-align: center;\n}\n\n.App-header {\n  background-color: #282c34;\n  min-height: 100vh;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  font-size: calc(10px + 2vmin);\n  color: white;\n}\n\nbutton {\n  background-color: #61dafb;\n  border: none;\n  color: #282c34;\n  padding: 10px 20px;\n  border-radius: 4px;\n  cursor: pointer;\n  margin-top: 20px;\n  font-size: 16px;\n}\n\nbutton:hover {\n  background-color: #21a1cb;\n}`
            }
          ]
        },
        {
          id: 'public',
          name: 'public',
          type: 'folder',
          children: [
            {
              id: 'index-html',
              name: 'index.html',
              type: 'file',
              language: 'html',
              content: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="utf-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1" />\n  <title>Code Editor App</title>\n</head>\n<body>\n  <div id="root"></div>\n</body>\n</html>`
            }
          ]
        },
        {
          id: 'package',
          name: 'package.json',
          type: 'file',
          language: 'json',
          content: `{\n  "name": "code-editor-project",\n  "version": "1.0.0",\n  "private": true,\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  },\n  "scripts": {\n    "start": "react-scripts start",\n    "build": "react-scripts build",\n    "test": "react-scripts test",\n    "eject": "react-scripts eject"\n  }\n}`
        }
      ]
    }
  ]);
  
  const [openFiles, setOpenFiles] = useState<FileNode[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [currentContent, setCurrentContent] = useState<string>('');
  const [isDark, setIsDark] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Open the App.js file by default
    const appFile = findFileById('app', files);
    if (appFile) {
      handleFileOpen(appFile);
    }
  }, []);

  const findFileById = (id: string, nodes: FileNode[]): FileNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findFileById(id, node.children);
        if (found) return found;
      }
    }
    return null;
  };

  const toggleFolder = (id: string) => {
    const updateFolders = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === id) {
          return { ...node, isOpen: !node.isOpen };
        }
        if (node.children) {
          return { ...node, children: updateFolders(node.children) };
        }
        return node;
      });
    };
    
    setFiles(updateFolders(files));
  };

  const handleFileOpen = (file: FileNode) => {
    if (file.type !== 'file') return;
    
    // Check if file is already open
    if (!openFiles.some(f => f.id === file.id)) {
      setOpenFiles([...openFiles, file]);
    }
    
    setActiveFileId(file.id);
    setCurrentContent(file.content || '');
  };

  const handleTabClose = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newOpenFiles = openFiles.filter(file => file.id !== id);
    setOpenFiles(newOpenFiles);
    
    if (activeFileId === id) {
      if (newOpenFiles.length > 0) {
        setActiveFileId(newOpenFiles[newOpenFiles.length - 1].id);
        setCurrentContent(newOpenFiles[newOpenFiles.length - 1].content || '');
      } else {
        setActiveFileId(null);
        setCurrentContent('');
      }
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentContent(e.target.value);
    
    // Update the file content in the files structure
    if (activeFileId) {
      const updateFileContent = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(node => {
          if (node.id === activeFileId) {
            return { ...node, content: e.target.value };
          }
          if (node.children) {
            return { ...node, children: updateFileContent(node.children) };
          }
          return node;
        });
      };
      
      setFiles(updateFileContent(files));
      
      // Also update in the openFiles array
      setOpenFiles(openFiles.map(file => 
        file.id === activeFileId 
          ? { ...file, content: e.target.value } 
          : file
      ));
    }
  };

  const saveCurrentFile = () => {
    if (activeFileId) {
      toast.success('File saved successfully');
    }
  };

  const runCode = () => {
    toast.success('Code executed successfully', {
      description: 'Check the terminal for output'
    });
  };

  const createNewFile = () => {
    const newFile: FileNode = {
      id: `file-${Date.now()}`,
      name: 'newfile.js',
      type: 'file',
      language: 'javascript',
      content: '// Write your code here'
    };
    
    // Add to root for simplicity
    const updateRoot = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === 'src') {
          return { 
            ...node, 
            children: [...(node.children || []), newFile],
            isOpen: true
          };
        }
        if (node.children) {
          return { ...node, children: updateRoot(node.children) };
        }
        return node;
      });
    };
    
    setFiles(updateRoot(files));
    handleFileOpen(newFile);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const toggleSearch = () => {
    setIsSearching(!isSearching);
    if (!isSearching) {
      setSearchQuery('');
    }
  };

  const highlightCode = (content: string, language: string) => {
    // This is a simplified syntax highlighting
    // In a real app, you'd use a library like Prism or CodeMirror
    if (language === 'javascript') {
      const keywords = ['const', 'let', 'var', 'function', 'return', 'import', 'export', 'from', 'default', 'if', 'else', 'for', 'while'];
      
      return content;
    }
    
    return content;
  };

  const renderFileTree = (nodes: FileNode[]) => {
    return nodes.map(node => {
      if (node.type === 'folder') {
        return (
          <div key={node.id} className="ml-2">
            <div 
              className="flex items-center py-1 px-2 hover:bg-navy-800 rounded cursor-pointer text-sm"
              onClick={() => toggleFolder(node.id)}
            >
              {node.isOpen ? <ChevronDown size={14} className="mr-1" /> : <ChevronRight size={14} className="mr-1" />}
              <FolderOpen size={14} className="mr-1 text-yellow-400" />
              <span>{node.name}</span>
            </div>
            
            {node.isOpen && node.children && (
              <div className="ml-2 border-l border-navy-700 pl-2">
                {renderFileTree(node.children)}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div 
            key={node.id} 
            className={`ml-4 py-1 px-2 hover:bg-navy-800 rounded cursor-pointer text-sm flex items-center ${
              activeFileId === node.id ? 'bg-navy-800' : ''
            }`}
            onClick={() => handleFileOpen(node)}
          >
            <FileText size={14} className="mr-1 text-gray-400" />
            <span>{node.name}</span>
          </div>
        );
      }
    });
  };

  const getFileIcon = (language?: string) => {
    switch (language) {
      case 'javascript': return <span className="text-yellow-400 text-xs">JS</span>;
      case 'css': return <span className="text-blue-400 text-xs">CSS</span>;
      case 'html': return <span className="text-orange-400 text-xs">HTML</span>;
      case 'json': return <span className="text-green-400 text-xs">JSON</span>;
      default: return <span className="text-gray-400 text-xs">TXT</span>;
    }
  };

  return (
    <div className={`h-full flex flex-col ${isDark ? 'bg-navy-950 text-white' : 'bg-white text-navy-950'}`}>
      {/* Toolbar */}
      <div className={`flex items-center justify-between p-2 border-b ${isDark ? 'border-navy-800' : 'border-gray-200'}`}>
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${isDark ? 'text-white hover:bg-navy-800' : 'text-navy-950 hover:bg-gray-100'}`}
            onClick={saveCurrentFile}
          >
            <Save size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${isDark ? 'text-white hover:bg-navy-800' : 'text-navy-950 hover:bg-gray-100'}`}
            onClick={runCode}
          >
            <Play size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${isDark ? 'text-white hover:bg-navy-800' : 'text-navy-950 hover:bg-gray-100'}`}
            onClick={createNewFile}
          >
            <Plus size={16} />
          </Button>
        </div>

        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${isDark ? 'text-white hover:bg-navy-800' : 'text-navy-950 hover:bg-gray-100'}`}
            onClick={toggleSearch}
          >
            <Search size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${isDark ? 'text-white hover:bg-navy-800' : 'text-navy-950 hover:bg-gray-100'}`}
            onClick={toggleTheme}
          >
            <Code size={16} />
          </Button>
        </div>
      </div>

      {/* Search bar */}
      {isSearching && (
        <div className={`p-2 border-b ${isDark ? 'border-navy-800' : 'border-gray-200'}`}>
          <Input
            placeholder="Search in files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={isDark ? 'bg-navy-800 border-navy-700 text-white' : 'bg-white border-gray-200 text-navy-950'}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`w-56 border-r overflow-auto ${isDark ? 'border-navy-800' : 'border-gray-200'}`}>
          <Tabs defaultValue="files">
            <TabsList className="w-full">
              <TabsTrigger value="files" className="flex-1">Files</TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="files" className="p-0 m-0">
              <ScrollArea className="h-[calc(100vh-140px)]">
                <div className="p-2">
                  {renderFileTree(files)}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="settings" className="p-0 m-0">
              <ScrollArea className="h-[calc(100vh-140px)]">
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Theme</h3>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant={isDark ? 'default' : 'outline'}
                        onClick={() => setIsDark(true)}
                        className="flex-1"
                      >
                        Dark
                      </Button>
                      <Button 
                        size="sm" 
                        variant={!isDark ? 'default' : 'outline'}
                        onClick={() => setIsDark(false)}
                        className="flex-1"
                      >
                        Light
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Editor</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Font Size</span>
                        <div className="flex items-center">
                          <Button size="sm" variant="ghost">-</Button>
                          <span className="px-2">14px</span>
                          <Button size="sm" variant="ghost">+</Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Tab Size</span>
                        <div className="flex items-center">
                          <Button size="sm" variant="ghost">-</Button>
                          <span className="px-2">2</span>
                          <Button size="sm" variant="ghost">+</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* File tabs */}
          {openFiles.length > 0 && (
            <div className={`flex overflow-x-auto border-b ${isDark ? 'border-navy-800' : 'border-gray-200'}`}>
              {openFiles.map(file => (
                <div 
                  key={file.id}
                  className={`flex items-center px-3 py-1 cursor-pointer border-r ${
                    isDark 
                      ? `border-navy-800 ${activeFileId === file.id ? 'bg-navy-800' : 'hover:bg-navy-900'}` 
                      : `border-gray-200 ${activeFileId === file.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`
                  }`}
                  onClick={() => {
                    setActiveFileId(file.id);
                    setCurrentContent(file.content || '');
                  }}
                >
                  <div className="flex items-center space-x-2">
                    {getFileIcon(file.language)}
                    <span className="text-sm truncate max-w-[100px]">{file.name}</span>
                  </div>
                  <button 
                    className={`ml-2 rounded-full hover:${isDark ? 'bg-navy-700' : 'bg-gray-200'} p-0.5`}
                    onClick={(e) => handleTabClose(file.id, e)}
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Code editor */}
          {activeFileId ? (
            <textarea 
              value={currentContent}
              onChange={handleContentChange}
              className={`flex-1 p-4 font-mono text-sm outline-none resize-none ${
                isDark ? 'bg-navy-950 text-gray-300' : 'bg-white text-navy-950'
              }`}
              spellCheck={false}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Code size={48} className={`mx-auto mb-4 ${isDark ? 'text-navy-700' : 'text-gray-300'}`} />
                <h3 className="text-lg font-medium mb-2">No file is open</h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                  Open a file from the sidebar or create a new file
                </p>
                <Button 
                  className="mt-4"
                  onClick={createNewFile}
                >
                  <Plus size={16} className="mr-2" />
                  Create New File
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Status bar */}
      <div className={`px-3 py-1 text-xs flex justify-between items-center ${isDark ? 'bg-navy-900 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
        <div className="flex items-center space-x-4">
          <span>JavaScript</span>
          <span>Line: 10 Col: 5</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span>LF</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorApp;
