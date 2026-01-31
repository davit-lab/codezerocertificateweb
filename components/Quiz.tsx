
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QUESTIONS } from '../constants';
import { QuizResults } from '../types';
import Button from './Button';

interface QuizProps {
  onComplete: (results: QuizResults) => void;
  userName: string;
}

const QUESTION_TIME_LIMIT = 60;

export function Quiz({ onComplete, userName }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [autoNextEnabled, setAutoNextEnabled] = useState(false);
  const autoNextTimeoutRef = useRef<any>(null);

  const currentQuestion = QUESTIONS[currentIndex];
  const progress = (currentIndex / QUESTIONS.length) * 100;

  const handleFinish = useCallback(() => {
    onComplete({
      score,
      totalQuestions: QUESTIONS.length,
      passed: (score / QUESTIONS.length) * 100 >= 80,
      userName,
      date: new Date().toLocaleDateString('ka-GE')
    });
  }, [score, userName, onComplete]);

  const handleNext = useCallback(() => {
    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }
    
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setQuestionTimeLeft(QUESTION_TIME_LIMIT);
    } else {
      handleFinish();
    }
  }, [currentIndex, handleFinish]);

  const handleCheck = useCallback(() => {
    if (isAnswered) return;
    
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
    setIsAnswered(true);
  }, [selectedOption, currentQuestion.correctAnswer, isAnswered]);

  const handleSkip = useCallback(() => {
    if (isAnswered) return;
    setIsAnswered(true);
  }, [isAnswered]);

  useEffect(() => {
    if (isAnswered) return;
    const timer = setInterval(() => {
      setQuestionTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleCheck();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex, isAnswered, handleCheck]);

  useEffect(() => {
    if (isAnswered && (autoNextEnabled || questionTimeLeft === 0)) {
      if (!autoNextTimeoutRef.current) {
        autoNextTimeoutRef.current = setTimeout(handleNext, 1500);
      }
    }
    return () => {
      if (autoNextTimeoutRef.current && !isAnswered) {
        clearTimeout(autoNextTimeoutRef.current);
        autoNextTimeoutRef.current = null;
      }
    };
  }, [isAnswered, autoNextEnabled, questionTimeLeft, handleNext]);

  return (
    <div className="w-full min-h-screen flex flex-col p-8 lg:p-20 relative overflow-hidden bg-[#fdfcf8]">
      <div className="fixed top-0 left-0 w-full h-1 bg-zinc-100 z-50">
        <div 
          className="h-full bg-[#c5a059] transition-all duration-700 ease-out shadow-[0_0_15px_rgba(197,160,89,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="absolute top-0 right-0 -mr-20 -mt-20 select-none pointer-events-none opacity-[0.02]">
        <h1 className="text-[500px] font-black leading-none serif-heading text-[#c5a059]">{currentIndex + 1}</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#c5a059]/10 pb-10 mb-16 relative z-10 gap-8">
        <div className="space-y-6">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 border border-[#c5a059] flex items-center justify-center italic serif-heading text-[#c5a059]">A</div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.6em] text-[#c5a059] mb-1">Examination Sequence</p>
                <h3 className="text-2xl font-light serif-heading text-zinc-400">
                  მოცულობა: <span className="text-zinc-900 font-bold not-italic">{currentIndex + 1}</span> / {QUESTIONS.length}
                </h3>
              </div>
           </div>
           
           <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setAutoNextEnabled(!autoNextEnabled)}>
              <div className={`w-10 h-5 rounded-full transition-colors duration-500 relative ${autoNextEnabled ? 'bg-[#c5a059]' : 'bg-zinc-200'}`}>
                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-500 ${autoNextEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${autoNextEnabled ? 'text-[#c5a059]' : 'text-zinc-400'}`}>
                ავტო-გადასვლა
              </span>
           </div>
        </div>

        <div className="text-right">
           <p className="text-[9px] font-black uppercase tracking-[0.6em] text-zinc-400 mb-2">აკადემიური დრო</p>
           <div className="flex items-center justify-end gap-3">
             <h3 className={`text-5xl font-mono font-light ${questionTimeLeft < 10 ? 'text-rose-600 animate-pulse' : 'text-zinc-900'}`}>
               {questionTimeLeft.toString().padStart(2, '0')}ს
             </h3>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10 max-w-7xl mx-auto w-full">
        <div className="space-y-12">
           <div className="space-y-8">
              <span className="inline-block px-5 py-2 academic-border bg-white text-[9px] font-bold uppercase tracking-[0.4em] text-[#c5a059]">
                კატეგორია: {currentQuestion.category}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 leading-[1.15] tracking-tight serif-heading">
                {currentQuestion.question}
              </h2>
           </div>
           
           <div className="pt-12 hidden lg:block border-t border-zinc-50 max-w-sm">
              <p className="text-zinc-400 text-xs leading-relaxed italic">
                ყურადღებით გაეცანით კითხვას და შემოთავაზებულ ვარიანტებს. ყოველი კითხვა წარმოადგენს აკადემიური საბჭოს მიერ შემუშავებულ სტანდარტს.
              </p>
           </div>
        </div>

        <div className="space-y-6">
          <div className="grid gap-3">
            {currentQuestion.options.map((option, idx) => {
              const isCorrect = idx === currentQuestion.correctAnswer;
              const isSelected = idx === selectedOption;
              
              let styles = "bg-white border-zinc-100 hover:border-[#c5a059]/30";
              let textStyles = "text-zinc-600";
              let labelStyles = "text-[#c5a059] opacity-40";
              let label = String.fromCharCode(65 + idx);

              if (isAnswered) {
                if (isCorrect) {
                  styles = "bg-emerald-50 border-emerald-500 shadow-xl shadow-emerald-500/10";
                  textStyles = "text-emerald-900 font-bold";
                  labelStyles = "text-emerald-500";
                } else if (isSelected) {
                  styles = "bg-rose-50 border-rose-500 shadow-xl shadow-rose-500/10";
                  textStyles = "text-rose-900 font-bold";
                  labelStyles = "text-rose-500";
                } else {
                  styles = "bg-white border-transparent opacity-20";
                  textStyles = "text-zinc-400";
                }
              } else if (isSelected) {
                styles = "border-[#c5a059] bg-[#c5a059]/5 shadow-lg";
                textStyles = "text-zinc-900 font-bold";
                labelStyles = "text-[#c5a059] opacity-100";
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => setSelectedOption(idx)}
                  className={`group w-full p-6 text-left border-2 transition-all duration-300 flex items-center justify-between academic-border ${styles}`}
                >
                  <div className="flex items-center gap-6">
                    <span className={`text-xs font-bold transition-colors serif-heading ${labelStyles}`}>
                      {label}
                    </span>
                    <span className={`text-lg font-medium transition-colors ${textStyles}`}>
                      {option}
                    </span>
                  </div>
                  {isAnswered && isCorrect && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                </button>
              );
            })}
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center gap-4">
            {!isAnswered ? (
              <>
                <Button 
                  onClick={handleCheck}
                  disabled={selectedOption === null}
                  variant="secondary"
                  className="w-full sm:flex-1 bg-[#c5a059] text-white hover:bg-[#b08d4a]"
                >
                  დადასტურება
                </Button>
                <Button 
                  onClick={handleSkip}
                  variant="outline"
                  className="w-full sm:w-auto border-[#c5a059]/30 text-[#c5a059]"
                >
                  გამოტოვება
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleNext}
                variant="primary"
                className="w-full bg-zinc-900"
              >
                {currentIndex === QUESTIONS.length - 1 ? 'შედეგების გაანალიზება' : 'შემდეგი საკითხი'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
