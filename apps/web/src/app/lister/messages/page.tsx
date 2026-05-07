'use client';

import { useState } from 'react';
import { PaperPlaneRight, User } from '@phosphor-icons/react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/layout/container';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ListerMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [message, setMessage] = useState('');

  const conversations = [
    {
      id: 1,
      renter: 'John Doe',
      vehicle: 'Lamborghini Urus',
      lastMessage: 'Can I extend the booking by 2 days?',
      time: '2h ago',
      unread: true,
    },
    {
      id: 2,
      renter: 'Jane Smith',
      vehicle: 'Tesla Model S',
      lastMessage: 'Where is the charging cable located?',
      time: '5h ago',
      unread: true,
    },
    {
      id: 3,
      renter: 'Mike Johnson',
      vehicle: 'Porsche 911',
      lastMessage: 'Thanks for the smooth rental experience!',
      time: '1d ago',
      unread: false,
    },
    {
      id: 4,
      renter: 'ABC Logistics',
      vehicle: 'Mercedes-Benz Sprinter',
      lastMessage: 'What time can we pick up the vehicle?',
      time: '2d ago',
      unread: false,
    },
  ];

  const messages = [
    { id: 1, sender: 'renter', text: 'Hi, I just booked your Lamborghini Urus for next week.', time: '10:30 AM' },
    { id: 2, sender: 'lister', text: 'Great! Thanks for booking. Looking forward to hosting you.', time: '10:35 AM' },
    { id: 3, sender: 'renter', text: 'Can I extend the booking by 2 days?', time: '2:15 PM' },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setMessage('');
    }
  };

  const selected = conversations.find(c => c.id === selectedConversation);

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <Container size="lg">
          <div className="mb-8">
            <h1 className="text-3xl font-medium text-neutral-900 mb-2">Messages</h1>
            <p className="text-neutral-600">Communicate with renters</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <h2 className="text-lg font-medium text-neutral-900 mb-4">Conversations</h2>
              <div className="space-y-2">
                {conversations.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedConversation === conv.id
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : conv.unread
                        ? 'bg-neutral-50 border-neutral-300 hover:border-neutral-400'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className={`text-sm font-medium ${selectedConversation === conv.id ? 'text-white' : 'text-neutral-900'}`}>
                        {conv.renter}
                      </p>
                      <p className={`text-xs ${selectedConversation === conv.id ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        {conv.time}
                      </p>
                    </div>
                    <p className={`text-xs mb-2 ${selectedConversation === conv.id ? 'text-neutral-300' : 'text-neutral-600'}`}>
                      {conv.vehicle}
                    </p>
                    <p className={`text-sm line-clamp-1 ${selectedConversation === conv.id ? 'text-neutral-200' : 'text-neutral-700'}`}>
                      {conv.lastMessage}
                    </p>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="lg:col-span-2">
              {selected && (
                <>
                  <div className="border-b border-neutral-200 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center">
                        <User size={20} weight="bold" className="text-neutral-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-neutral-900">{selected.renter}</h2>
                        <p className="text-sm text-neutral-600">{selected.vehicle}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'lister' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs p-3 rounded-lg ${
                            msg.sender === 'lister'
                              ? 'bg-neutral-900 text-white'
                              : 'bg-neutral-100 text-neutral-900'
                          }`}
                        >
                          <p className="text-sm mb-1">{msg.text}</p>
                          <p className={`text-xs ${msg.sender === 'lister' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSend} className="flex gap-3">
                    <Textarea
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={2}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!message.trim()}>
                      <PaperPlaneRight size={20} weight="bold" />
                    </Button>
                  </form>
                </>
              )}
            </Card>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
