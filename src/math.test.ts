import { describe, expect, it } from 'vitest';
import { runTopsis, type SliderInput } from './math';

// Тестовые сценарии из overview.md, раздел 6.
// Допустимая погрешность по C — тысячные.

const EPS = 0.001;

function topsisOf(partial: Partial<SliderInput>) {
  const base: SliderInput = { K1: 3, K2: 3, K3: 3, K4: 3, K5: 3, K8: 3 };
  return runTopsis({ ...base, ...partial });
}

describe('TOPSIS', () => {
  it('Базовый (все = 3): победитель A4, C ≈ 0.5988', () => {
    const result = topsisOf({});
    expect(result.winner.code).toBe('A4');
    expect(result.winner.C).toBeCloseTo(0.5988, 3);
  });

  it('Акцент на экономию и скорость (K1=5, K3=4): победитель A4, C ≈ 0.6621', () => {
    const result = topsisOf({ K1: 5, K3: 4 });
    expect(result.winner.code).toBe('A4');
    expect(result.winner.C).toBeCloseTo(0.6621, 3);
  });

  it('Акцент на эксплуатацию (K2=5, K8=5, K4=4): победитель A1, C ≈ 0.5946', () => {
    const result = topsisOf({ K2: 5, K8: 5, K4: 4 });
    expect(result.winner.code).toBe('A1');
    expect(result.winner.C).toBeCloseTo(0.5946, 3);
  });

  it('Акцент на долговечность (K1=1, K4=5, K5=5): победитель A3, C ≈ 0.5500', () => {
    const result = topsisOf({ K1: 1, K4: 5, K5: 5 });
    expect(result.winner.code).toBe('A3');
    expect(result.winner.C).toBeCloseTo(0.55, 3);
  });

  it('ranking содержит 4 альтернативы с уникальными рангами 1..4', () => {
    const result = topsisOf({});
    expect(result.ranking).toHaveLength(4);
    expect(result.ranking.map((r) => r.rank)).toEqual([1, 2, 3, 4]);
    const codes = new Set(result.ranking.map((r) => r.code));
    expect(codes.size).toBe(4);
  });

  it('Сумма весов после адаптации = 1 (с точностью до плавающей)', () => {
    const result = topsisOf({ K1: 5, K2: 1, K8: 4 });
    const sum = result.weights.reduce((a, b) => a + b, 0);
    expect(Math.abs(sum - 1)).toBeLessThan(EPS);
  });
});
