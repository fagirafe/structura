// Префикс к статическим ресурсам из public/, учитывающий base-путь сборки.
// На GitHub Pages сайт живёт по /structura/, поэтому абсолютные пути вида
// "/figures/..." нужно резолвить относительно import.meta.env.BASE_URL.
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
