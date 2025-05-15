
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Send, Phone, Video, Image, Smile, Paperclip, MoreVertical, Search, Users, Settings, Bell } from 'lucide-react';
import { toast } from 'sonner';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isMine: boolean;
}

const ChatApp = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 'c1',
      name: 'Sarah Johnson',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=female',
      status: 'online',
      lastMessage: 'Can you send me the report?',
      lastMessageTime: '10:30 AM',
      unreadCount: 2
    },
    {
      id: 'c2',
      name: 'Michael Chen',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=male',
      status: 'online',
      lastMessage: 'The meeting is at 3pm',
      lastMessageTime: 'Yesterday',
      unreadCount: 0
    },
    {
      id: 'c3',
      name: 'Emily Rodriguez',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=female',
      status: 'away',
      lastMessage: 'Let me know when you are free',
      lastMessageTime: 'Yesterday',
      unreadCount: 0
    },
    {
      id: 'c4',
      name: 'James Wilson',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=male',
      status: 'offline',
      lastMessage: 'Thanks for the help!',
      lastMessageTime: 'Mon',
      unreadCount: 0
    },
    {
      id: 'c5',
      name: 'Lisa Thompson',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=female',
      status: 'online',
      lastMessage: 'Did you check the email?',
      lastMessageTime: 'Mon',
      unreadCount: 0
    }
  ]);
  
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    c1: [
      {
        id: 'm1',
        sender: 'c1',
        content: 'Hi there! How are you doing today?',
        timestamp: new Date(2025, 4, 15, 10, 15),
        isRead: true,
        isMine: false
      },
      {
        id: 'm2',
        sender: 'me',
        content: 'I\'m doing well, thanks for asking! How about you?',
        timestamp: new Date(2025, 4, 15, 10, 17),
        isRead: true,
        isMine: true
      },
      {
        id: 'm3',
        sender: 'c1',
        content: 'Great! I was wondering if you had time to look at the quarterly report I sent over?',
        timestamp: new Date(2025, 4, 15, 10, 20),
        isRead: true,
        isMine: false
      },
      {
        id: 'm4',
        sender: 'me',
        content: 'I haven\'t had a chance yet, but I\'ll take a look this afternoon.',
        timestamp: new Date(2025, 4, 15, 10, 22),
        isRead: true,
        isMine: true
      },
      {
        id: 'm5',
        sender: 'c1',
        content: 'Can you send me the report when you\'re done reviewing it?',
        timestamp: new Date(2025, 4, 15, 10, 25),
        isRead: false,
        isMine: false
      },
      {
        id: 'm6',
        sender: 'c1',
        content: 'I need to submit it by tomorrow morning.',
        timestamp: new Date(2025, 4, 15, 10, 25),
        isRead: false,
        isMine: false
      }
    ],
    c2: [
      {
        id: 'm7',
        sender: 'c2',
        content: 'Hey, don\'t forget we have a team meeting today at 3pm.',
        timestamp: new Date(2025, 4, 14, 9, 30),
        isRead: true,
        isMine: false
      },
      {
        id: 'm8',
        sender: 'me',
        content: 'Thanks for the reminder! I\'ll be there.',
        timestamp: new Date(2025, 4, 14, 9, 35),
        isRead: true,
        isMine: true
      }
    ],
    c3: [
      {
        id: 'm9',
        sender: 'me',
        content: 'Hi Emily, do you have time for a quick chat about the project?',
        timestamp: new Date(2025, 4, 14, 15, 10),
        isRead: true,
        isMine: true
      },
      {
        id: 'm10',
        sender: 'c3',
        content: 'I\'m in a meeting right now. Let me know when you are free later.',
        timestamp: new Date(2025, 4, 14, 15, 45),
        isRead: true,
        isMine: false
      }
    ],
    c4: [
      {
        id: 'm11',
        sender: 'c4',
        content: 'Thanks for helping me with that bug yesterday!',
        timestamp: new Date(2025, 4, 13, 11, 20),
        isRead: true,
        isMine: false
      },
      {
        id: 'm12',
        sender: 'me',
        content: 'No problem! Happy to help anytime.',
        timestamp: new Date(2025, 4, 13, 11, 25),
        isRead: true,
        isMine: true
      }
    ],
    c5: [
      {
        id: 'm13',
        sender: 'c5',
        content: 'Did you check the email I sent about the client meeting?',
        timestamp: new Date(2025, 4, 13, 9, 15),
        isRead: true,
        isMine: false
      },
      {
        id: 'm14',
        sender: 'me',
        content: 'Yes, I\'ve added it to my calendar. Thanks!',
        timestamp: new Date(2025, 4, 13, 9, 20),
        isRead: true,
        isMine: true
      }
    ]
  });
  
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set first contact as selected by default
    if (contacts.length > 0 && !selectedContact) {
      setSelectedContact(contacts[0]);
    }
  }, [contacts]);

  useEffect(() => {
    // Scroll to bottom when messages change or contact changes
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedContact]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;
    
    const newMsg: Message = {
      id: `m${Date.now()}`,
      sender: 'me',
      content: newMessage.trim(),
      timestamp: new Date(),
      isRead: false,
      isMine: true
    };
    
    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMsg]
    }));
    
    setNewMessage('');
    
    // Simulate reply after 1-3 seconds
    if (Math.random() > 0.3) { // 70% chance of reply
      const replyDelay = 1000 + Math.random() * 2000;
      
      setTimeout(() => {
        if (selectedContact) {
          const replies = [
            "That sounds great!",
            "I'll get back to you on that.",
            "Thanks for letting me know.",
            "Can we discuss this further tomorrow?",
            "I appreciate your help with this.",
            "Let me check and get back to you.",
            "Perfect, that works for me.",
            "I'm not sure I understand. Can you clarify?",
            "Got it, thanks!"
          ];
          
          const replyMsg: Message = {
            id: `m${Date.now()}`,
            sender: selectedContact.id,
            content: replies[Math.floor(Math.random() * replies.length)],
            timestamp: new Date(),
            isRead: false,
            isMine: false
          };
          
          setMessages(prev => ({
            ...prev,
            [selectedContact.id]: [...(prev[selectedContact.id] || []), replyMsg]
          }));
          
          // Update contact's last message
          setContacts(prev => 
            prev.map(contact => 
              contact.id === selectedContact.id 
                ? { 
                    ...contact, 
                    lastMessage: replyMsg.content,
                    lastMessageTime: 'Just now'
                  } 
                : contact
            )
          );
        }
      }, replyDelay);
    }
    
    // Update contact's last message immediately
    setContacts(prev => 
      prev.map(contact => 
        contact.id === selectedContact.id 
          ? { 
              ...contact, 
              lastMessage: newMessage.trim(),
              lastMessageTime: 'Just now',
              unreadCount: 0
            } 
          : contact
      )
    );
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    
    // Mark all messages as read
    if (contact.unreadCount && contact.unreadCount > 0) {
      setContacts(prev => 
        prev.map(c => 
          c.id === contact.id 
            ? { ...c, unreadCount: 0 } 
            : c
        )
      );
      
      setMessages(prev => ({
        ...prev,
        [contact.id]: (prev[contact.id] || []).map(msg => 
          !msg.isMine ? { ...msg, isRead: true } : msg
        )
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex bg-navy-950 text-white">
      {/* Contacts sidebar */}
      <div className="w-80 border-r border-navy-800 flex flex-col">
        {/* Sidebar header */}
        <div className="p-3 border-b border-navy-800 flex justify-between items-center">
          <h2 className="font-medium">Messages</h2>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-navy-800">
              <Bell size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-navy-800">
              <Users size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-navy-800">
              <Settings size={18} />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="p-3 border-b border-navy-800">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/60" />
            <Input
              placeholder="Search contacts..."
              className="pl-9 bg-navy-800 border-navy-700 text-white placeholder:text-white/60 focus:ring-navy-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Contacts list */}
        <ScrollArea className="flex-1">
          <div className="py-2">
            {filteredContacts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No contacts found
              </div>
            ) : (
              filteredContacts.map(contact => (
                <div 
                  key={contact.id}
                  className={`py-2 px-3 flex items-center cursor-pointer ${
                    selectedContact?.id === contact.id ? 'bg-navy-800' : 'hover:bg-navy-900'
                  }`}
                  onClick={() => handleContactSelect(contact)}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span 
                      className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-navy-900 ${
                        contact.status === 'online' ? 'bg-green-500' : 
                        contact.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}
                    />
                  </div>
                  
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-medium truncate">{contact.name}</span>
                      <span className="text-xs text-gray-400">{contact.lastMessageTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400 truncate">{contact.lastMessage}</span>
                      {contact.unreadCount && contact.unreadCount > 0 && (
                        <span className="text-xs bg-blue-600 rounded-full w-5 h-5 flex items-center justify-center">
                          {contact.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
      
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat header */}
            <div className="p-3 border-b border-navy-800 flex justify-between items-center">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                  <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedContact.name}</h3>
                  <span className="text-xs text-gray-400">
                    {selectedContact.status === 'online' ? 'Online' : 
                     selectedContact.status === 'away' ? 'Away' : 'Offline'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-navy-800">
                  <Phone size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-navy-800">
                  <Video size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-navy-800">
                  <MoreVertical size={18} />
                </Button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-auto" ref={messagesContainerRef}>
              {messages[selectedContact.id]?.map((message, index) => (
                <div 
                  key={message.id} 
                  className={`mb-4 flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
                >
                  {!message.isMine && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                      <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[75%] ${message.isMine ? 'order-1' : 'order-2'}`}>
                    <div 
                      className={`px-3 py-2 rounded-lg ${
                        message.isMine 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-navy-800 text-white'
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                    <div 
                      className={`text-xs text-gray-400 mt-1 flex ${
                        message.isMine ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                      {message.isMine && (
                        <span className="ml-1">
                          {message.isRead ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
            
            {/* Message input */}
            <div className="p-3 border-t border-navy-800 flex items-center">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-navy-800">
                <Paperclip size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-navy-800 mr-1">
                <Image size={18} />
              </Button>
              
              <Input
                placeholder="Type a message..."
                className="flex-1 bg-navy-800 border-navy-700 text-white"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              
              <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-navy-800 ml-1">
                <Smile size={18} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-white hover:bg-navy-800"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send size={18} />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Users size={48} className="mx-auto mb-4 text-navy-700" />
              <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
              <p className="text-gray-400">
                Choose a contact to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
