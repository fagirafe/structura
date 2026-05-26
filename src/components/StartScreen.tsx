import { ScreenLayout } from './ScreenLayout';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <ScreenLayout showLogo={false} heroHeight="tall">
      <div className="flex flex-1 flex-col justify-between px-8 pb-12 pt-14">
        <div className="flex flex-col items-start gap-6">
          <img
            src="/figures/structura-logo.svg"
            alt="structūra"
            className="h-8 w-auto"
          />
          <p className="text-base leading-snug text-ink-muted">
            Ответьте на 6 вопросов и узнайте, какая технология строительства
            подойдёт вам больше всего
          </p>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="mt-12 h-14 w-full rounded-2xl bg-black text-[17px] font-medium text-white transition active:scale-[0.98]"
        >
          Начать
        </button>
      </div>
    </ScreenLayout>
  );
}
