import type { ReactNode } from 'react';
import { asset } from '../asset';

interface ScreenLayoutProps {
  children: ReactNode;
  /** Показывать ли логотип "structūra" над фото. У стартового экрана — нет. */
  showLogo?: boolean;
  /** Высота фото-шапки. Карточка перекрывает её снизу скруглением. */
  heroHeight?: 'tall' | 'medium' | 'compact';
  /**
   * Фиксировать высоту экрана и убрать скролл: фото-шапка ужимается,
   * а карточка с контентом тянется на всю оставшуюся высоту так, чтобы
   * кнопка «Далее» всегда была у нижнего края. Для экрана с результатами
   * выключено — там контент длинный и должен скроллиться.
   */
  fitScreen?: boolean;
}

const HERO_CLASS: Record<NonNullable<ScreenLayoutProps['heroHeight']>, string> = {
  tall: 'h-[40vh] max-h-[400px]',
  medium: 'h-[34vh] max-h-[360px]',
  compact: 'h-[120px]',
};

export function ScreenLayout({
  children,
  showLogo = true,
  heroHeight = 'medium',
  fitScreen = true,
}: ScreenLayoutProps) {
  const heroClass = HERO_CLASS[heroHeight];

  return (
    <div
      className={`flex justify-center bg-black ${
        fitScreen ? 'h-screen overflow-hidden' : 'min-h-screen'
      }`}
    >
      <div className="relative flex w-full max-w-md flex-col">
        <div className={`relative w-full flex-none overflow-hidden ${heroClass}`}>
          <img
            src={asset('/figures/background_image.png')}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
          {showLogo && (
            <img
              src={asset('/figures/structura-logo.svg')}
              alt="structūra"
              className="absolute left-1/2 top-8 h-7 -translate-x-1/2"
            />
          )}
        </div>

        <div className="relative -mt-12 flex flex-1 flex-col rounded-t-[32px] bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}
