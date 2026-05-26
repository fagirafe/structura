import { ScreenLayout } from './ScreenLayout';
import type { Question } from '../questions';

interface QuestionCardProps {
  question: Question;
  value: number;
  stepIndex: number;
  totalSteps: number;
  onChange: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const LIKERT_VALUES: ReadonlyArray<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5];

export function QuestionCard({
  question,
  value,
  stepIndex,
  totalSteps,
  onChange,
  onNext,
  onBack,
}: QuestionCardProps) {
  const canGoBack = stepIndex > 0;
  const isLast = stepIndex + 1 === totalSteps;

  return (
    <ScreenLayout>
      <div className="flex flex-1 flex-col justify-between px-6 pb-12 pt-10">
        <div className="flex flex-col gap-8">
          <div className="flex h-24 flex-col gap-2">
            <div className="text-sm font-semibold text-ink-muted">
              Вопрос {stepIndex + 1}/{totalSteps}
            </div>
            <h2 className="text-base font-medium leading-snug text-black">
              {question.prompt}
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-xs font-medium text-ink-muted">
                <span>Несущественно</span>
                <span>Очень важно</span>
              </div>

              <div
                role="radiogroup"
                aria-label={`Оценка важности: ${question.title}`}
                className="flex items-stretch gap-2"
              >
                {LIKERT_VALUES.map((n) => {
                  const isActive = value === n;
                  return (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => onChange(n)}
                      className={`flex h-14 flex-1 items-center justify-center rounded-2xl bg-[#f5f5f5] text-[17px] transition active:scale-[0.97] ${
                        isActive
                          ? 'font-semibold text-black outline outline-[1.5px] -outline-offset-[1.5px] outline-black'
                          : 'font-medium text-ink-muted'
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="min-h-[44px] text-base font-medium leading-snug text-ink-muted">
              {question.options[value as 1 | 2 | 3 | 4 | 5]}
            </p>
          </div>
        </div>

        <div className="mt-10 flex items-stretch gap-3">
          {canGoBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Назад"
              className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-[#f5f5f5] text-black transition active:scale-[0.97]"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12.5 4.5L7 10l5.5 5.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            className="h-14 flex-1 rounded-2xl bg-black text-[17px] font-medium text-white transition active:scale-[0.98]"
          >
            {isLast ? 'Получить результат' : 'Далее'}
          </button>
        </div>
      </div>
    </ScreenLayout>
  );
}
