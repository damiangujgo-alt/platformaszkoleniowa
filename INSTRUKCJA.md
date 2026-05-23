# Instrukcja wdrozenia - Budmat Trener Sprzedazy

## Co bedziesz potrzebowal
- Konto GitHub (darmowe) - github.com
- Konto Supabase (darmowe) - supabase.com
- Konto Vercel (darmowe) - vercel.com
- Klucz Anthropic API - console.anthropic.com

Czas: okolo 30-40 minut.

---

## KROK 1 - Supabase (baza danych)

1. Wejdz na supabase.com > Sign Up (mozesz przez GitHub)
2. Kliknij "New Project"
   - Organization: twoja organizacja (domyslna jest ok)
   - Name: budmat-trener
   - Database Password: wpisz jakies haslo (zapisz je, ale nie bedzie ci potrzebne pozniej)
   - Region: wybierz Europe (Frankfurt) - najblizej Polski
   - Kliknij "Create new project" (czekaj 1-2 minuty)

3. Po zaladowaniu projektu kliknij po lewej "SQL Editor"
4. Kliknij "New query"
5. Otworz plik supabase_schema.sql z tego folderu
6. Skopiuj cala zawartosc i wklej do SQL Editora
7. Kliknij "Run" - powinno pojawic sie "Success"

8. Teraz pobierz klucze:
   - Kliknij po lewej ikone zebatki (Settings)
   - Kliknij "API"
   - Skopiuj i zapisz:
     a) "Project URL" - wyglada jak: https://xxxxxxxxxxxx.supabase.co
     b) "anon public" key - dlugi ciag znakow

---

## KROK 2 - GitHub (repozytorium kodu)

1. Wejdz na github.com > Sign Up lub zaloguj sie
2. Kliknij "+" > "New repository"
   - Repository name: budmat-trener
   - Private: zaznacz (zeby kod nie byl publiczny)
   - Kliknij "Create repository"

3. Na stronie nowego repo kliknij "uploading an existing file"
4. Przeciagnij i upusc CALY folder budmat-trener (wszystkie pliki i foldery)
   - Vercel potrzebuje: package.json, vite.config.js, vercel.json, index.html, folder src/, folder api/
5. Kliknij "Commit changes"

---

## KROK 3 - Vercel (hosting)

1. Wejdz na vercel.com > Sign Up through GitHub
2. Kliknij "Add New Project"
3. Znajdz repozytorium "budmat-trener" > kliknij "Import"
4. Ustawienia projektu:
   - Framework Preset: Vite (powinno sie wykryc automatycznie)
   - Build Command: npm run build (domyslne, ok)
   - Output Directory: dist (domyslne, ok)

5. WAZNE - Environment Variables (zmienne srodowiskowe):
   Kliknij "Environment Variables" i dodaj trzy zmienne:

   Nazwa: ANTHROPIC_API_KEY
   Wartosc: [twoj klucz z console.anthropic.com - zaczyna sie od sk-ant-...]

   Nazwa: VITE_SUPABASE_URL
   Wartosc: [Project URL z Supabase, np. https://xxxx.supabase.co]

   Nazwa: VITE_SUPABASE_ANON_KEY
   Wartosc: [anon public key z Supabase]

6. Kliknij "Deploy"
7. Czekaj ok 2 minuty. Dostaniesz adres URL - np. budmat-trener-abc123.vercel.app

---

## KROK 4 - Test

1. Wejdz na swoj URL
2. Wpisz imie i przetestuj symulacje
3. Po symulacji logi powinny pojawic sie w Supabase:
   - Wejdz na supabase.com > projekt > Table Editor > logs

---

## Gdzie widac logi

- W aplikacji: kliknij "Manager" > zakladka "Logi rozmow"
- W Supabase bezposrednio: Table Editor > logs (mozesz filtrowac, sortowac, eksportowac do CSV)

---

## Jesli cos nie dziala

Najczestsze problemy:

Problem: Bialy ekran po wejsciu na URL
Rozwiazanie: Sprawdz czy build sie udal w panelu Vercel > Deployments > kliknij deployment > Build Logs

Problem: Symulacja nie startuje, blad polaczenia
Rozwiazanie: Sprawdz czy ANTHROPIC_API_KEY jest wpisany poprawnie w Vercel > Settings > Environment Variables

Problem: Logi sie nie zapisuja
Rozwiazanie: Sprawdz czy VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY sa poprawne
Sprawdz czy uruchomiles SQL schema w Supabase

---

## Aktualizacja aplikacji w przyszlosci

Gdy bedziesz chcial zmienic cos w aplikacji:
1. Zmodyfikuj pliki lokalnie
2. Wgraj zmodyfikowane pliki na GitHub (przeciagnij i upusc, tak jak przy pierwszym razie)
3. Vercel automatycznie wykryje zmiane i zbuduje nowa wersje (zajmuje 1-2 minuty)
