
import React, { useMemo } from 'react';
import { QuizResults } from '../types';
import Button from './Button';

interface CertificateProps {
  results: QuizResults;
  onBack: () => void;
}

export function Certificate({ results, onBack }: CertificateProps) {
  const handlePrint = () => {
    window.print();
  };

  // Generate a unique serial number for the user
  const certId = useMemo(() => {
    const randomPart = Math.floor(Math.random() * 9000 + 1000);
    const scorePart = results.score.toString().padStart(3, '0');
    return `FE-${randomPart}-${scorePart}`;
  }, [results.score]);

  return (
    <div className="flex flex-col items-center gap-10 py-16 px-4 animate-in fade-in zoom-in duration-700 bg-zinc-950 min-h-screen">
      <div 
        id="certificate-print"
        className="certificate-container"
      >
        <div className="certificate-body">
            <div className="bg-texture"></div>
            
            <div className="corner corner-tl"></div>
            <div className="corner corner-tr"></div>
            <div className="corner corner-bl"></div>
            <div className="corner corner-br"></div>

            <div className="cert-content">
                <div className="logo-section">
                    <div className="logo-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5L18.5 7 12 9.5 5.5 7 12 4.5zM4 8.5l7 3.5v7.5l-7-3.5v-7.5zm9 11v-7.5l7-3.5v7.5l-7 3.5z"/>
                        </svg>
                    </div>
                    <div className="logo-text">Codezero</div>
                </div>

                <h1 className="cert-main-title">CERTIFICATE</h1>

                <div className="recipient-line">
                    <span className="recipient-name">{results.userName}</span> has successfully completed<br />
                    the <span className="program-name">Web Development Professional Track</span><br />
                    conducted by <span className="org-name text-zinc-300">Web Academy Georgia</span>.
                </div>

                <div className="training-section">
                    <div className="training-title">This program included comprehensive training in:</div>
                    <div className="training-list">
                        HTML5 Standards, Advanced CSS3, JavaScript (ES6+)<br />
                        React.js Architecture, Responsive Layouts, UI/UX Principles<br />
                        Asset Optimization, Performance & SEO Essentials<br />
                        Web Accessibility (ARIA), Git Workflow, RESTful Services
                    </div>
                </div>

                <div className="recognition">
                    Recognized for outstanding performance and commitment to technical excellence
                </div>

                <div className="cert-footer">
                    <div className="signature-block">
                        <div className="sig-value">{results.date}</div>
                        <div className="sig-label">Date of Issue</div>
                    </div>
                    <div className="signature-block">
                        <div className="sig-value">დავით უგულავა</div>
                        <div className="sig-label">CEO, Web Academy</div>
                    </div>
                </div>

                <div className="cert-number-label">Certificate No. <span className="font-mono text-zinc-300">{certId}</span></div>
            </div>
        </div>
      </div>

      <div className="flex gap-6 no-print">
        <Button onClick={handlePrint} variant="secondary" className="px-12">
          გადმოწერა / ბეჭდვა
        </Button>
        <Button onClick={onBack} variant="outline" className="px-12">
          მთავარზე დაბრუნება
        </Button>
      </div>

      <style>{`
        .certificate-container {
            width: 1000px;
            max-width: 100%;
            height: 700px;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .certificate-body {
            width: 1000px;
            height: 700px;
            background: linear-gradient(135deg, #0d0d1a 0%, #0a0a14 40%, #0f0d18 70%, #08080f 100%);
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(100, 100, 255, 0.3);
            display: flex;
            flex-direction: column;
        }

        .bg-texture {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: 
                radial-gradient(ellipse at 0% 0%, rgba(100, 120, 255, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 100% 100%, rgba(180, 100, 255, 0.06) 0%, transparent 50%),
                radial-gradient(ellipse at 100% 0%, rgba(80, 100, 200, 0.04) 0%, transparent 40%),
                radial-gradient(ellipse at 0% 100%, rgba(150, 80, 220, 0.04) 0%, transparent 40%);
            pointer-events: none;
        }

        .corner {
            position: absolute;
            width: 80px;
            height: 80px;
            pointer-events: none;
        }

        .corner-tl { top: 15px; left: 15px; border-left: 3px solid rgba(100, 140, 255, 0.5); border-top: 3px solid rgba(100, 140, 255, 0.5); }
        .corner-tl::before { content: ''; position: absolute; top: 15px; left: 15px; width: 40px; height: 40px; border-left: 2px solid rgba(100, 140, 255, 0.25); border-top: 2px solid rgba(100, 140, 255, 0.25); }
        .corner-tr { top: 15px; right: 15px; border-right: 3px solid rgba(100, 140, 255, 0.5); border-top: 3px solid rgba(100, 140, 255, 0.5); }
        .corner-tr::before { content: ''; position: absolute; top: 15px; right: 15px; width: 40px; height: 40px; border-right: 2px solid rgba(100, 140, 255, 0.25); border-top: 2px solid rgba(100, 140, 255, 0.25); }
        .corner-bl { bottom: 15px; left: 15px; border-left: 3px solid rgba(100, 140, 255, 0.5); border-bottom: 3px solid rgba(100, 140, 255, 0.5); }
        .corner-bl::before { content: ''; position: absolute; bottom: 15px; left: 15px; width: 40px; height: 40px; border-left: 2px solid rgba(100, 140, 255, 0.25); border-bottom: 2px solid rgba(100, 140, 255, 0.25); }
        .corner-br { bottom: 15px; right: 15px; border-right: 3px solid rgba(100, 140, 255, 0.5); border-bottom: 3px solid rgba(100, 140, 255, 0.5); }
        .corner-br::before { content: ''; position: absolute; bottom: 15px; right: 15px; width: 40px; height: 40px; border-right: 2px solid rgba(100, 140, 255, 0.25); border-bottom: 2px solid rgba(100, 140, 255, 0.25); }

        .cert-content {
            position: relative;
            z-index: 10;
            height: 100%;
            padding: 40px 60px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .logo-section { display: flex; align-items: center; gap: 12px; margin-bottom: 25px; }
        .logo-icon { width: 45px; height: 45px; background: linear-gradient(135deg, #6488ff 0%, #a855f7 100%); display: flex; align-items: center; justify-content: center; border-radius: 8px; box-shadow: 0 4px 15px rgba(100, 136, 255, 0.3); }
        .logo-icon svg { width: 28px; height: 28px; fill: #ffffff; }
        .logo-text { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 24px; color: #ffffff; letter-spacing: 1px; }

        .cert-main-title {
            font-family: 'Montserrat', sans-serif;
            font-weight: 800;
            font-style: italic;
            font-size: 62px;
            color: #6488ff;
            letter-spacing: 4px;
            text-transform: uppercase;
            margin-bottom: 25px;
            text-shadow: 0 0 40px rgba(100, 136, 255, 0.3);
        }

        .recipient-line { font-family: 'Open Sans', sans-serif; font-size: 18px; color: #d0d2d8; margin-bottom: 30px; line-height: 1.7; }
        .recipient-name { font-family: 'Montserrat', sans-serif; font-weight: 700; color: #6488ff; font-size: 24px; }
        .program-name { font-family: 'Montserrat', sans-serif; font-weight: 600; font-style: italic; color: #a78bfa; }

        .training-section { margin-bottom: 25px; }
        .training-title { font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 16px; color: #6488ff; margin-bottom: 15px; }
        .training-list { font-family: 'Open Sans', sans-serif; font-size: 14px; color: #a8b0b8; line-height: 1.8; }

        .recognition {
            font-family: 'Open Sans', sans-serif;
            font-style: italic;
            font-size: 14px;
            color: #8a8d95;
            padding: 15px 0;
            border-top: 1px solid rgba(100, 136, 255, 0.2);
            border-bottom: 1px solid rgba(100, 136, 255, 0.2);
            width: 100%;
            max-width: 600px;
            margin-bottom: 30px;
        }

        .cert-footer {
            margin-top: auto;
            width: 100%;
            display: flex;
            justify-content: space-around;
            align-items: flex-end;
            max-width: 700px;
        }

        .signature-block { text-align: center; }
        .sig-value { font-family: 'Montserrat', sans-serif; font-size: 16px; color: #d0d2d8; padding-bottom: 8px; border-bottom: 1px solid rgba(100, 136, 255, 0.4); min-width: 160px; margin-bottom: 8px; }
        .sig-label { font-family: 'Open Sans', sans-serif; font-size: 12px; color: #6a6d75; }

        .cert-number-label { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); font-family: 'Open Sans', sans-serif; font-size: 12px; color: #4a4d5a; }

        @media print {
            body { background: #000 !important; margin: 0; padding: 0; }
            .no-print { display: none !important; }
            .certificate-container { 
              width: 1000px; 
              height: 700px; 
              margin: 0; 
              padding: 0;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
            .certificate-body { border: none !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
