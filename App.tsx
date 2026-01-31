
import React, { useState, useEffect } from 'react';
import { AppState, QuizResults, UserApproval } from './types';
import { Quiz } from './components/Quiz';
import { Certificate } from './components/Certificate';
import { db } from './services/db';
import Button from './components/Button';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ADMIN_PASSWORD = "admin2025";

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('LANDING');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [results, setResults] = useState<QuizResults | null>(null);
  const [approvals, setApprovals] = useState<UserApproval[]>([]);

  useEffect(() => {
    const unsubscribe = db.subscribeToApprovals((updatedApprovals) => {
      setApprovals(updatedApprovals);
    });
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  useEffect(() => {
    if (state === 'WAITING' && userId) {
      db.subscribeToUserStatus(userId, (status) => {
        if (status === 'approved') {
          setState('QUIZ');
        }
      });
    }
  }, [state, userId]);

  const handleNameChange = (val: string) => {
    if (val === '.') {
      setShowAdminLogin(true);
      setUserName('');
      return;
    }
    setUserName(val);
  };

  const handleRequestAccess = () => {
    if (!userName.trim()) {
      alert('გთხოვთ შეიყვანოთ თქვენი სრული სახელი');
      return;
    }
    db.requestAccess(userName, (id) => {
      setUserId(id);
      setState('WAITING');
    });
  };

  const handleAdminAuth = () => {
    if (adminKey === ADMIN_PASSWORD) {
      setState('ADMIN');
      setShowAdminLogin(false);
      setAdminKey('');
    } else {
      alert('არასწორი ადმინისტრაციული გასაღები');
    }
  };

  const handleApprove = (id: string) => {
    db.approveUser(id);
  };

  const handleClear = () => {
    if (confirm('დარწმუნებული ხართ, რომ გსურთ ყველა მონაცემის წაშლა?')) {
      db.clearAll();
      setApprovals([]);
    }
  };

  const onQuizComplete = (res: QuizResults) => {
    setResults(res);
    setState('RESULT');
  };

  return (
    <div className="min-h-screen selection:bg-[#c5a059] selection:text-white">
      {state === 'LANDING' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-24 relative">
          <div className="max-w-4xl w-full text-center space-y-16">
            <div className="space-y-6">
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 border-2 border-[#c5a059] rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 border border-[#c5a059] rounded-full flex items-center justify-center text-[#c5a059] serif-heading italic text-3xl font-bold">
                    A
                  </div>
                </div>
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.8em] text-[#c5a059]">Academic Examination Center</p>
              <h1 className="text-6xl md:text-8xl font-bold text-zinc-900 leading-tight tracking-tighter serif-heading">
                Web Development <br/> 
                <span className="italic font-light opacity-60">Certification 2025</span>
              </h1>
              <div className="w-24 h-px bg-[#c5a059] mx-auto opacity-40"></div>
            </div>

            <div className="max-w-md mx-auto academic-border bg-white p-10 md:p-14 space-y-10 shadow-xl shadow-zinc-900/5">
              <div className="space-y-4">
                <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-400 text-left">Candidate Name</label>
                <input 
                  type="text" 
                  placeholder="თქვენი სახელი და გვარი"
                  value={userName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-transparent border-b border-zinc-200 py-4 text-xl font-medium outline-none focus:border-[#c5a059] transition-all placeholder:text-zinc-200"
                />
              </div>
              <Button onClick={handleRequestAccess} className="w-full" variant="secondary">
                მოითხოვეთ დაშვება
              </Button>
              <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                * სისტემა სინქრონიზებულია სხვადასხვა მოწყობილობასთან. დაელოდეთ ადმინისტრატორის დადასტურებას.
              </p>
            </div>
          </div>

          {showAdminLogin && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-6">
              <div className="max-w-sm w-full bg-[#fdfcf8] academic-border p-10 space-y-8 animate-in fade-in zoom-in duration-300">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold serif-heading">Admin Authorization</h3>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400">Enter Administrative Key</p>
                </div>
                <input 
                  type="password" 
                  autoFocus
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminAuth()}
                  className="w-full bg-transparent border-b border-[#c5a059]/30 py-3 text-center text-lg outline-none focus:border-[#c5a059]"
                />
                <div className="flex gap-3">
                  <Button onClick={handleAdminAuth} className="flex-1 py-3" variant="secondary">Verify</Button>
                  <Button onClick={() => setShowAdminLogin(false)} className="flex-1 py-3" variant="outline">Cancel</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {state === 'WAITING' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-12 text-center bg-[#fdfcf8]">
          <div className="max-w-xl space-y-12">
            <div className="relative inline-block">
              <div className="w-24 h-24 border-4 border-zinc-100 border-t-[#c5a059] rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center serif-heading text-[#c5a059] font-bold text-xl italic">
                A
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-bold serif-heading">გთხოვთ დაელოდოთ...</h2>
              <p className="text-zinc-500 italic">ადმინისტრატორი სხვა მოწყობილობიდან დაგიდასტურებთ გამოცდაზე დაშვებას.</p>
            </div>
            <div className="pt-8 border-t border-zinc-100 flex flex-col items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">კანდიდატი:</span>
              <span className="text-lg font-bold text-[#c5a059]">{userName}</span>
            </div>
          </div>
        </div>
      )}

      {state === 'ADMIN' && (
        <div className="min-h-screen p-8 md:p-24 bg-white">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="flex justify-between items-end border-b pb-8">
              <div>
                <h1 className="text-4xl font-bold serif-heading">აკადემიური პანელი</h1>
                <p className="text-zinc-400 text-sm italic">Cloud Sync: აქტიურია სხვა მოწყობილობებთან</p>
              </div>
              <Button onClick={() => setState('LANDING')} variant="outline" className="px-6 py-2">Back to Landing</Button>
            </div>

            <div className="grid gap-6">
              {approvals.filter(a => a && a.name).length === 0 ? (
                <div className="p-20 text-center border-2 border-dashed border-zinc-100 text-zinc-300 italic">
                  მოთხოვნები ჯერ არ არის შემოსული
                </div>
              ) : (
                approvals
                .filter(a => a && a.name)
                .sort((a,b) => b.timestamp - a.timestamp)
                .map(u => (
                  <div key={u.id} className="flex items-center justify-between p-6 academic-border bg-[#fdfcf8] animate-in slide-in-from-top-4 duration-500">
                    <div>
                      <h3 className="text-xl font-bold serif-heading">{u.name}</h3>
                      <p className="text-xs text-zinc-400">{new Date(u.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {u.status === 'pending' ? (
                        <button 
                          onClick={() => handleApprove(u.id)}
                          className="bg-emerald-600 text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-lg"
                        >
                          დაშვება
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="font-bold text-xs uppercase tracking-widest">დადასტურებულია</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="pt-10 flex justify-between items-center">
               <button onClick={handleClear} className="text-rose-500 text-[10px] font-bold uppercase tracking-widest hover:underline">
                 მონაცემების გასუფთავება (Global Reset)
               </button>
               <p className="text-[10px] text-zinc-300 italic">Powered by Gun.js P2P Sync</p>
            </div>
          </div>
        </div>
      )}

      {state === 'QUIZ' && <Quiz userName={userName} onComplete={onQuizComplete} />}

      {state === 'RESULT' && results && (
        <div className="min-h-screen flex items-center justify-center p-12">
          <div className="max-w-4xl w-full bg-white academic-border p-16 md:p-24 text-center space-y-16 shadow-2xl">
            <div className="space-y-4">
              <h2 className="text-6xl md:text-8xl font-black serif-heading tracking-tighter">Evaluation</h2>
              <div className="w-24 h-1 bg-[#c5a059] mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
              <div className="text-left space-y-2">
                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Candidate</p>
                 <p className="text-3xl font-black serif-heading text-[#c5a059]">{results.userName}</p>
              </div>

              <div className="relative w-48 h-48 mx-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ value: results.score }, { value: results.totalQuestions - results.score }]}
                      cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={0} dataKey="value" stroke="none"
                    >
                      <Cell fill={results.passed ? "#c5a059" : "#e11d48"} />
                      <Cell fill="#f1f5f9" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-black text-[#1a1523]">{results.score}%</span>
                </div>
              </div>

              <div className="text-right space-y-2">
                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Decision</p>
                 <p className={`text-3xl font-black serif-heading ${results.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                   {results.passed ? 'PASSED' : 'FAILED'}
                 </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-10">
              {results.passed && (
                <Button onClick={() => setState('CERTIFICATE')} variant="secondary" className="px-16">
                  სერტიფიკატის გაცემა
                </Button>
              )}
              <Button onClick={() => { setState('LANDING'); setResults(null); }} variant="outline" className="px-16">
                ხელახლა ცდა
              </Button>
            </div>
          </div>
        </div>
      )}

      {state === 'CERTIFICATE' && results && (
        <Certificate results={results} onBack={() => setState('LANDING')} />
      )}
    </div>
  );
};

export default App;
