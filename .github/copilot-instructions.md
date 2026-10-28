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

## Motyw wizualny: gdańska stocznia nocą (pixel art)

Cała strona (`src/pages/index.astro`) trzyma się jednej estetyki: retro 8/16-bit w bałtyckim porcie nocą. **Każdy nowy element interfejsu musi pasować do tego motywu** (skrzynie, suwnice, nabrzeże, hak, stal i bursztyn — nie generyczne karty/przyciski).

- **Paleta (zmienne CSS w `:root`, używaj wyłącznie ich):** `--bg #0d1117` (noc), `--crane #3fb950` (suwnice), `--crane-dim #2ea043`, `--amber #e3b341` (akcenty, skrzynie, poświata), `--rust #b45309` (cegła, rdza), `--steel #8b949e` (konstrukcje, nabrzeże), `--text #e6edf3`. Kolory pochodne tylko przez `color-mix()`/rgba z tych zmiennych. Wyjątki: kolory poziomów kontrybucji z API (`colors_full`) oraz czerń kadłuba Sołdka.
- **Alternatywny motyw:** `:root[data-motyw='swit']` nadpisuje tę samą paletę na chłodny bałtycki świt (`--crane #58a6ff`, `--amber #f2cc60`). Nowe elementy używają zmiennych, aby działały w obu motywach. Przycisk „Bałtycki świt” przełącza motyw i zapisuje wybór w `localStorage`.
- **Fonty:** nagłówki, przyciski i plakietki w „Press Start 2P” (małe rozmiary, `line-height` ~1.5), tekst i dane w „JetBrains Mono” (Google Fonts).
- **Pixel art:** bez zaokrągleń (`border-radius: 0`), twarde cienie, grafika wyłącznie CSS lub inline SVG z `shape-rendering: crispEdges`; bez plików obrazów. Bursztynowa poświata (`text-shadow`/`box-shadow` z `color-mix`) jako „reflektor”.
- **Animacje:** subtelne i wolne (wahadło, kołysanie, paralaksa tła, migotanie), często `steps()` dla pikselowego efektu; nie mogą ograniczać czytelności danych. Każda nowa animacja musi być wyłączana przez istniejący blok `@media (prefers-reduced-motion: reduce)`.
- **Dekoracje** (panorama, port, Sołdek, Neptun) to elementy `aria-hidden="true"` z `pointer-events: none`, za treścią (ujemny `z-index`).
- Style elementów tworzonych skryptem w runtime muszą być w `<style is:global>`.
