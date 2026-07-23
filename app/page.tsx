"use client";

import { useState } from 'react';

export default function Home() {
  const [entity, setEntity] = useState('main_entrance');
  const [direction, setDirection] = useState('north');
  const [scoreData, setScoreData] = useState<any>(null);
  const [isScoring, setIsScoring] = useState(false);

  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isChatting, setIsChatting] = useState(false);

  // Engine 1: Deterministic Score
  const handleScore = async () => {
    setIsScoring(true);
    setScoreData(null);
    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity, direction }),
      });
      const data = await res.json();
      setScoreData(data);
    } catch (error) {
      console.error('Scoring error:', error);
    }
    setIsScoring(false);
  };

  // Engine 2: AI Chat
  const handleChat = async () => {
    setIsChatting(true);
    setChatResponse('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: chatInput }),
      });
      const data = await res.json();
      setChatResponse(data.response);
    } catch (error) {
      console.error('Chat error:', error);
    }
    setIsChatting(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-8 flex flex-col items-center gap-12">
      
      {/* HEADER */}
      <div className="text-center mt-8">
        <h1 className="text-4xl font-bold text-primary">Astrlg AI Engine</h1>
        <p className="text-foreground/60 mt-2">Backend Test Dashboard</p>
      </div>

      {/* ENGINE 1: DETERMINISTIC */}
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-accent mb-4">Engine 1: Instant Score</h2>
        <div className="flex gap-4 mb-4">
          <select 
            value={entity} 
            onChange={(e) => setEntity(e.target.value)}
            className="bg-background border border-border rounded-md p-2 w-full"
          >
            <option value="main_entrance">Main Entrance</option>
            <option value="kitchen">Kitchen</option>
            <option value="bedroom">Bedroom</option>
          </select>
          <select 
            value={direction} 
            onChange={(e) => setDirection(e.target.value)}
            className="bg-background border border-border rounded-md p-2 w-full"
          >
            <option value="north">North</option>
            <option value="north_east">North-East</option>
            <option value="east">East</option>
            <option value="south_east">South-East</option>
            <option value="south">South</option>
            <option value="south_west">South-West</option>
            <option value="west">West</option>
            <option value="north_west">North-West</option>
          </select>
        </div>
        <button 
          onClick={handleScore} 
          disabled={isScoring}
          className="w-full bg-primary text-white font-bold py-2 rounded-md hover:bg-primary/90 transition disabled:opacity-50"
        >
          {isScoring ? 'Scoring...' : 'Get Score'}
        </button>

        {scoreData && (
          <div className="mt-6 border-t border-border pt-4">
            <p className={`text-lg font-bold ${scoreData.verdict === 'favorable' ? 'text-success' : scoreData.verdict === 'highly_unfavorable' ? 'text-destructive' : 'text-accent'}`}>
              Verdict: {scoreData.verdict.replace(/_/g, ' ')}
            </p>
            <p className="text-sm mt-2 text-foreground/80">{scoreData.impact_consumer}</p>
            {scoreData.free_micro_remedy && (
              <p className="text-xs mt-2 text-foreground/60">💡 Remedy: {scoreData.free_micro_remedy}</p>
            )}
          </div>
        )}
      </div>

      {/* ENGINE 2: AI CHAT */}
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-lg mb-12">
        <h2 className="text-xl font-semibold text-accent mb-4">Engine 2: AI Consultant</h2>
        <textarea 
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask the AI about a Vastu defect..."
          className="bg-background border border-border rounded-md p-2 w-full h-24 mb-4 resize-none"
        />
        <button 
          onClick={handleChat} 
          disabled={isChatting || !chatInput}
          className="w-full bg-accent text-background font-bold py-2 rounded-md hover:bg-accent/90 transition disabled:opacity-50"
        >
          {isChatting ? 'Consulting...' : 'Ask AI'}
        </button>

        {chatResponse && (
          <div className="mt-6 border-t border-border pt-4 text-sm text-foreground/90 whitespace-pre-wrap">
            {chatResponse}
          </div>
        )}
      </div>

    </main>
  );
                                       }
