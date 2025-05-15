
import { useState, useRef, useEffect } from 'react';
import { useOrbitOS } from '@/context/OrbitOSContext';

interface Command {
  input: string;
  output: string;
  isError?: boolean;
}

const TerminalApp = () => {
  const { user, addNotification } = useOrbitOS();
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<Command[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [path, setPath] = useState('~');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // File system simulation
  const fileSystem = {
    '~': {
      type: 'directory',
      content: ['documents', 'downloads', 'pictures', '.config'],
    },
    '~/documents': {
      type: 'directory',
      content: ['readme.txt', 'todo.md'],
    },
    '~/downloads': {
      type: 'directory',
      content: ['installer.exe', 'image.jpg'],
    },
    '~/pictures': {
      type: 'directory',
      content: [],
    },
    '~/.config': {
      type: 'directory',
      content: ['settings.json'],
    },
    '~/documents/readme.txt': {
      type: 'file',
      content: 'Welcome to OrbitOS Terminal!\nThis is a sample text file.',
    },
    '~/documents/todo.md': {
      type: 'file',
      content: '# TODO\n- Learn OrbitOS\n- Build something cool\n- Have fun!',
    },
    '~/.config/settings.json': {
      type: 'file',
      content: '{\n  "theme": "dark",\n  "fontSize": 14,\n  "showWelcome": true\n}',
    },
  };

  const helpText = `
Available commands:
  help             - Show this help message
  clear            - Clear the terminal
  echo [text]      - Display text
  ls               - List files and directories
  cd [directory]   - Change directory
  cat [file]       - Show file contents
  pwd              - Print working directory
  whoami           - Show current user
  date             - Show current date and time
  notification     - Send a test notification
  history          - Show command history
  weather [city]   - Show weather (simulated)
  fortune          - Get a random quote
  exit             - Close the terminal
`;

  const commandMap: {[key: string]: (args: string[]) => string} = {
    help: () => helpText,
    
    clear: () => {
      setTimeout(() => {
        setCommandHistory([]);
      }, 100);
      return '';
    },
    
    echo: (args) => args.join(' '),
    
    ls: () => {
      const currentPath = path as keyof typeof fileSystem;
      const dir = fileSystem[currentPath];
      
      if (!dir || dir.type !== 'directory') {
        return 'Error: Not a directory';
      }
      
      if (dir.content.length === 0) {
        return 'Directory is empty';
      }
      
      return dir.content.join('\n');
    },
    
    cd: (args) => {
      if (!args[0]) {
        setPath('~');
        return '';
      }
      
      let newPath: string;
      
      if (args[0].startsWith('/')) {
        newPath = args[0];
      } else if (args[0] === '..') {
        const pathParts = path.split('/');
        pathParts.pop();
        newPath = pathParts.join('/') || '~';
      } else {
        newPath = path === '~' ? `${path}/${args[0]}` : `${path}/${args[0]}`;
      }
      
      if (fileSystem[newPath as keyof typeof fileSystem]) {
        if (fileSystem[newPath as keyof typeof fileSystem].type === 'directory') {
          setPath(newPath);
          return '';
        }
        return `cd: not a directory: ${args[0]}`;
      }
      
      return `cd: no such directory: ${args[0]}`;
    },
    
    cat: (args) => {
      if (!args[0]) {
        return 'cat: missing file operand';
      }
      
      const filePath = args[0].startsWith('/') ? args[0] : `${path}/${args[0]}`;
      const fileKey = filePath as keyof typeof fileSystem;
      
      if (fileSystem[fileKey]) {
        if (fileSystem[fileKey].type === 'file') {
          return fileSystem[fileKey].content;
        }
        return `cat: ${args[0]}: Is a directory`;
      }
      
      return `cat: ${args[0]}: No such file or directory`;
    },
    
    pwd: () => path,
    
    whoami: () => user?.username || 'unknown',
    
    date: () => new Date().toString(),
    
    notification: () => {
      addNotification({
        title: 'Terminal',
        message: 'This is a test notification from the terminal',
        icon: 'terminal'
      });
      return 'Notification sent!';
    },
    
    history: () => {
      if (commandHistory.length === 0) {
        return 'No command history';
      }
      return commandHistory.map((cmd, i) => `${i + 1}  ${cmd.input}`).join('\n');
    },
    
    weather: (args) => {
      const city = args.join(' ') || 'Current Location';
      const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Windy', 'Snowy', 'Foggy'];
      const temp = Math.floor(Math.random() * 35) + 5; // 5 to 40 degrees
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      
      return `
Weather for ${city}:
Temperature: ${temp}°C
Conditions: ${condition}
Humidity: ${Math.floor(Math.random() * 60) + 30}%

Note: This is simulated weather data.
`;
    },
    
    fortune: () => {
      const fortunes = [
        "If you're feeling down, remember that at least your code compiled.",
        "Today is a good day to refactor your life.",
        "The bugs you fixed today will inspire new bugs tomorrow.",
        "Every cursor moves in mysterious ways.",
        "You will soon push to production without testing.",
        "A wise programmer once said: it works on my machine.",
        "The best code is the one you didn't have to write.",
        "You will find the solution in the most unexpected Stack Overflow thread.",
        "Your next commit will break the build.",
        "Success is relative; the more relatives, the more success."
      ];
      
      return fortunes[Math.floor(Math.random() * fortunes.length)];
    },
    
    exit: () => {
      window.parent.postMessage({ type: 'CLOSE_APP', appId: 'terminal' }, '*');
      return 'Closing terminal...';
    }
  };

  // Handle command execution
  const executeCommand = (commandStr: string) => {
    if (!commandStr.trim()) return;
    
    const args = commandStr.trim().split(' ');
    const command = args.shift()?.toLowerCase();
    
    let output = '';
    let isError = false;
    
    if (command && commandMap[command]) {
      output = commandMap[command](args);
    } else {
      output = `Command not found: ${command}`;
      isError = true;
    }
    
    // Add to command history
    setCommandHistory([...commandHistory, { input: commandStr, output, isError }]);
    setInput('');
    setHistoryIndex(-1);
  };

  // Handle keyboard navigation through history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex].input);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex].input);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  // Scroll to bottom when new command is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);

  // Focus input on mount and when terminal is clicked
  useEffect(() => {
    inputRef.current?.focus();
    
    // Add welcome message
    if (commandHistory.length === 0) {
      setCommandHistory([{
        input: 'Welcome to OrbitOS Terminal',
        output: 'Type "help" for a list of available commands.'
      }]);
    }
  }, []);

  return (
    <div 
      className="h-full flex flex-col bg-black font-mono text-green-500 p-2 overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal output */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto pb-4"
      >
        {commandHistory.map((cmd, index) => (
          <div key={index} className="mb-2">
            {cmd.input !== 'Welcome to OrbitOS Terminal' && (
              <div className="flex">
                <span className="text-blue-400">{user?.username || 'user'}@orbit</span>
                <span className="text-white">:</span>
                <span className="text-purple-400">{path}</span>
                <span className="text-white">$ </span>
                <span>{cmd.input}</span>
              </div>
            )}
            {cmd.output && (
              <pre className={`mt-1 whitespace-pre-wrap ${cmd.isError ? 'text-red-500' : ''}`}>
                {cmd.output}
              </pre>
            )}
          </div>
        ))}
        
        {/* Current input line */}
        <div className="flex">
          <span className="text-blue-400">{user?.username || 'user'}@orbit</span>
          <span className="text-white">:</span>
          <span className="text-purple-400">{path}</span>
          <span className="text-white">$ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none border-none text-green-500"
            spellCheck="false"
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
};

export default TerminalApp;
