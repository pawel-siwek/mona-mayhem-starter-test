# Instrukcje dla Copilota

Repozytorium startowe aplikacji warsztatowej („Mayhem w Stoczni” / Mona Mayhem): porównuje wykresy kontrybucji dwóch użytkowników GitHuba. Większość funkcjonalności jest celowo niezaimplementowana i rozbudowuje się ją krok po kroku.

## Polecenia

- `npm install` — instalacja zależności
- `npm run dev` — serwer deweloperski Astro (http://localhost:4321)
- `npm run build` / `npm run preview` — build produkcyjny (serwer Node standalone w `dist/`) i podgląd
- `npx astro check` — sprawdzanie typów (to nie jest skrypt npm; wymaga `@astrojs/check`, który domyślnie nie jest zainstalowany)

Nie ma konfiguracji testów ani lintera.

## Architektura

- Astro 6 z `output: 'server'` i adapterem `@astrojs/node` w trybie `standalone` (`astro.config.mjs`). Przejście na wyjście statyczne (np. dla GitHub Pages) usunęłoby trasy API — zob. README, sekcja „Wdrożenie aplikacji”.
- `src/pages/index.astro` — jedyna strona UI (obecnie placeholder; tu trafi interfejs areny pojedynków).
- `src/pages/api/contributions/[username].ts` — dynamiczna trasa API `GET /api/contributions/:username`. Obecnie szkielet zwracający 501; ma pobierać `https://github.com/{username}.contribs` i zwracać dane kontrybucji jako JSON dla frontendu.
- Pliki tras API muszą eksportować `export const prerender = false;` oraz handlery typu `APIRoute`.

## Konwencje

- TypeScript korzysta z `astro/tsconfigs/strict`.
- Teksty w projekcie (UI, TODO, README) są po polsku; teksty widoczne dla użytkownika pisz po polsku i zachowaj klimat gdańskiej stoczni.
- Odpowiedzi API to JSON z nagłówkiem `Content-Type: application/json`, także błędy (`{ error: string }` z odpowiednim statusem).
