import { ScreenLayout } from './ScreenLayout';

export function LoadingScreen() {
  return (
    <ScreenLayout>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16">
        <img
          src="/figures/loading-icon.svg"
          alt=""
          className="structura-spin h-10 w-10"
        />
        <p className="text-base font-medium text-black">
          Подбираем подходящий вариант...
        </p>
      </div>
    </ScreenLayout>
  );
}
