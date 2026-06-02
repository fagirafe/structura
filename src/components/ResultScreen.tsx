import { ScreenLayout } from './ScreenLayout';
import type { RankedAlternative, TopsisResult } from '../math';
import { TECH_CARDS } from '../techCards';

interface ResultScreenProps {
  result: TopsisResult;
  onRestart: () => void;
}

export function ResultScreen({ result, onRestart }: ResultScreenProps) {
  const [winner, ...rest] = result.ranking;

  return (
    <ScreenLayout heroHeight="compact" fitScreen={false}>
      <div className="flex flex-1 flex-col gap-8 px-6 pb-12 pt-8">
        <p className="text-base font-medium leading-snug text-ink-muted">
          Самый подходящий вариант под ваши критерии:
        </p>

        <TechBlock entry={winner} highlight />

        <p className="text-base font-medium leading-snug text-ink-muted">
          Также вам могут подойти:
        </p>

        <div className="flex flex-col gap-8">
          {rest.map((entry) => (
            <TechBlock key={entry.code} entry={entry} />
          ))}
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="mt-2 h-14 w-full rounded-2xl bg-surface-softer text-[17px] font-medium text-black transition active:scale-[0.98]"
        >
          Пройти опрос заново
        </button>
      </div>
    </ScreenLayout>
  );
}

interface TechBlockProps {
  entry: RankedAlternative;
  highlight?: boolean;
}

function TechBlock({ entry, highlight = false }: TechBlockProps) {
  const card = TECH_CARDS[entry.code];
  const matchPct = Math.round(entry.C * 100);

  return (
    <article className="flex flex-col gap-2">
      <div className="relative flex h-60 w-full items-center justify-center overflow-hidden rounded-2xl bg-surface-card">
        <img
          src={card.image}
          alt={card.name}
          className="h-full w-full object-contain p-3"
        />
        {highlight && (
          <span className="absolute left-3 top-3 rounded-full bg-black/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
            Рекомендуем
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 text-base font-medium leading-snug text-black">
          {card.name}
        </div>
        <div className="text-base font-medium text-black">
          {card.pricePerM2}
        </div>
      </div>

      <div className="text-xs font-medium text-ink-muted">
        Соответствие {matchPct}%
      </div>

      <div className="mt-2 flex flex-col gap-1">
        <div className="text-xs font-medium text-ink-muted">Преимущества</div>
        <div className="text-base font-medium leading-snug text-black">
          {card.pros.join(', ')}.
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-1">
        <div className="text-xs font-medium text-ink-muted">Недостатки</div>
        <div className="text-base font-medium leading-snug text-black">
          {card.cons.join(', ')}.
        </div>
      </div>
    </article>
  );
}
