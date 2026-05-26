import { useEffect, useState } from 'react';
import { QUESTIONS } from '../questions';
import { DEFAULT_SLIDERS, runTopsis, type SliderInput, type TopsisResult } from '../math';
import { LoadingScreen } from './LoadingScreen';
import { QuestionCard } from './QuestionCard';
import { ResultScreen } from './ResultScreen';
import { StartScreen } from './StartScreen';

const TOTAL_STEPS = QUESTIONS.length; // 6
const LOADING_MS = 900;

type Phase = 'start' | 'question' | 'loading' | 'result';

export function Wizard() {
  const [phase, setPhase] = useState<Phase>('start');
  const [step, setStep] = useState(0);
  const [sliders, setSliders] = useState<SliderInput>(DEFAULT_SLIDERS);
  const [result, setResult] = useState<TopsisResult | null>(null);

  useEffect(() => {
    if (phase !== 'loading') return;
    const t = window.setTimeout(() => {
      setResult(runTopsis(sliders));
      setPhase('result');
    }, LOADING_MS);
    return () => window.clearTimeout(t);
  }, [phase, sliders]);

  const handleStart = () => {
    setSliders(DEFAULT_SLIDERS);
    setResult(null);
    setStep(0);
    setPhase('question');
  };

  const handleSliderChange = (value: number) => {
    const current = QUESTIONS[step];
    setSliders((prev) => ({ ...prev, [current.code]: value }));
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      setPhase('loading');
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleRestart = () => {
    setSliders(DEFAULT_SLIDERS);
    setResult(null);
    setStep(0);
    setPhase('start');
  };

  if (phase === 'start') {
    return <StartScreen onStart={handleStart} />;
  }

  if (phase === 'loading') {
    return <LoadingScreen />;
  }

  if (phase === 'result' && result) {
    return <ResultScreen result={result} onRestart={handleRestart} />;
  }

  const currentQuestion = QUESTIONS[step];
  return (
    <QuestionCard
      question={currentQuestion}
      value={sliders[currentQuestion.code]}
      stepIndex={step}
      totalSteps={TOTAL_STEPS}
      onChange={handleSliderChange}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}
