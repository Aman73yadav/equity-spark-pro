import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Send, Phone, Video, MoreVertical, Search } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
}

const Messages = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    const { data } = await supabase
      .from('agents')
      .select('*')
      .limit(10);
    
    if (data) {
      setAgents(data);
      if (data.length > 0) setSelectedAgent(data[0]);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedAgent) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'me',
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate agent response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Thanks for your message! I'll get back to you shortly.",
        sender: 'agent',
        timestamp: new Date(),
      }]);
    }, 1000);
  };

  return (
    <Layout>
      <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Messages
        </h1>
        <p className="text-muted-foreground">Chat with agents directly</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* Agents List */}
        <Card className="lg:col-span-1 border-none overflow-hidden" style={{ background: 'var(--gradient-card)', boxShadow: 'var(--shadow-md)' }}>
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search agents..." className="pl-10" />
            </div>
          </div>
          <ScrollArea className="h-[calc(600px-80px)]">
            <div className="p-2">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                    selectedAgent?.id === agent.id 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-background/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                        {agent.name.charAt(0)}
                      </div>
                      {agent.status === 'available' && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-success rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{agent.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {agent.status === 'available' ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-3 border-none flex flex-col" style={{ background: 'var(--gradient-card)', boxShadow: 'var(--shadow-lg)' }}>
          {selectedAgent ? (
            <>
              <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-primary/10 to-accent/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                    {selectedAgent.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{selectedAgent.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedAgent.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No messages yet. Start a conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.sender === 'me'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {msg.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button 
                    onClick={sendMessage}
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Select an agent to start messaging</p>
            </div>
          )}
        </Card>
      </div>
      </div>
    </Layout>
  );
};

export default Messages;
