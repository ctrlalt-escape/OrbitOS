
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Command {
  command: string;
  output: string;
}

const TerminalApp = () => {
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<Command[]>([
    { 
      command: '', 
      output: "Welcome to OrbitOS Terminal v1.0.0\nType 'help' to see available commands." 
    }
  ]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Scroll to bottom when command history changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [commandHistory]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      executeCommand(input);
      setInput('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateHistory('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateHistory('down');
    }
  };

  const navigateHistory = (direction: 'up' | 'down') => {
    const commands = commandHistory
      .filter(entry => entry.command)
      .map(entry => entry.command);
    
    if (commands.length === 0) return;

    if (direction === 'up') {
      if (historyIndex < commands.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commands[commands.length - 1 - newIndex]);
      }
    } else {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commands[commands.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    const parts = trimmedCmd.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    let output: string = '';

    // Ensure output is always a string
    switch (command) {
      case 'help':
        output = getHelpText();
        break;
      case 'echo':
        output = args.join(' ') || '';
        break;
      case 'date':
        output = new Date().toString();
        break;
      case 'clear':
        setCommandHistory([{ 
          command: '', 
          output: "Terminal cleared. Type 'help' to see available commands." 
        }]);
        return;
      case 'ls':
        output = getLsOutput(args);
        break;
      case 'whoami':
        output = 'orbit-user';
        break;
      case 'uname':
        output = 'OrbitOS v1.0.0';
        break;
      case 'pwd':
        output = '/home/orbit-user';
        break;
      case 'mkdir':
        output = args.length ? `Created directory: ${args[0]}` : 'Error: Directory name required';
        break;
      default:
        output = `Command not found: ${command}. Type 'help' for available commands.`;
    }

    setCommandHistory([...commandHistory, { command: trimmedCmd, output }]);
  };

  // Ensure all command functions return strings
  const getLsOutput = (args: string[]): string => {
    const files = [
      'Documents', 
      'Pictures', 
      'Music', 
      'Videos', 
      'Downloads', 
      'Applications', 
      'system.config'
    ];
    
    if (args.includes('-l')) {
      return files.map(file => `drwxr-xr-x 1 orbit-user staff 0 May 15 10:00 ${file}`).join('\n');
    }
    
    return files.join('  ');
  };

  const getHelpText = (): string => {
    return `
Available commands:
  help          Show this help message
  echo [text]   Print text to the terminal
  date          Show current date and time
  clear         Clear the terminal
  ls [-l]       List files and directories
  whoami        Show current user
  uname         Show system information
  pwd           Print working directory
  mkdir [name]  Create a new directory
    `.trim();
  };

  return (
    <div className="flex flex-col h-full bg-black text-green-400 font-mono text-sm">
      <div className="p-2 bg-black border-b border-green-900">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="mx-auto text-green-400">Terminal</span>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-2" viewportRef={scrollAreaRef}>
        <div>
          {commandHistory.map((entry, i) => (
            <div key={i} className="mb-1">
              {entry.command && (
                <div className="flex">
                  <span className="text-green-500">orbit-user@orbitOS:~$</span>
                  <span className="ml-2">{entry.command}</span>
                </div>
              )}
              <pre className="whitespace-pre-wrap mt-1 text-green-300">{entry.output}</pre>
            </div>
          ))}
          
          <div className="flex mt-2">
            <span className="text-green-500">orbit-user@orbitOS:~$</span>
            <Input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="ml-2 bg-transparent border-0 outline-none text-green-300 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default TerminalApp;
