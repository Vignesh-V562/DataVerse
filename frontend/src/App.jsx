import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { supabase } from './lib/supabaseClient';
import Login from './components/Login';
import IconRail from './components/layout/IconRail';
import Sidebar from './components/layout/Sidebar';
import InsightsPanel from './components/layout/InsightsPanel';
import UploadZone from './components/data/UploadZone';
import MessageBubble from './components/chat/MessageBubble';
import {
  Send,
  Loader2,
  Plus,
  FileText,
  BarChart3,
  Sigma,
  Mic,
  ChevronDown,
  Clock,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [charts, setCharts] = useState([]);
  const [sessions, setSessions] = useState([]);
  const messagesEndRef = useRef(null);

  /* ─── Scroll & Auth ─── */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  /* ─── Fetch Session History ─── */
  const fetchSessions = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await axios.get(`${API_BASE}/sessions`, { headers });
      setSessions(res.data);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user, fetchSessions]);

  /* ─── Auth Helpers ─── */
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const resetSession = () => {
    setSession(null);
    setMessages([]);
    setCharts([]);
  };

  const getAuthHeaders = async () => {
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();
    if (!currentSession) throw new Error('Not authenticated');
    return {
      Authorization: `Bearer ${currentSession.access_token}`,
    };
  };

  /* ─── Load Existing Session ─── */
  const handleSelectSession = async (sessionId) => {
    try {
      const headers = await getAuthHeaders();
      const res = await axios.get(`${API_BASE}/sessions/${sessionId}/history`, { headers });
      
      setSession(sessionId);
      setCharts([]);

      const loadedMessages = [];
      const summary = res.data.summary;

      // Add the initial summary message
      if (summary) {
        loadedMessages.push({
          role: 'assistant',
          content: `Dataset loaded — **${summary.total_rows?.toLocaleString()}** records across **${summary.total_columns}** dimensions.`,
          summary: summary,
        });
      }

      // Add chat history messages and extract charts
      const loadedCharts = [];
      if (res.data.messages && res.data.messages.length > 0) {
        for (const msg of res.data.messages) {
          const message = { role: msg.role, content: msg.content };
          if (msg.plot_data) {
            message.plot_json = msg.plot_data;
            loadedCharts.push({
              data: msg.plot_data.data,
              layout: msg.plot_data.layout,
              title: msg.role === 'user' ? msg.content.substring(0, 40) : `Chart ${loadedCharts.length + 1}`,
            });
          }
          loadedMessages.push(message);
        }
      }

      setMessages(loadedMessages);
      setCharts(loadedCharts);
    } catch (err) {
      console.error('Failed to load session:', err);
      alert('Failed to load session: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    try {
      const headers = await getAuthHeaders();
      await axios.delete(`${API_BASE}/sessions/${sessionId}`, { headers });
      
      // If we deleted the active session, reset it
      if (session === sessionId) {
        resetSession();
      }
      // Refresh the list
      fetchSessions();
    } catch (err) {
      console.error('Failed to delete session:', err);
      alert('Failed to delete session: ' + (err.response?.data?.detail || err.message));
    }
  };

  /* ─── Data Upload ─── */
  const handleUploadResult = (data) => {
    setSession(data.session_id);
    const summary = data.summary;
    setMessages([
      {
        role: 'assistant',
        content: `Dataset loaded successfully — **${summary.total_rows.toLocaleString()}** records across **${summary.total_columns}** dimensions detected.\n\nAsk me anything about your data — trends, comparisons, anomalies, or visualizations.`,
        summary: summary,
      },
    ]);
    // Refresh session list
    fetchSessions();
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);
    try {
      const headers = await getAuthHeaders();
      const res = await axios.post(`${API_BASE}/upload`, formData, { headers });
      handleUploadResult(res.data);
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append('url', urlInput);
    try {
      const headers = await getAuthHeaders();
      const res = await axios.post(`${API_BASE}/upload`, formData, { headers });
      handleUploadResult(res.data);
    } catch (err) {
      alert('URL Processing failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  /* ─── Chat ─── */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentMessage.trim() || !session) return;

    const userMsg = currentMessage;
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userMsg },
      { role: 'assistant', isTyping: true },
    ]);
    setCurrentMessage('');

    try {
      const headers = await getAuthHeaders();
      const res = await axios.post(
        `${API_BASE}/query`,
        { session_id: session, question: userMsg },
        { headers }
      );

      // Mirror chart to Insights Surface
      if (res.data.plot_json) {
        setCharts((prev) => [
          ...prev,
          {
            data: res.data.plot_json.data,
            layout: res.data.plot_json.layout,
            title: userMsg.length > 40 ? userMsg.substring(0, 40) + '...' : userMsg,
          },
        ]);
      }

      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs.pop();
        newMsgs.push({
          role: 'assistant',
          content: res.data.answer,
          plot_json: res.data.plot_json,
        });
        return newMsgs;
      });
    } catch (err) {
      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs.pop();
        newMsgs.push({
          role: 'assistant',
          content: 'Error: ' + (err.response?.data?.detail || err.message),
        });
        return newMsgs;
      });
    }
  };

  /* ─── Suggested Prompts ─── */
  const suggestedPrompts = [
    'How did each product category perform?',
    'Compare revenue by region',
    'What about recent trends?',
  ];

  /* ─── Loading State ─── */
  if (authLoading) {
    return (
      <div className="min-h-screen bg-dv-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sage-500 animate-spin" />
      </div>
    );
  }

  if (!user) return <Login />;

  /* ─── Main Layout ─── */
  return (
    <div className="h-screen flex bg-dv-bg overflow-hidden">
      {/* 1. Icon Rail */}
      <IconRail onHomeClick={resetSession} />

      {/* 2. Sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          user={user}
          handleSignOut={handleSignOut}
          resetSession={resetSession}
          session={session}
          sessions={sessions}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
        />
      </div>

      {/* 3. Chat Workspace */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-white/[0.06] shrink-0 bg-dv-bg">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-txt-primary">Chat Workspace</h2>
            <ChevronDown className="w-3.5 h-3.5 text-txt-tertiary" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-dv-elevated/60 px-3 py-1.5 rounded-full border border-white/[0.06]">
              <span className="w-1.5 h-1.5 rounded-full bg-sage-500" />
              <span className="text-[11px] text-txt-secondary font-medium">Auto-save on</span>
            </div>
            <button className="dv-rail-btn w-8 h-8" title="History">
              <Clock className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {!session ? (
            <UploadZone
              onDrop={onDrop}
              urlInput={urlInput}
              setUrlInput={setUrlInput}
              handleUrlSubmit={handleUrlSubmit}
              isLoading={isLoading}
            />
          ) : (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="max-w-3xl mx-auto space-y-6">
                  {messages.map((msg, idx) => (
                    <MessageBubble key={idx} msg={msg} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Suggested Prompt Chips */}
              {messages.length <= 2 && (
                <div className="px-6 pb-2">
                  <div className="max-w-3xl mx-auto flex gap-2 flex-wrap">
                    {suggestedPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentMessage(prompt)}
                        className="px-4 py-2 rounded-full bg-dv-card border border-white/[0.06] text-xs text-txt-secondary hover:text-txt-primary hover:border-sage-500/20 transition-all"
                      >
                        <span className="text-sage-400 mr-1.5">✦</span>
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input Bar */}
              <div className="px-6 pb-4 pt-2 bg-dv-bg shrink-0">
                <div className="max-w-3xl mx-auto">
                  <form onSubmit={handleSendMessage} className="relative">
                    <input
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Ask anything about your data..."
                      className="w-full bg-dv-card border border-white/[0.08] rounded-2xl pl-5 pr-28 py-4 text-sm text-txt-primary placeholder-txt-tertiary focus:outline-none focus:border-sage-500/30 focus:ring-1 focus:ring-sage-500/20 transition-all"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      <button type="button" className="dv-rail-btn w-9 h-9" title="Voice input">
                        <Mic className="w-4 h-4" />
                      </button>
                      <button
                        type="submit"
                        disabled={!currentMessage.trim()}
                        className="dv-btn-coral disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4 ml-0.5" />
                      </button>
                    </div>
                  </form>

                  <div className="flex items-center gap-0.5 mt-2 px-1">
                    <button type="button" className="dv-rail-btn w-8 h-8" title="Attach file">
                      <Plus className="w-4 h-4" />
                    </button>
                    <button type="button" className="dv-rail-btn w-8 h-8" title="Documents">
                      <FileText className="w-4 h-4" />
                    </button>
                    <button type="button" className="dv-rail-btn w-8 h-8" title="Charts">
                      <BarChart3 className="w-4 h-4" />
                    </button>
                    <button type="button" className="dv-rail-btn w-8 h-8" title="Formulas">
                      <Sigma className="w-4 h-4" />
                    </button>
                    <div className="flex-1" />
                    <p className="text-[10px] text-txt-tertiary">
                      DataVerse can make mistakes. Please verify important information.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* 4. Insights Surface */}
      <InsightsPanel charts={charts} />
    </div>
  );
}

export default App;
