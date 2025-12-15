import { useState, useEffect, useRef, useCallback } from 'react';
import { algorithms } from './algorithms';

function App() {
  const [algorithm, setAlgorithm] = useState('bubble');
  const [arrayInput, setArrayInput] = useState('');
  const [targetInput, setTargetInput] = useState('');
  const [speed, setSpeed] = useState(1500);
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [status, setStatus] = useState({ text: 'Idle', color: 'var(--accent)' });
  const [explanation, setExplanation] = useState('No explanation yet.');
  const [isExplaining, setIsExplaining] = useState(false);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const timerRef = useRef(null);

  const currentAlgo = algorithms[algorithm];
  const showTarget = currentAlgo?.type === 'search';

  const languageNames = {
    python: 'Python',
    javascript: 'JavaScript',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
  };

  const currentLanguageName = languageNames[language] || language;

  const parseArray = () => {
    return arrayInput
      .split(',')
      .map((v) => Number(v.trim()))
      .filter((v) => !Number.isNaN(v));
  };

  const renderBars = (step) => {
    if (!step) return null;
    const { array, highlights } = step;
    const max = Math.max(...array, 1);

    return (
      <div className="bars-container">
        {array.map((value, idx) => {
          const height = (value / max) * 200 + 30;
          let className = 'bar';

          if (highlights?.compare?.includes(idx)) {
            className += ' compare';
          }
          if (highlights?.swap?.includes(idx)) {
            className += ' swap';
          }
          if (highlights?.found?.includes(idx)) {
            className += ' found';
          }
          if (highlights?.pivot === idx) {
            className += ' pivot';
          }

          return (
            <div key={idx} className="bar-wrapper">
              <div className={className} style={{ height: `${height}px` }}>
                <span className="bar-value">{value}</span>
              </div>
              <span className="bar-index">{idx}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const startAnimation = useCallback(() => {
    if (!steps.length) return;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(timerRef.current);
          setStatus({ text: 'Done', color: 'var(--success)' });
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    setStatus({ text: 'Running', color: 'var(--accent)' });
  }, [steps.length, speed]);

  const pauseAnimation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setStatus({ text: 'Paused', color: 'var(--accent-2)' });
    }
  };

  const reset = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setSteps([]);
    setStepIndex(0);
    setStatus({ text: 'Idle', color: 'var(--accent)' });
  };

  const handleStart = () => {
    const arr = parseArray();
    const target = showTarget && targetInput.trim() !== '' ? Number(targetInput.trim()) : undefined;

    if (!currentAlgo) {
      setStatus({ text: 'Pick an algorithm', color: 'var(--danger)' });
      return;
    }
    if (!arr.length) {
      setStatus({ text: 'Enter valid numbers', color: 'var(--danger)' });
      return;
    }
    if (currentAlgo.type === 'search' && Number.isNaN(target)) {
      setStatus({ text: 'Enter a target for search', color: 'var(--danger)' });
      return;
    }

    const newSteps = currentAlgo.fn(arr, target);
    setSteps(newSteps);
    setStepIndex(0);
    setTimeout(() => {
      if (timerRef.current) clearInterval(timerRef.current);
      startAnimation();
    }, 100);
  };

  const handleExplain = async () => {
    if (isExplaining) return; // Prevent multiple simultaneous requests
    
    const arr = parseArray();
    
    if (!arr.length) {
      setExplanation('Error: Please enter a valid array (comma-separated numbers) before requesting an explanation.');
      return;
    }

    if (!currentAlgo) {
      setExplanation('Error: Please select an algorithm first.');
      return;
    }

    const target = showTarget && targetInput.trim() !== '' ? Number(targetInput.trim()) : undefined;
    
    if (currentAlgo.type === 'search' && Number.isNaN(target)) {
      setExplanation('Error: Please enter a target value for search algorithms.');
      return;
    }

    setIsExplaining(true);
    setExplanation('Requesting explanation from OpenAI...');
    
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm: currentAlgo?.label, array: arr, target }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error?.includes('OPENAI_API_KEY')) {
          setExplanation('Error: OPENAI_API_KEY is not set in the .env file. Please add your OpenAI API key to enable explanations.');
        } else {
          setExplanation(`Error: ${data.error || 'Failed to get explanation. Please try again.'}`);
        }
      } else {
        setExplanation(data.explanation || 'No explanation returned. Please try again.');
      }
    } catch (err) {
      setExplanation(`Error: ${err.message || 'Network error. Make sure the server is running and try again.'}`);
    } finally {
      setIsExplaining(false);
    }
  };

  const handleGenerateCode = async () => {
    if (isGeneratingCode) return;
    
    const arr = parseArray();
    
    if (!arr.length) {
      setCode('Error: Please enter a valid array (comma-separated numbers) before generating code.');
      return;
    }

    if (!currentAlgo) {
      setCode('Error: Please select an algorithm first.');
      return;
    }

    const target = showTarget && targetInput.trim() !== '' ? Number(targetInput.trim()) : undefined;
    
    if (currentAlgo.type === 'search' && Number.isNaN(target)) {
      setCode('Error: Please enter a target value for search algorithms.');
      return;
    }

    setIsGeneratingCode(true);
    setCode('Generating code...');
    
    try {
      const res = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          algorithm: currentAlgo?.label, 
          language, 
          array: arr, 
          target 
        }),
      });
      
      // Check if response is actually JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        setCode(`Error: Backend server is not running or not accessible.\n\nPlease make sure:\n1. The backend server is running on port 5173\n2. Run "npm run server" in a separate terminal\n3. The server should show: "DSA animation server running on http://localhost:5173"`);
        return;
      }
      
      const data = await res.json();
      if (!res.ok) {
        if (data.error?.includes('OPENAI_API_KEY')) {
          setCode('Error: OPENAI_API_KEY is not set in the .env file. Please add your OpenAI API key to enable code generation.');
        } else {
          setCode(`Error: ${data.error || 'Failed to generate code. Please try again.'}`);
        }
      } else {
        setCode(data.code || 'No code returned. Please try again.');
      }
    } catch (err) {
      if (err.message?.includes('JSON')) {
        setCode('Error: Server returned invalid response. Make sure the backend server is running. Run "npm run server" in a separate terminal.');
      } else {
        setCode(`Error: ${err.message || 'Network error. Make sure the server is running and try again.'}`);
      }
    } finally {
      setIsGeneratingCode(false);
    }
  };

  useEffect(() => {
    if (timerRef.current && steps.length > 0) {
      clearInterval(timerRef.current);
      startAnimation();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [speed, startAnimation, steps.length]);

  const currentStep = steps[stepIndex] || null;

  return (
    <div className="app">
      <header>
        <div>
          <p className="eyebrow">Sorting & Searching</p>
          <h1>Algorithm Animator</h1>
          <p className="lede">
            Pick an algorithm, enter your array (comma separated), and watch the step-by-step animation.
          </p>
        </div>
        <div className="status">
          <span className="chip" style={{ color: status.color }}>
            {status.text}
          </span>
        </div>
      </header>

      <section className="controls">
        <div className="field">
          <label htmlFor="algorithm">Algorithm</label>
          <select id="algorithm" value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
            <option value="bubble">Bubble Sort</option>
            <option value="insertion">Insertion Sort</option>
            <option value="selection">Selection Sort</option>
            <option value="quick">Quick Sort</option>
            <option value="merge">Merge Sort</option>
            <option value="linear">Linear Search</option>
            <option value="binary">Binary Search</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="language">Programming Language</label>
          <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="arrayInput">Array (comma separated)</label>
          <input
            id="arrayInput"
            type="text"
            placeholder="e.g. 5,3,8,1,2"
            value={arrayInput}
            onChange={(e) => setArrayInput(e.target.value)}
          />
        </div>
        {showTarget && (
          <div className="field">
            <label htmlFor="targetInput">Target (search only)</label>
            <input
              id="targetInput"
              type="text"
              placeholder="e.g. 8"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
            />
          </div>
        )}
        <div className="field">
          <label htmlFor="speed">Speed (ms/step)</label>
          <input
            id="speed"
            type="range"
            min="100"
            max="1500"
            step="50"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
          <span>{speed}ms</span>
        </div>
        <div className="actions">
          <button className="primary" onClick={handleStart}>
            Start
          </button>
          <button onClick={pauseAnimation}>Pause</button>
          <button className="ghost" onClick={reset}>
            Reset
          </button>
        </div>
      </section>

      <section className="visualizer">
        <div className="visual-header">
          <h2>Step-by-Step Tutorial</h2>
          <p>{steps.length > 0 ? `${stepIndex + 1} / ${steps.length}` : '0 / 0'}</p>
        </div>
        <div className="bars-wrapper">
          {currentStep ? renderBars(currentStep) : (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <p>Enter data and start to view the animation</p>
            </div>
          )}
        </div>
        <div className="step-explanation" key={stepIndex}>
          <div className="step-badge">
            <div className="badge-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="step-number">{steps.length > 0 ? stepIndex + 1 : '—'}</span>
            <span className="step-label">Step</span>
          </div>
          <div className="step-content">
            <div className="step-title-wrapper">
              <h3 className="step-title">{currentStep?.note || 'Enter data and start to view the animation.'}</h3>
              <div className="step-progress">
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: steps.length > 0 
                      ? `${((stepIndex + 1) / steps.length) * 100}%` 
                      : '0%'
                  }}
                ></div>
              </div>
            </div>
            <div className="step-detail-wrapper">
              <div className="detail-icon">💡</div>
              <p className="step-detail">{currentStep?.explanation || 'Select an algorithm, enter your array, and click Start to see detailed step-by-step explanations.'}</p>
            </div>
          </div>
        </div>
      </section>

      {steps.length > 0 && (
        <section className="panel">
          <h3>All Steps ({steps.length} total)</h3>
          <p className="small">Complete list of all steps in the algorithm execution</p>
          <div className="steps-list">
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className={`step-item ${idx === stepIndex ? 'active' : ''} ${idx < stepIndex ? 'completed' : ''}`}
                onClick={() => {
                  setStepIndex(idx);
                  if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                  }
                  setStatus({ text: 'Manual', color: 'var(--accent-2)' });
                }}
              >
                <div className="step-item-number">{idx + 1}</div>
                <div className="step-item-content">
                  <div className="step-item-title">{step.note}</div>
                  {step.explanation && (
                    <div className="step-item-explanation">{step.explanation}</div>
                  )}
                </div>
                {idx === stepIndex && (
                  <div className="step-item-indicator">Current</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="panel">
        <div className="panel-header">
          <h3>AI Explanation</h3>
          <button 
            className="primary" 
            onClick={handleExplain}
            disabled={isExplaining}
          >
            {isExplaining ? 'Requesting...' : 'Explain with AI'}
          </button>
        </div>
        <p className="small">
          Get AI-powered explanations of how the selected algorithm works with your input.
        </p>
        <pre className="explanation">{explanation}</pre>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Generated Code</h3>
          <button 
            className="primary" 
            onClick={handleGenerateCode}
            disabled={isGeneratingCode}
          >
            {isGeneratingCode ? 'Generating...' : 'Generate Code'}
          </button>
        </div>
        <p className="small">
          Generate <strong>{currentLanguageName}</strong> code for the selected algorithm.
        </p>
        <pre className="code-block">{code || 'Click "Generate Code" to get the implementation.'}</pre>
      </section>
    </div>
  );
}

export default App;

