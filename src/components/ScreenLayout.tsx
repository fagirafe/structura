import type { ReactNode } from 'react';

interface ScreenLayoutProps {
  children: ReactNode;
  /** Показывать ли логотип "structūra" над фото. У стартового экрана — нет. */
  showLogo?: boolean;
  /** Высота фото-шапки. Карточка перекрывает её снизу скруглением. */
  heroHeight?: 'tall' | 'medium' | 'compact';
}

const HERO_CLASS: Record<NonNullable<ScreenLayoutProps['heroHeight']>, string> = {
  tall: 'h-[400px]',
  medium: 'h-[360px]',
  compact: 'h-[120px]',
};

export function ScreenLayout({
  children,
  showLogo = true,
  heroHeight = 'medium',
}: ScreenLayoutProps) {
  const heroClass = HERO_CLASS[heroHeight];

  return (
    <div className="flex min-h-screen justify-center bg-black">
      <div className="relative flex w-full max-w-md flex-col">
        <div className={`relative w-full overflow-hidden ${heroClass}`}>
          <img
            src="/figures/background_image.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
          {showLogo && (
            <img
              src="/figures/structura-logo.svg"
              alt="structūra"
              className="absolute left-1/2 top-8 h-7 -translate-x-1/2"
            />
          )}
        </div>

        <div className="relative -mt-8 flex flex-1 flex-col rounded-t-[32px] bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}
