// Математическое ядро: константы и TOPSIS-расчёт.
// Спецификация — см. overview.md, раздел 3 (константы) и раздел 4 (алгоритм).

export type Direction = 'min' | 'max';
export type Group = 'U' | 'E';

export type CriterionCode =
  | 'K1' | 'K2' | 'K3' | 'K4' | 'K5'
  | 'K6' | 'K7' | 'K8' | 'K9' | 'K10' | 'K11';

export type UserCriterionCode = 'K1' | 'K2' | 'K3' | 'K4' | 'K5' | 'K8';

export interface Criterion {
  code: CriterionCode;
  type: string;
  direction: Direction;
  w0: number;
  group: Group;
}

export interface Alternative {
  code: 'A1' | 'A2' | 'A3' | 'A4';
  name: string;
}

// Альтернативы (m = 4).
export const ALTERNATIVES: Alternative[] = [
  { code: 'A1', name: 'Газобетон' },
  { code: 'A2', name: 'Деревянный каркас' },
  { code: 'A3', name: 'Монолитный железобетон' },
  { code: 'A4', name: 'СИП-панели' },
];

// Критерии и базовые веса (n = 11). Сумма w0 по группе U = 0.7609, по E = 0.2391.
export const CRITERIA: Criterion[] = [
  { code: 'K1',  type: 'Cost',  direction: 'min', w0: 0.3017, group: 'U' },
  { code: 'K2',  type: 'Cost',  direction: 'min', w0: 0.0751, group: 'U' },
  { code: 'K3',  type: 'Time',  direction: 'min', w0: 0.0958, group: 'U' },
  { code: 'K4',  type: 'Tech',  direction: 'max', w0: 0.1153, group: 'U' },
  { code: 'K5',  type: 'Tech',  direction: 'max', w0: 0.0324, group: 'U' },
  { code: 'K6',  type: 'Tech',  direction: 'max', w0: 0.1153, group: 'E' },
  { code: 'K7',  type: 'Eco',   direction: 'min', w0: 0.0373, group: 'E' },
  { code: 'K8',  type: 'Expl',  direction: 'max', w0: 0.1406, group: 'U' },
  { code: 'K9',  type: 'Adapt', direction: 'max', w0: 0.0230, group: 'E' },
  { code: 'K10', type: 'Adapt', direction: 'max', w0: 0.0556, group: 'E' },
  { code: 'K11', type: 'Adapt', direction: 'max', w0: 0.0080, group: 'E' },
];

export const USER_CRITERIA_CODES: UserCriterionCode[] = ['K1', 'K2', 'K3', 'K4', 'K5', 'K8'];
export const U_GROUP_SUM = 0.7609;

// Матрица X (4×11): строки — A1..A4, столбцы — K1..K11.
export const X_MATRIX: number[][] = [
  [36000, 420, 100,  80, 45, 240, 250, 4.0, 3.0, 5.0, 3.7], // A1
  [30000, 340,  50,  70, 42,  45, 150, 4.3, 3.0, 4.7, 2.0], // A2
  [55000, 400, 110, 120, 56, 300, 400, 2.3, 4.7, 3.3, 3.0], // A3
  [22000, 350,  30,  50, 32,  45, 180, 3.0, 2.0, 3.0, 2.0], // A4
];

// Мультипликаторы шкалы Лайкерта (1..5).
export const LIKERT_K: Record<number, number> = {
  1: 0.40,
  2: 0.70,
  3: 1.00,
  4: 1.20,
  5: 1.60,
};

export type SliderInput = Record<UserCriterionCode, number>;

export interface RankedAlternative {
  code: Alternative['code'];
  name: string;
  C: number;
  rank: number;
}

export interface TopsisResult {
  weights: number[];
  ranking: RankedAlternative[];
  winner: RankedAlternative;
}

/** Шаг 1. Адаптация весов под пользовательский ввод. */
export function adaptWeights(sliders: SliderInput): number[] {
  const wTilde: number[] = CRITERIA.map((c) => {
    if (c.group === 'U') {
      const slider = sliders[c.code as UserCriterionCode];
      const k = LIKERT_K[slider];
      if (k === undefined) {
        throw new Error(`Недопустимая оценка ${slider} для ${c.code}; ожидается 1..5`);
      }
      return c.w0 * k;
    }
    return c.w0;
  });

  let sumU = 0;
  CRITERIA.forEach((c, j) => {
    if (c.group === 'U') sumU += wTilde[j];
  });

  const gamma = U_GROUP_SUM / sumU;

  return CRITERIA.map((c, j) => (c.group === 'U' ? wTilde[j] * gamma : c.w0));
}

/** Шаг 2. Векторное нормирование столбцов матрицы X. */
export function normalizeMatrix(matrix: number[][]): number[][] {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const denom: number[] = new Array(cols).fill(0);

  for (let j = 0; j < cols; j++) {
    let sumSq = 0;
    for (let i = 0; i < rows; i++) sumSq += matrix[i][j] ** 2;
    denom[j] = Math.sqrt(sumSq);
  }

  return matrix.map((row) => row.map((value, j) => value / denom[j]));
}

/** Шаги 3-5. Полный TOPSIS-расчёт по заданным весам. */
export function runTopsis(sliders: SliderInput): TopsisResult {
  const weights = adaptWeights(sliders);
  const R = normalizeMatrix(X_MATRIX);

  // Шаг 3: взвешенная матрица V.
  const V = R.map((row) => row.map((r, j) => r * weights[j]));

  // Шаг 4: идеалы A+ и A-.
  const cols = CRITERIA.length;
  const Aplus: number[] = new Array(cols);
  const Aminus: number[] = new Array(cols);

  for (let j = 0; j < cols; j++) {
    let colMin = Infinity;
    let colMax = -Infinity;
    for (let i = 0; i < V.length; i++) {
      const v = V[i][j];
      if (v < colMin) colMin = v;
      if (v > colMax) colMax = v;
    }
    if (CRITERIA[j].direction === 'max') {
      Aplus[j] = colMax;
      Aminus[j] = colMin;
    } else {
      Aplus[j] = colMin;
      Aminus[j] = colMax;
    }
  }

  // Шаг 5: расстояния S+ / S- и коэффициент C.
  const cValues: number[] = V.map((row) => {
    let sPlus = 0;
    let sMinus = 0;
    for (let j = 0; j < cols; j++) {
      sPlus += (row[j] - Aplus[j]) ** 2;
      sMinus += (row[j] - Aminus[j]) ** 2;
    }
    sPlus = Math.sqrt(sPlus);
    sMinus = Math.sqrt(sMinus);
    return sMinus / (sPlus + sMinus);
  });

  const ranking: RankedAlternative[] = ALTERNATIVES
    .map((alt, i) => ({ code: alt.code, name: alt.name, C: cValues[i], rank: 0 }))
    .sort((a, b) => b.C - a.C)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  return { weights, ranking, winner: ranking[0] };
}

/** Дефолтные значения слайдеров (нейтральная позиция). */
export const DEFAULT_SLIDERS: SliderInput = {
  K1: 3, K2: 3, K3: 3, K4: 3, K5: 3, K8: 3,
};
