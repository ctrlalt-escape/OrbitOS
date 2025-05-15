
import React, { useState } from 'react';

// Sample emails data
const sampleEmails = [
  {
    id: 1,
    from: "john.doe@example.com",
    subject: "Project Update - Q3 Report",
    preview: "Hi team, I've attached the Q3 report for your review. Please provide feedback by...",
    date: "2023-12-05",
    read: true,
    starred: false
  },
  {
    id: 2,
    from: "marketing@company.com",
    subject: "New Marketing Campaign Ideas",
    preview: "Let's discuss the upcoming marketing campaign for the holiday season...",
    date: "2023-12-04",
    read: false,
    starred: true
  },
  {
    id: 3,
    from: "support@service.com",
    subject: "Your Support Ticket #4528",
    preview: "Thank you for contacting us. Your ticket has been resolved...",
    date: "2023-12-03",
    read: true,
    starred: false
  },
  {
    id: 4,
    from: "newsletter@tech.com",
    subject: "This Week in Technology - Latest Updates",
    preview: "The latest tech news: AI advancements, new product launches, and more...",
    date: "2023-12-01",
    read: false,
    starred: false
  },
  {
    id: 5,
    from: "hr@company.com",
    subject: "Important: Company Policy Updates",
    preview: "Please review the attached document regarding updates to our remote work policy...",
    date: "2023-11-28",
    read: true,
    starred: true
  }
];

const MailApp = () => {
  const [selectedEmail, setSelectedEmail] = useState<typeof sampleEmails[0] | null>(null);
  const [emails, setEmails] = useState(sampleEmails);
  const [currentFolder, setCurrentFolder] = useState('inbox');

  const handleEmailClick = (email: typeof sampleEmails[0]) => {
    // Mark as read
    setEmails(emails.map(e => 
      e.id === email.id ? { ...e, read: true } : e
    ));
    setSelectedEmail(email);
  };

  const handleStarEmail = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmails(emails.map(email => 
      email.id === id ? { ...email, starred: !email.starred } : email
    ));
  };

  const handleDeleteEmail = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmails(emails.filter(email => email.id !== id));
    if (selectedEmail?.id === id) {
      setSelectedEmail(null);
    }
  };

  return (
    <div className="flex h-full bg-gray-100">
      {/* Sidebar */}
      <div className="w-48 bg-gray-800 text-white p-3">
        <div className="mb-6">
          <button className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 px-4 rounded-md">
            Compose
          </button>
        </div>
        <ul className="space-y-1">
          <li>
            <button 
              className={`w-full text-left py-2 px-3 rounded-md ${currentFolder === 'inbox' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              onClick={() => setCurrentFolder('inbox')}
            >
              Inbox {emails.filter(e => !e.read).length > 0 && `(${emails.filter(e => !e.read).length})`}
            </button>
          </li>
          <li>
            <button 
              className={`w-full text-left py-2 px-3 rounded-md ${currentFolder === 'starred' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              onClick={() => setCurrentFolder('starred')}
            >
              Starred
            </button>
          </li>
          <li>
            <button 
              className={`w-full text-left py-2 px-3 rounded-md ${currentFolder === 'sent' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              onClick={() => setCurrentFolder('sent')}
            >
              Sent
            </button>
          </li>
          <li>
            <button 
              className={`w-full text-left py-2 px-3 rounded-md ${currentFolder === 'drafts' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              onClick={() => setCurrentFolder('drafts')}
            >
              Drafts
            </button>
          </li>
          <li>
            <button 
              className={`w-full text-left py-2 px-3 rounded-md ${currentFolder === 'trash' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              onClick={() => setCurrentFolder('trash')}
            >
              Trash
            </button>
          </li>
        </ul>
      </div>

      {/* Email List */}
      <div className="w-64 border-r border-gray-300 overflow-y-auto">
        <div className="p-2 border-b border-gray-300 bg-gray-200">
          <input 
            type="text" 
            placeholder="Search mail..." 
            className="w-full p-2 rounded-md border border-gray-300"
          />
        </div>
        <div>
          {emails.map(email => (
            <div 
              key={email.id}
              onClick={() => handleEmailClick(email)}
              className={`p-3 border-b border-gray-200 cursor-pointer ${email.read ? 'bg-white' : 'bg-blue-50'} hover:bg-gray-100`}
            >
              <div className="flex justify-between items-center mb-1">
                <div className="font-medium truncate flex-1">{email.from}</div>
                <div className="text-xs text-gray-500">{email.date}</div>
              </div>
              <div className="font-medium mb-1 truncate">{email.subject}</div>
              <div className="text-sm text-gray-500 truncate">{email.preview}</div>
              <div className="flex mt-2 justify-between">
                <button 
                  onClick={(e) => handleStarEmail(email.id, e)}
                  className={`${email.starred ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500`}
                >
                  ★
                </button>
                <button 
                  onClick={(e) => handleDeleteEmail(email.id, e)}
                  className="text-gray-400 hover:text-red-500"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 bg-white overflow-y-auto">
        {selectedEmail ? (
          <div className="p-4">
            <div className="mb-4 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-medium mb-3">{selectedEmail.subject}</h2>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="font-medium">{selectedEmail.from}</div>
                  <div className="text-sm text-gray-500">To: me</div>
                </div>
                <div className="text-sm text-gray-500">{selectedEmail.date}</div>
              </div>
            </div>
            <div className="prose">
              <p>{selectedEmail.preview}</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>
              <p>Best regards,</p>
              <p>The Sender</p>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Reply</button>
                <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Forward</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select an email to view its content
          </div>
        )}
      </div>
    </div>
  );
};

export default MailApp;
