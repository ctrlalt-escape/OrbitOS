import React from 'react';

const TerminalApp = () => {
  return (
    <div className="flex flex-col h-full bg-navy-950 text-white p-4">
      <h1 className="text-xl font-semibold mb-4">Terminal</h1>
      <div className="flex-grow bg-navy-900 rounded-md p-4 font-mono text-green-400">
        <p>$ echo "Terminal functionality coming soon..."</p>
        <p>Terminal functionality coming soon...</p>
        <p>$_</p>
      </div>
    </div>
  );
};

export default TerminalApp;
