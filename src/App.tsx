import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Cloud, 
  BarChart, 
  CreditCard, 
  Palette, 
  Code, 
  X,
  ArrowRight,
  ShieldCheck,
  Zap,
  Brain,
  Sparkles,
  Globe,
  MapPin,
  Image as ImageIcon,
  Loader2,
  Command,
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_PERKS, Perk } from './types';
import { cn } from './lib/utils';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

// --- Types & Constants ---

interface GroundingChunk {
  web?: { uri: string; title: string };
  maps?: { uri: string; title: string };
}

// --- Gemini Service ---

const getGemini = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- Components ---

const Navbar: React.FC<{ onOpenSubmit: () => void }> = ({ onOpenSubmit }) => (
  <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl">
    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-500/20">
          <Zap size={22} fill="currentColor" />
        </div>
        <div className="flex flex-col">
          <span className="font-display text-xl font-extrabold tracking-tight text-white">
            Founders<span className="text-brand-500">Fuel</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Intelligence Platform</span>
        </div>
      </div>
      
      <div className="hidden items-center gap-8 md:flex">
        <a href="#" className="text-sm font-medium text-slate-400 transition-colors hover:text-white">Directory</a>
        <a href="#" className="text-sm font-medium text-slate-400 transition-colors hover:text-white">AI Assistant</a>
        <a href="#" className="text-sm font-medium text-slate-400 transition-colors hover:text-white">Ecosystem</a>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenSubmit}
          className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={16} />
          <span>Submit Perk</span>
        </button>
      </div>
    </div>
  </nav>
);

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'Cloud': return <Cloud size={14} />;
    case 'Marketing': return <BarChart size={14} />;
    case 'Finance': return <CreditCard size={14} />;
    case 'Design': return <Palette size={14} />;
    case 'Developer Tools': return <Code size={14} />;
    case 'AI': return <Brain size={14} />;
    default: return <Zap size={14} />;
  }
};

const PerkCard: React.FC<{ perk: Perk; onAnalyze: (perk: Perk) => void }> = ({ perk, onAnalyze }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-8 transition-all hover:border-brand-500/30 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-brand-500/10"
  >
    <div className="mb-6 flex items-start justify-between">
      <div className="relative">
        <div className="absolute -inset-2 rounded-2xl bg-brand-500/20 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3 transition-colors group-hover:bg-white/10">
          <img 
            src={perk.logo} 
            alt={perk.name} 
            className="h-full w-full object-contain brightness-0 invert"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-1.5 rounded-full bg-brand-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-400 border border-brand-500/20">
          <CategoryIcon category={perk.category} />
          {perk.category}
        </div>
      </div>
    </div>
    
    <div className="mb-4">
      <h3 className="font-display text-xl font-bold text-white group-hover:text-brand-400 transition-colors">{perk.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-slate-400 leading-relaxed">
        {perk.description}
      </p>
    </div>

    <div className="mt-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck size={14} />
          </div>
          <span className="text-sm font-bold text-emerald-400">{perk.value}</span>
        </div>
        <button 
          onClick={() => onAnalyze(perk)}
          className="rounded-full p-2 text-slate-500 hover:bg-white/10 hover:text-brand-400 transition-all"
          title="Analyze with AI"
        >
          <Sparkles size={16} />
        </button>
      </div>
      
      <a 
        href={perk.website}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/[0.05] py-3.5 text-sm font-bold text-white transition-all hover:bg-brand-600 group-hover:shadow-lg group-hover:shadow-brand-500/20"
      >
        Claim Access
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </a>
    </div>
  </motion.div>
);

const AISidebar: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  selectedPerk: Perk | null;
}> = ({ isOpen, onClose, selectedPerk }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPerk && isOpen) {
      analyzePerk();
    }
  }, [selectedPerk, isOpen]);

  const analyzePerk = async () => {
    if (!selectedPerk) return;
    setLoading(true);
    setAnalysis('');
    try {
      const ai = getGemini();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this startup perk for a founder: ${selectedPerk.name}. 
        Description: ${selectedPerk.description}. 
        Value: ${selectedPerk.value}. 
        Provide a concise "Founder's Verdict" on whether it's worth it and how to maximize it. Use markdown.`,
      });
      setAnalysis(response.text || 'No analysis available.');
    } catch (error) {
      setAnalysis('Failed to generate analysis. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 z-[70] h-full w-full max-w-md border-l border-white/10 bg-[#0a0f1e] p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Sparkles className="text-brand-400" size={20} />
                <h2 className="font-display text-xl font-bold text-white">AI Intelligence</h2>
              </div>
              <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10 text-slate-400">
                <X size={20} />
              </button>
            </div>

            {selectedPerk && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 border border-white/5">
                  <img src={selectedPerk.logo} className="h-10 w-10 brightness-0 invert" alt="" />
                  <div>
                    <h3 className="font-bold text-white">{selectedPerk.name}</h3>
                    <p className="text-xs text-brand-400 font-bold">{selectedPerk.value}</p>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <Loader2 className="animate-spin text-brand-500" size={32} />
                      <p className="text-sm text-slate-400 animate-pulse">Analyzing ecosystem data...</p>
                    </div>
                  ) : (
                    <div className="text-slate-300 text-sm leading-relaxed">
                      <Markdown>{analysis}</Markdown>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SearchGrounding: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string>('');
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResults('');
    setSources([]);
    try {
      const ai = getGemini();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Find the latest startup perks, credits, or student discounts for: ${query}. Provide a summary and list of specific offers.`,
        config: { tools: [{ googleSearch: {} }] },
      });
      setResults(response.text || '');
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) setSources(chunks as GroundingChunk[]);
    } catch (error) {
      setResults('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
          <Globe size={20} />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-white">Global Perk Search</h3>
          <p className="text-sm text-slate-500">Search the live web for unlisted credits</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="relative mb-6">
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. 'Latest AI credits for YC startups'"
          className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-white outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        <button 
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"
        >
          Search Web
        </button>
      </form>

      {loading && (
        <div className="flex items-center justify-center py-10 gap-3">
          <Loader2 className="animate-spin text-brand-500" size={24} />
          <span className="text-sm text-slate-400">Consulting Google Search...</span>
        </div>
      )}

      {results && (
        <div className="space-y-6">
          <div className="prose prose-invert max-w-none text-sm text-slate-300">
            <Markdown>{results}</Markdown>
          </div>
          
          {sources.length > 0 && (
            <div className="border-t border-white/5 pt-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Verified Sources</h4>
              <div className="flex flex-wrap gap-3">
                {sources.map((source, i) => source.web && (
                  <a 
                    key={i}
                    href={source.web.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Globe size={12} />
                    {source.web.title || 'Source'}
                    <ExternalLink size={10} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MapsGrounding: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [hubs, setHubs] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const findHubs = async () => {
    setLoading(true);
    try {
      let lat = 37.7749, lng = -122.4194; // Default SF
      
      if (navigator.geolocation) {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        setLocation({ lat, lng });
      }

      const ai = getGemini();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Find startup hubs, co-working spaces, and venture offices nearby.",
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: { latLng: { latitude: lat, longitude: lng } }
          }
        },
      });
      setHubs(response.text || '');
    } catch (error) {
      setHubs('Could not find nearby hubs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/10 text-accent-500 border border-accent-500/20">
          <MapPin size={20} />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-white">Ecosystem Map</h3>
          <p className="text-sm text-slate-500">Find venture hubs and offices near you</p>
        </div>
      </div>

      {!hubs && !loading ? (
        <button 
          onClick={findHubs}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 py-4 text-sm font-bold text-white hover:bg-white/10 transition-all"
        >
          <MapPin size={16} />
          Locate Nearby Hubs
        </button>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-10 gap-3">
              <Loader2 className="animate-spin text-accent-500" size={24} />
              <span className="text-sm text-slate-400">Scanning local ecosystem...</span>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none text-sm text-slate-300">
              <Markdown>{hubs}</Markdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AICreativeStudio: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt) return;
    setLoading(true);
    setResult(null);
    try {
      const ai = getGemini();
      const base64Data = image.split(',')[1];
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: 'image/png' } },
            { text: prompt }
          ]
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setResult(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error('Image edit failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
          <ImageIcon size={20} />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-white">AI Creative Studio</h3>
          <p className="text-sm text-slate-500">Edit your startup assets with Gemini 2.5 Flash Image</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-white/10 bg-white/5 transition-all hover:border-brand-500/50 hover:bg-white/10"
          >
            {image ? (
              <img src={image} alt="Upload" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <Plus size={24} />
                <span className="text-xs font-bold uppercase tracking-widest">Upload Asset</span>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*" 
            />
          </div>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. 'Add a retro futuristic filter' or 'Make it look like a neon sign'"
            className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white outline-none focus:border-brand-500"
            rows={3}
          />
          <button 
            onClick={handleEdit}
            disabled={!image || !prompt || loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-4 text-sm font-bold text-white transition-all hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            Process with AI
          </button>
        </div>

        <div className="flex aspect-video items-center justify-center rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
          {result ? (
            <img src={result} alt="Result" className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-600">
              <ImageIcon size={32} />
              <span className="text-xs font-bold uppercase tracking-widest">Output Preview</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  const [analyzingPerk, setAnalyzingPerk] = useState<Perk | null>(null);

  const categories = ['Cloud', 'Marketing', 'Finance', 'Design', 'Developer Tools', 'AI'];

  const filteredPerks = useMemo(() => {
    return MOCK_PERKS.filter(perk => {
      const matchesSearch = perk.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           perk.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || perk.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleAnalyze = (perk: Perk) => {
    setAnalyzingPerk(perk);
    setIsAISidebarOpen(true);
  };

  return (
    <div className="min-h-screen glow-mesh">
      <Navbar onOpenSubmit={() => setIsSubmitModalOpen(true)} />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative px-6 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-400 border border-brand-500/20 mb-8">
                  <Sparkles size={14} />
                  Intelligence-First Platform
                </div>
                <h1 className="font-display text-6xl font-extrabold tracking-tight text-white sm:text-8xl">
                  Fuel your <br />
                  <span className="text-gradient">Venture.</span>
                </h1>
                <p className="mt-8 max-w-xl text-lg text-slate-400 leading-relaxed">
                  The elite directory of $1M+ in startup credits, AI resources, and venture-scale perks. Powered by Gemini intelligence to maximize your runway.
                </p>
                
                <div className="mt-12 flex flex-wrap gap-4">
                  <button className="flex items-center gap-2 rounded-2xl bg-brand-600 px-8 py-4 font-bold text-white shadow-xl shadow-brand-500/20 hover:bg-brand-700 transition-all hover:scale-105">
                    Get Started Free
                    <ArrowRight size={18} />
                  </button>
                  <button className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-8 py-4 font-bold text-white hover:bg-white/10 transition-all">
                    View Documentation
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative hidden lg:block"
              >
                <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-br from-brand-500/20 to-accent-500/20 blur-2xl" />
                <div className="relative rounded-[32px] border border-white/10 bg-[#0a0f1e] p-2 shadow-2xl">
                  <div className="rounded-[24px] overflow-hidden border border-white/5 bg-slate-900/50 p-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-3 w-3 rounded-full bg-red-500/50" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                      <div className="h-3 w-3 rounded-full bg-green-500/50" />
                    </div>
                    <div className="space-y-6">
                      <div className="h-4 w-3/4 rounded-full bg-white/5 animate-pulse" />
                      <div className="h-4 w-1/2 rounded-full bg-white/5 animate-pulse delay-75" />
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="h-24 rounded-2xl bg-brand-500/10 border border-brand-500/20" />
                        <div className="h-24 rounded-2xl bg-accent-500/10 border border-accent-500/20" />
                      </div>
                      <div className="h-4 w-full rounded-full bg-white/5 animate-pulse delay-150" />
                    </div>
                  </div>
                </div>
                {/* Floating elements */}
                <div className="absolute -right-8 top-1/4 animate-float">
                  <div className="glass-panel rounded-2xl p-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <ShieldCheck size={18} />
                    </div>
                    <span className="text-xs font-bold text-white">Verified Credits</span>
                  </div>
                </div>
                <div className="absolute -left-12 bottom-1/4 animate-float" style={{ animationDelay: '2s' }}>
                  <div className="glass-panel rounded-2xl p-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-400">
                      <Zap size={18} />
                    </div>
                    <span className="text-xs font-bold text-white">Instant Claim</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Directory Section */}
        <section className="mx-auto max-w-7xl px-6 pb-32 lg:px-8">
          <div className="mb-16 flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "rounded-full px-6 py-2.5 text-sm font-bold transition-all",
                  !selectedCategory 
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-500/20" 
                    : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-white"
                )}
              >
                All Ecosystem
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all",
                    selectedCategory === category
                      ? "bg-brand-600 text-white shadow-lg shadow-brand-500/20"
                      : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <CategoryIcon category={category} />
                  {category}
                </button>
              ))}
            </div>

            <div className="relative w-full max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search directory..."
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              />
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredPerks.map((perk) => (
                <PerkCard key={perk.id} perk={perk} onAnalyze={handleAnalyze} />
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Intelligence Grid */}
        <section className="mx-auto max-w-7xl px-6 pb-32 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="font-display text-4xl font-bold text-white">Ecosystem Intelligence</h2>
            <p className="mt-4 text-slate-500">Leverage the full power of Gemini to find and maximize your resources.</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <SearchGrounding />
            <MapsGrounding />
          </div>
          <div className="mt-8">
            <AICreativeStudio />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-[#030712] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-4">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                  <Zap size={18} fill="currentColor" />
                </div>
                <span className="font-display text-xl font-bold text-white">FoundersFuel</span>
              </div>
              <p className="max-w-sm text-sm text-slate-500 leading-relaxed">
                The world's most advanced platform for startup resource intelligence. We help founders extend their runway through elite perks and AI-driven ecosystem insights.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-brand-400 transition-colors">Directory</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">AI Assistant</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">Submit Perk</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-brand-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-brand-400 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-20 border-t border-white/5 pt-8 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} FoundersFuel Intelligence. All rights reserved.
          </div>
        </div>
      </footer>

      <AISidebar 
        isOpen={isAISidebarOpen} 
        onClose={() => setIsAISidebarOpen(false)} 
        selectedPerk={analyzingPerk} 
      />
      
      {/* Submission Modal (Simplified for demo) */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSubmitModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg rounded-[32px] border border-white/10 bg-[#0a0f1e] p-10 shadow-2xl">
              <h2 className="font-display text-3xl font-bold text-white mb-4">Partner with us</h2>
              <p className="text-slate-400 mb-8">Join the FoundersFuel ecosystem and offer your services to the world's fastest-growing startups.</p>
              <div className="space-y-4">
                <input type="text" placeholder="Company Name" className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-brand-500" />
                <input type="email" placeholder="Work Email" className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-brand-500" />
                <textarea placeholder="Perk Details" rows={4} className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-brand-500" />
                <button className="w-full rounded-2xl bg-brand-600 py-4 font-bold text-white hover:bg-brand-700 transition-all">Submit Application</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
