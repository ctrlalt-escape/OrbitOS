
import React, { useState, useEffect, useRef } from 'react';

interface CommandHistory {
  command: string;
  output: string | string[];
}

const TerminalApp = () => {
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<CommandHistory[]>([
    { command: 'echo "Welcome to OrbitOS Terminal"', output: 'Welcome to OrbitOS Terminal' }
  ]);
  const [currentDirectory, setCurrentDirectory] = useState<string>('/home/user');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when history changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand();
    }
  };

  const executeCommand = () => {
    if (!input.trim()) return;
    
    const commandParts = input.trim().split(' ');
    const command = commandParts[0];
    const args = commandParts.slice(1);
    
    let output: string | string[];
    
    switch (command) {
      case 'echo':
        output = args.join(' ').replace(/"/g, '').replace(/'/g, '');
        break;
      case 'pwd':
        output = currentDirectory;
        break;
      case 'ls':
        output = listDirectory();
        break;
      case 'cd':
        output = changeDirectory(args[0] || '');
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'date':
        output = new Date().toString();
        break;
      case 'help':
        output = [
          'Available commands:',
          'echo [text] - Display a line of text',
          'pwd - Print working directory',
          'ls - List directory contents',
          'cd [directory] - Change directory',
          'clear - Clear the terminal',
          'date - Display the current date and time',
          'cat [file] - Display file contents',
          'whoami - Display current user',
          'help - Display this help message'
        ];
        break;
      case 'cat':
        output = catFile(args[0]);
        break;
      case 'whoami':
        output = 'user';
        break;
      default:
        output = `Command not found: ${command}`;
    }
    
    setHistory([...history, { command: input, output }]);
    setInput('');
  };

  const listDirectory = (): string[] => {
    // Mock filesystem
    const filesystem: Record<string, string[]> = {
      '/home/user': ['Documents', 'Pictures', 'Downloads', '.bashrc', 'readme.txt'],
      '/home/user/Documents': ['resume.pdf', 'notes.txt'],
      '/home/user/Pictures': ['vacation.jpg', 'profile.png'],
      '/home/user/Downloads': ['installer.exe', 'ebook.pdf']
    };
    
    return filesystem[currentDirectory] || ['No files found'];
  };

  const changeDirectory = (dir: string): string => {
    if (!dir || dir === '~') {
      setCurrentDirectory('/home/user');
      return '';
    }
    
    if (dir === '..') {
      const parts = currentDirectory.split('/');
      parts.pop();
      const newDir = parts.join('/') || '/';
      setCurrentDirectory(newDir);
      return '';
    }
    
    // Mock filesystem navigation
    const mockDirs = {
      '/home/user': ['Documents', 'Pictures', 'Downloads'],
      '/home/user/Documents': [],
      '/home/user/Pictures': [],
      '/home/user/Downloads': []
    };
    
    const availableDirs = mockDirs[currentDirectory] || [];
    
    if (availableDirs.includes(dir)) {
      setCurrentDirectory(`${currentDirectory}/${dir}`);
      return '';
    } else {
      return `cd: no such directory: ${dir}`;
    }
  };

  const catFile = (filename: string): string => {
    // Mock file contents
    const fileContents: Record<string, string> = {
      'readme.txt': 'Welcome to OrbitOS!\nThis is a terminal simulation.',
      '.bashrc': '# .bashrc\nexport PATH=$HOME/bin:$PATH\nalias ll="ls -la"',
      'notes.txt': 'Remember to update the project documentation.',
      'resume.pdf': '[Binary file not displayed]'
    };
    
    return fileContents[filename] || `cat: ${filename}: No such file`;
  };

  return (
    <div className="flex flex-col h-full bg-navy-950 text-white">
      <div className="p-2 bg-navy-900 border-b border-navy-800">
        <h1 className="text-sm font-mono">Terminal</h1>
      </div>
      <div 
        ref={terminalRef}
        className="flex-grow bg-navy-900 font-mono text-green-400 p-4 overflow-auto"
      >
        {history.map((item, index) => (
          <div key={index} className="mb-2">
            <div className="flex">
              <span className="text-blue-400 mr-2">{currentDirectory.split('/').pop()}@orbitOS:~$</span>
              <span>{item.command}</span>
            </div>
            <div className="pl-2">
              {Array.isArray(item.output) ? (
                item.output.map((line, i) => <div key={i}>{line}</div>)
              ) : (
                item.output
              )}
            </div>
          </div>
        ))}
        <div className="flex">
          <span className="text-blue-400 mr-2">{currentDirectory.split('/').pop()}@orbitOS:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="flex-grow bg-transparent outline-none"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default TerminalApp;
