import { useState, useEffect, useRef } from "react";
import { db } from "./db.js";

/* ═══════════════════════════════ STYLES ═══════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=DM+Sans:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#0B0E19;color:#E2E5F0;font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;}
::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:#0B0E19;} ::-webkit-scrollbar-thumb{background:#2A2F45;border-radius:2px;}
.app{min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:0 16px 40px;}
.screen{width:100%;max-width:680px;padding-top:32px;}
.card{background:#141824;border:1px solid #1E2438;border-radius:12px;padding:24px;}
.card-sm{background:#141824;border:1px solid #1E2438;border-radius:10px;padding:16px;}
.card-hover{cursor:pointer;transition:border-color .2s,background .2s;}
.card-hover:hover{border-color:#C8973A;background:#181D2E;}
.display{font-family:'Sora',system-ui,sans-serif;font-weight:700;}
.label{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#7A82A0;}
.muted{color:#7A82A0;}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:none;border-radius:8px;font-family:'DM Sans',system-ui,sans-serif;font-weight:600;font-size:15px;cursor:pointer;transition:all .15s;padding:12px 20px;}
.btn-primary{background:#C8973A;color:#0B0E19;}
.btn-primary:hover{background:#D4A843;}
.btn-primary:disabled{background:#3A3520;color:#6B5A30;cursor:not-allowed;}
.btn-ghost{background:transparent;color:#E2E5F0;border:1px solid #1E2438;}
.btn-ghost:hover{border-color:#2A3050;background:#141824;}
.btn-danger{background:#3D1A1A;color:#E05555;border:1px solid #5A2020;}
.btn-danger:hover{background:#4A2020;}
.btn-sm{padding:8px 14px;font-size:13px;border-radius:6px;}
.input{background:#0B0E19;border:1px solid #1E2438;border-radius:8px;color:#E2E5F0;font-family:'DM Sans',system-ui,sans-serif;font-size:15px;padding:12px 16px;width:100%;outline:none;transition:border-color .2s;}
.input:focus{border-color:#C8973A;}
.input::placeholder{color:#4A5268;}
.textarea{resize:none;min-height:80px;}
.tag{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;}
.tag-b2b{background:#1A2540;color:#4A7BE5;}
.tag-b2c{background:#1A2F25;color:#3DB87A;}
.divider{border:none;border-top:1px solid #1E2438;margin:20px 0;}
.chat-wrap{display:flex;flex-direction:column;gap:12px;padding:16px 0;}
.msg{display:flex;gap:10px;max-width:90%;}
.msg-client{align-self:flex-start;}
.msg-user{align-self:flex-end;flex-direction:row-reverse;}
.msg-bubble{padding:10px 14px;border-radius:10px;font-size:14px;line-height:1.55;}
.msg-client .msg-bubble{background:#1A2030;border:1px solid #1E2438;color:#E2E5F0;}
.msg-user .msg-bubble{background:#C8973A;color:#0B0E19;font-weight:500;}
.msg-avatar{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;margin-top:2px;}
.avatar-client{background:#1A2540;color:#4A7BE5;}
.avatar-user{background:#3A2810;color:#C8973A;}
.score-bar-bg{height:6px;background:#1E2438;border-radius:3px;overflow:hidden;}
.score-bar-fill{height:100%;border-radius:3px;transition:width 1s ease;}
.tabs{display:flex;gap:2px;background:#0B0E19;border:1px solid #1E2438;border-radius:8px;padding:3px;}
.tab{flex:1;padding:8px 12px;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;text-align:center;transition:all .15s;color:#7A82A0;border:none;background:transparent;}
.tab.active{background:#141824;color:#E2E5F0;}
@keyframes spin{to{transform:rotate(360deg);}}
.spinner{border:2px solid #2A2F45;border-top-color:#C8973A;border-radius:50%;animation:spin .7s linear infinite;}
@keyframes dot{0%,80%,100%{opacity:0;}40%{opacity:1;}}
.dot{width:6px;height:6px;border-radius:50%;background:#7A82A0;display:inline-block;}
.dot:nth-child(1){animation:dot 1.2s .0s infinite;}
.dot:nth-child(2){animation:dot 1.2s .2s infinite;}
.dot:nth-child(3){animation:dot 1.2s .4s infinite;}
.module-card{border-radius:12px;padding:24px;cursor:pointer;transition:all .2s;border:2px solid transparent;}
.module-card:hover{transform:translateY(-2px);}
.module-neg{background:linear-gradient(135deg,#0F1828 0%,#141E35 100%);border-color:#1E2E55;}
.module-neg:hover{border-color:#4A7BE5;}
.module-clos{background:linear-gradient(135deg,#1C130A 0%,#251C0D 100%);border-color:#3A2810;}
.module-clos:hover{border-color:#C8973A;}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
.fade-in{animation:fadeIn .3s ease forwards;}
.badge{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;font-size:11px;font-weight:700;background:#C8973A;color:#0B0E19;}
`;

/* ═══════════════════════════════ PERSONAS ═══════════════════════════════ */
const PERSONAS_DEFAULT = [
  {
    id:"p1",name:"Właściciel firmy",type:"B2B",difficulty:3,tag:"Decydent cenowy",
    neg:{model:"Transit Custom L1 2.0 EcoBlue 136KM",price:"168 000 zł netto",demand:"Żąda 155 000 zł. Mówi że Fiat Ducato kosztuje 142 000 zł.",context:"Firma hydrauliczna, kupuje drugie auto, zna rynek, rozmawiał z kilkoma dealerami.",goal:"Obronić cenę powyżej 161 000 zł. Nie schodzić bez warunku. Zbadać czy Fiat to blef."},
    clos:{model:"Transit Custom L1 2.0 EcoBlue 136KM",price:"168 000 zł - ustalona",demand:"Cena ustalona, ale klient mówi 'zadzwonię w przyszłym tygodniu i finalizujemy'. Wcześniej pytał o termin dostawy.",goal:"Zamknąć dziś. Wyciągnąć co blokuje. Zaproponować zaliczkę.",context:""},
    prompt:`Jesteś właścicielem małej firmy budowlanej lub transportowej (kilku pracowników). Znasz rynek i rozmawiałeś z innymi dealerami. Masz realną alternatywę - Fiat Ducato za 142 000 zł. Jesteś bezpośredni, pewny siebie i wracasz do ceny. Ustępujesz tylko gdy dostajesz coś konkretnego w zamian. Twoja BATNA jest realna - możesz poczekać miesiąc. Odpowiadaj krótko (2-3 zdania), naturalnym językiem przedsiębiorcy. Nie ułatwiaj handlowcowi. Jeśli da Ci coś za darmo bez warunku - bierz i proś o więcej.`
  },
  {
    id:"p2",name:"Współwłaściciel",type:"B2B",difficulty:2,tag:"Niezdecydowany",
    neg:{model:"Transit Custom L2 2.0 EcoBlue 170KM",price:"182 000 zł netto",demand:"Chce ofertę na piśmie. Musi pokazać wspólnikowi.",context:"Firma budowlana, kontrakt startuje za 6 tygodni. Wspólnik zajęty.",goal:"Wyciągnąć deadline. Osłabić BATNA przez czas dostawy. Doprowadzić do decyzji lub umówić ze wspólnikiem."},
    clos:{model:"Transit Custom L2 2.0 EcoBlue 170KM",price:"182 000 zł - ustalona",demand:"Przy zamknięciu: 'Muszę zadzwonić do wspólnika - na pewno się zgodzi ale muszę go poinformować'. Wcześniej pytał o leasing.",goal:"Zdiagnozować czy wspólnik to realna blokada czy pretekst. Domknąć lub umówić wspólne spotkanie.",context:""},
    prompt:`Jesteś jednym z dwóch wspólników firmy usługowej. Drugi wspólnik nie przyszedł. Potrzebujecie auta na kontrakt za 6 tygodni. Jesteś pasywny i zbierasz informacje - unikasz zobowiązań. Chowasz się za wspólnikiem gdy czujesz presję. Twoja BATNA jest słaba - czas nagli ale o tym nie mówisz. Odpowiadaj krótko, niepewnie, z ostrożnością.`
  },
  {
    id:"p3",name:"Mąż (firma na żonę)",type:"B2B",difficulty:2,tag:"Wymówka żony",
    neg:{model:"Transit Custom L1 Trail 2.0 EcoBlue 170KM",price:"195 000 zł netto",demand:"Mówi 'muszę powiedzieć żonie' za każdym razem gdy zbliżacie się do decyzji.",context:"Jednoosobowa działalność, faktycznie decyzje podejmuje sam.",goal:"Zidentyfikować że żona to wymówka. Wyciągnąć prawdziwą obiekcję. Zaproponować zaliczkę z możliwością rezygnacji.",context:""},
    clos:{model:"Transit Custom L1 Trail 2.0 EcoBlue 170KM",price:"195 000 zł - ustalona",demand:"Cena uzgodniona, klient mówi 'żona musi to zaakceptować, zadzwonię jutro'. Wcześniej mówił że używa auta sam do pracy.",goal:"Zdemaskować że żona to pretekst. Wyciągnąć prawdziwą obiekcję. Zamknąć lub wziąć zaliczkę.",context:""},
    prompt:`Jesteś właścicielem jednoosobowej działalności - hydraulik lub elektryk. Faktycznie decydujesz sam ale używasz 'żony' jako wymówki gdy nie chcesz podjąć decyzji. Twoja prawdziwa obiekcja to cena - uważasz że to za dużo ale nie mówisz tego wprost. Gdy handlowiec dobrnął do zamknięcia - powołujesz się na żonę. Jeśli handlowiec wprost zapyta czy to jest jedyna przeszkoda - przyznaj po chwili oporu że chodzi Ci o cenę.`
  },
  {
    id:"p4",name:"Pracownik od szefa",type:"B2B",difficulty:3,tag:"Bez mandatu",
    neg:{model:"Transit L3H2 2.0 EcoBlue 130KM",price:"195 000 zł netto",demand:"Zbiera oferty dla szefa. Nie ma mandatu do negocjacji.",context:"Duża firma logistyczna, flota 15 pojazdów.",goal:"Dotrzeć do decydenta. Zaproponować bezpośrednie spotkanie z szefem. Nie dawać rabatów pracownikowi który nie ma mocy decyzji."},
    clos:{model:"Transit L3H2 2.0 EcoBlue 130KM",price:"Do ustalenia z szefem",demand:"Pracownik mówi 'szef powiedział że jak będzie poniżej 185 000 to bierzemy trzy'. Szef nie jest dostępny.",goal:"Zweryfikować czy pracownik ma mandat. Zaproponować rozmowę z szefem. Nie składać oferty przez pośrednika bez gwarancji.",context:""},
    prompt:`Jesteś pracownikiem administracyjnym dużej firmy logistycznej. Szef wysłał Cię po oferty na 3 Transity. Nie masz mandatu do negocjacji - możesz tylko zbierać ceny i przekazywać szefowi. Jesteś miły ale bezradny. Gdy handlowiec pyta o decyzję - mówisz 'ja tylko zbieram oferty'. Znasz cenę którą szef zaakceptuje ale mówisz ją tylko jeśli handlowiec bezpośrednio pyta.`
  },
  {
    id:"p5",name:"Malzenstwo",type:"B2C",difficulty:3,tag:"Wspolna decyzja",
    neg:{model:"Kuga PHEV 2.5 Duratec 225KM",price:"189 900 zł",demand:"Mąż chce rabatu, żona pyta o raty.",context:"Oboje na miejscu. Mąż bardziej aktywny, żona bardziej ostrożna finansowo.",goal:"Przekonać oboje - mąż chce cenę poniżej 180k, żona chce ratę poniżej 2 000 zł/mies."},
    clos:{model:"Kuga PHEV 2.5 Duratec 225KM",price:"184 000 zł - ustalona",demand:"Mąż jest gotowy, żona hamuje: 'to dużo pieniędzy na raz, może poczekajmy'.",goal:"Zidentyfikować obiekcję żony (budżet vs wartość). Zaproponować leasing. Zamknąć z decyzją obojga.",context:""},
    prompt:`Grasz dwie role naraz - małżeństwo. Mąż (aktywny, decyzyjny) chce rabatu i szybko zamknąć. Żona (ostrożna, finansowa) pyta o raty i zastanawia się czy to dobra decyzja. Gdy handlowiec mówi do jednego z Was - odpowiadaj z jego perspektywy. Małżeństwo potrzebuje żeby obie osoby były przekonane. Jeśli handlowiec zaniedbuje żonę - ona hamuje decyzję.`
  },
  {
    id:"p6",name:"Ekspert z zona (Puma)",type:"B2C",difficulty:2,tag:"Podwojny glos",
    neg:{model:"Puma ST-Line X 1.0 EcoBoost 125KM automat",price:"119 900 zł",demand:"Mąż chce zejść do 109 000 zł. Żona jest niepewna co do koloru - chciałaby czerwony ale jest tylko niebieski.",goal:"Obronić cenę. Zaangażować żonę w decyzję. Zaproponować zamówienie na kolor."},
    clos:{model:"Puma ST-Line X 1.0 EcoBoost 125KM automat",price:"115 000 zł - ustalona",demand:"Mąż jest zdecydowany na ten model. Żona mówi że musi przemyśleć - chodzi jej o kolor niebieski zamiast czerwonego.",goal:"Rozwiać wątpliwości żony co do koloru. Pokazać opcję zamówienia. Zamknąć z zaliczką.",context:""},
    prompt:`Jesteś mężem - dobrze znasz się na autach i testowałeś kilka modeli. Żona jest z Tobą i ma głos przy decyzji - głównie liczy się dla niej wygląd i kolor. Mąż negocjuje cenę, żona komentuje estetykę. Jeśli handlowiec zaangażuje żonę i rozwiąże kwestię koloru - mąż odpuszcza część negocjacji cenowej.`
  },
  {
    id:"p7",name:"Zona budzietowa",type:"B2C",difficulty:3,tag:"Zona ma weto",
    neg:{model:"Ranger Wildtrak 4x4 2.0 EcoBlue 170KM",price:"249 900 zł",demand:"Mąż jest gotowy kupić. Żona mówi 'to za dużo, nie potrzebujemy tak drogiego auta'.",goal:"Rozwiać wątpliwości żony. Zrozumieć jej obiekcję (budżet vs potrzeba). Zaproponować tańszą wersję lub leasing."},
    clos:{model:"Ranger Wildtrak 4x4 2.0 EcoBlue 170KM",price:"240 000 zł - ustalona z mężem",demand:"Mąż zamknięty, żona wciąż oporna: 'na pewno to jest mądra decyzja?'",goal:"Adresować obiekcję żony. Dać jej racjonalne uzasadnienie decyzji. Zamknąć z obojgiem.",context:""},
    prompt:`Grasz dwie role. Mąż jest entuzjastą - chce Rangera, już zdecydowany. Żona jest praktyczna i patrzy na budżet - obawia się że to zbędny wydatek i woli coś tańszego. Żona szanuje opinie ekspertów - jeśli handlowiec da jej solidne uzasadnienie dlaczego ten wybór jest mądry finansowo - ustępuje. Jeśli handlowiec ignoruje jej obawy - blokuje decyzję.`
  },
  {
    id:"p8",name:"Flotowiec",type:"B2B",difficulty:5,tag:"Profesjonalny negocjator",
    neg:{model:"Transit Custom L1 x3 sztuki",price:"168 000 zł/szt netto",demand:"Mówi że ma oferty po 156 000 zł od 2 dealerów. Chce 154 000 zł/szt.",context:"Firma logistyczna, flota 30 pojazdów. Kupuje regularnie co 3 lata.",goal:"Zbadać czy 156k to blef. Nie schodzić poniżej 160k bez pakietu serwisowego. Zaoferować warunki serwisowe zamiast czystego rabatu."},
    clos:{model:"Transit Custom L1 x3 sztuki",price:"162 000 zł/szt - po negocjacjach",demand:"Flotowiec mówi 'mam u Was warunki ale kolega mówi że Autoplaza daje taniej. Muszę to sprawdzić.'",goal:"Utrzymać klienta. Zbadać czy Autoplaza to blef. Pokazać wartość relacji i serwisu. Zamknąć przed wyjściem.",context:""},
    prompt:`Jesteś doświadczonym specjalistą ds. floty w dużej firmie logistycznej. Kupujesz auta regularnie od 10 lat. Znasz wszystkie techniki handlowców i stosujesz własne. Masz realne oferty alternatywne (lub udajesz że masz). Nigdy nie akceptujesz pierwszej ceny. Testujesz granice handlowca systematycznie. Szanujesz handlowców którzy znają produkt i nie łamią się przy pierwszym nacisku. Odpowiadaj profesjonalnie, sucho, bez emocji.`
  }
];

/* ═══════════════════════════════ THEORY ═══════════════════════════════ */
const THEORY = {
  negocjacje: [
    {id:1,title:"Mindset negocjatora",sections:[
      {id:"1.1",title:"Kto ma więcej do stracenia - przegrywa",source:"Fisher & Ury, Getting to Yes",text:`Fisher & Ury (Getting to Yes, Harvard Negotiation Project) definiują BATNA - Best Alternative To a Negotiated Agreement - jako prawdziwe źródło siły negocjacyjnej.\n\nBAT NA prosto: to Twój plan B jeśli ta konkretna negocjacja się nie uda. Klient idzie do konkurencji? Czeka? Rezygnuje z zakupu? Ty sprzedajesz auto komuś innemu? To właśnie jest BATNA każdej ze stron. Im lepsza Twoja alternatywa, tym mniej musisz się godzić na warunki klienta.\n\nHandlowiec który musi zamknąć koniec miesiąca ma słabą BATNA. Klient który potrzebuje Transita za 3 tygodnie - też ma słabą BATNA. Zadanie: znać swoją, osłabiać jego.`},
      {id:"1.2",title:"Emocje klienta to dane - nie problem",source:"Chris Voss, Never Split the Difference",text:`Voss (Never Split the Difference) wprowadza pojęcie tactical empathy - rozumiesz emocje rozmówcy i nazywasz je wprost, ale nie dajesz się nimi prowadzić.\n\nGdy klient mówi "jestem rozczarowany tą ofertą" - właściwa odpowiedź to "widzę, że ta cena nie spełniła Pana oczekiwań" - nie przeprosiny i natychmiastowy rabat. Nazwanie emocji rozładowuje napięcie i daje czas na zbadanie rzeczywistej pozycji klienta.`},
      {id:"1.3",title:"Milczenie to narzędzie",source:"Voss / Rackham, SPIN Selling",text:`Voss (Never Split the Difference): po złożeniu oferty lub zadaniu pytania - cisza należy do rozmówcy. Rackham (SPIN Selling, badania na 35 000 rozmowach): skuteczni sprzedawcy mówią mniej niż nieefektywni - więcej słuchają i zadają pytania.\n\nHandlowiec który po podaniu ceny zaczyna ją natychmiast tłumaczyć, de facto negocjuje przeciwko sobie.`},
      {id:"1.4",title:"Nie jesteś petentem - kontroluj ramy",source:"Oren Klaff, Pitch Anything",text:`Klaff (Pitch Anything) opisuje frame control - kto narzuca ramy rozmowy, ten kontroluje jej wynik. Handlowiec który wchodzi w rolę "proszę, może coś damy radę zrobić" oddaje ramę klientowi.\n\nWłaściwa postawa: Ty masz produkt z realną wartością. Klient ma alternatywy - ale każda ma swój koszt (czas, ryzyko, brak serwisu, brak zabudowy). Pewność siebie nie jest arogancją - jest znajomością własnej pozycji.`}
    ]},
    {id:2,title:"BATNA i ZOPA jako mapy negocjacyjne",sections:[
      {id:"2.1",title:"BATNA - trzy pytania przed rozmową",source:"Fisher & Ury, Getting to Yes",text:`Fisher & Ury (Getting to Yes): przed każdą negocjacją odpowiedz na trzy pytania:\n\n- Jaka jest moja BATNA? (mam innych kupujących? koniec miesiąca mnie goni?)\n- Jaka jest prawdopodobna BATNA klienta? (ile czeka u konkurencji? czy ma deadline?)\n- Co mogę zrobić żeby jego BATNA była słabsza? (dostępność, czas dostawy, brak zabudowy, serwis)\n\nHandlowiec który wchodzi na rozmowę bez tych odpowiedzi - improwizuje. Handlowiec który je zna - zarządza rozmową.`},
      {id:"2.2",title:"ZOPA - strefa w której deal jest możliwy",source:"Malhotra & Bazerman, Negotiation Genius",text:`Malhotra & Bazerman (Negotiation Genius, Harvard Business School) definiują ZOPA - Zone of Possible Agreement - jako przestrzeń między minimalną ceną akceptowalną przez sprzedającego a maksymalną przez kupującego.\n\nZOPA prosto: Ty zejdziesz maksymalnie do 188 000 zł. Klient zapłaci maksymalnie 192 000 zł. ZOPA istnieje - jest w niej 4 000 zł przestrzeni. Jeśli Ty nie schodzisz poniżej 195 000 zł a klient nie przekroczy 188 000 zł - ZOPA nie istnieje i żadna technika tego nie zmieni.`},
      {id:"2.3",title:"Jak badać ZOPA klienta",source:"Malhotra & Bazerman / Voss",text:`Klient nigdy nie powie Ci swojej górnej granicy. Twoja praca to ją zbadać - nie zgadywać.\n\nPytania kalibrowane które badają ZOPA bez ujawniania własnych granic:\n\n"Co sprawiłoby że ta oferta byłaby dla Pana do przyjęcia?"\n"Co jest ważniejsze - miesięczna rata czy cena całkowita?"\n"Gdybyśmy rozwiązali tę kwestię - czy jest coś innego co mogłoby stanąć na drodze do decyzji?"\n"Jak wygląda Pana proces decyzyjny przy zakupie takiej floty?"\n"Co sprawia że rozgląda się Pan za zmianą dostawcy?"`},
      {id:"2.4",title:"Rozszerzanie ZOPA - nie walka o cenę",source:"Malhotra & Bazerman, Negotiation Genius",text:`Malhotra & Bazerman rozróżniają: claiming value (walka o podział tego co jest) vs creating value (powiększenie tego co do podziału). Dobry negocjator najpierw rozszerza tort - dopiero potem go dzieli.\n\nWażna zasada operacyjna: każdy "gratis" dorzucony do auta ma swoją cenę - musisz go kupić od serwisu lub partnera. Właściwe myślenie: porównaj koszt ustępstwa z kosztem rabatu i wybierz to co jest tańsze do oddania przy zbliżonej wartości postrzeganej przez klienta.\n\nJeśli klient żąda rabatu 5 000 zł - policz ile kosztuje Cię pakiet serwisowy o zbliżonej wartości. Jeśli koszt pakietu to 2 500 zł - wymieniasz ustępstwo tańsze za droższe.`}
    ]},
    {id:3,title:"Fazy rozmowy negocjacyjnej",sections:[
      {id:"3.1",title:"Przygotowanie - dwie sytuacje",source:"Fisher & Ury / Rackham",text:`Fisher & Ury (Getting to Yes): idealna negocjacja zaczyna się przed rozmową. W praktyce salonu rzadko masz ten komfort.\n\nSytuacja A - masz czas (umówione spotkanie, znany klient): trzy rzeczy przed rozmową: jaka jest moja BATNA dziś, jaki jest mój cel cenowy, co wiem o kliencie.\n\nSytuacja B - klient wchodzi bez zapowiedzi: przygotowanie przenosi się na pierwsze 3 minuty. Zanim padnie jakakolwiek cena - zadajesz pytania rozpoznawcze. To nie jest uprzejmość, to jest zbieranie danych.\n\nMinimum które musisz zebrać zanim podasz cenę:\n- Do czego klient potrzebuje pojazdu?\n- Kiedy potrzebuje go mieć?\n- Czy kupuje sam czy konsultuje z kimś?\n- Czy rozgląda się gdzieś indziej?`},
      {id:"3.2",title:"Rozpoznanie - mów mniej, pytaj więcej",source:"Rackham, SPIN Selling",text:`Rackham (SPIN Selling): w sprzedaży złożonej (wysoka wartość, B2B) faza rozpoznania decyduje o wyniku bardziej niż jakiekolwiek techniki zamykania. Handlowiec który przeskakuje do oferty bez rozpoznania - zgaduje czego klient potrzebuje.\n\nCel fazy: zbadać ZOPA klienta, jego BATNA, rzeczywiste potrzeby i ukryte obiekcje.\n\nBłąd który tu popełnia większość: mówienie o produkcie zanim klient poczuje że został wysłuchany.`},
      {id:"3.3",title:"Zakotwiczenie - kto podaje cenę pierwszy",source:"Kahneman, Thinking Fast and Slow",text:`Kahneman (Thinking Fast and Slow): efekt kotwicy - pierwsza liczba która pada w negocjacji nieracjonalnie przyciąga obie strony. Wysoka kotwica przesuwa cały obszar negocjacji w górę.\n\nZasada: kotwicz pierwszy i kotwicz wysoko. Nie czekaj aż klient poda swoją cenę. Kto podaje pierwszy - narzuca punkt odniesienia dla całej rozmowy.\n\nBłąd: zaczynanie od razu od "najlepszej ceny" bo klient "poważnie pyta". To oddanie kotwicy zanim negocjacja się zaczęła.`},
      {id:"3.4",title:"Wymiana ustępstw - każde ma warunek",source:"Cialdini / Voss",text:`Cialdini (Influence): reguła wzajemności - ustępstwo bez warunku niszczy mechanizm zobowiązania. Klient bierze i czeka na więcej.\n\nVoss (Never Split the Difference, Ackermann Model): ustępstwa mają być malejące. Pierwsze największe z serii, każde kolejne wyraźnie mniejsze - sygnalizuje że zbliżasz się do granicy.\n\nFormuła warunkowego ustępstwa: "Jeżeli... to..." - nigdy nie dajesz nic bez brania czegoś w zamian.\n\nPrzykład: "Jeżeli podejmiecie decyzję do piątku, jestem w stanie zaproponować przedłużoną gwarancję w tej cenie."\nNie: "Dobra, dorzucę gwarancję."`},
      {id:"3.5",title:"Zamknięcie - nie spiesz się, nie przedłużaj",source:"Fisher & Ury / Voss",text:`Fisher & Ury: zamknięcie powinno być naturalną konsekwencją poprzednich faz - nie sztuczką. Jeśli rozpoznanie było dobre i ustępstwa przemyślane, zamknięcie jest logicznym krokiem.\n\nVoss: gdy klient dał sygnały gotowości (pyta o termin dostawy, dopytuje o finansowanie, mówi "to by pasowało") - przestań sprzedawać. Zadaj jedno pytanie zamykające i zamilknij.\n\nPrzykład: "Czy możemy to sfinalizować na tych warunkach?" - i cisza.\n\nBłąd: kontynuowanie sprzedawania gdy klient jest już gotowy. To rodzi nowe wątpliwości tam gdzie ich nie było.`}
    ]},
    {id:4,title:"Typy ataków cenowych i riposty",sections:[
      {id:"4.1",title:"Za drogo",source:"Voss, Never Split the Difference",text:`Co naprawdę znaczy: najczęściej nie oznacza że cena przekracza budżet - oznacza że klient nie widzi jeszcze wystarczającej wartości lub testuje czy zejdziesz.\n\nBłędna reakcja: natychmiastowe "a ile Pan chciał zapłacić?" lub przeprosiny i rabat.\n\nRiposte (Voss - etykietowanie): "Rozumiem, że cena jest dla Pana istotnym elementem decyzji. Czy mogę zapytać - za drogo w stosunku do czego?"\n\nTo pytanie zmusza klienta do sprecyzowania. Albo pokaże punkt odniesienia albo ujawni że "za drogo" to odruch, nie twarde stanowisko.`},
      {id:"4.2",title:"Konkurencja daje taniej",source:"Fisher & Ury / Kahneman",text:`Co naprawdę znaczy: klient ma lub szuka argumentu do negocjacji. Rzadko oferty są w pełni porównywalne.\n\nRiposte (Fisher & Ury - badaj interesy): "Rozumiem. Czy mogę zapytać - co dokładnie obejmuje tamta oferta? Chcę się upewnić że porównujemy to samo."\n\nW 80% przypadków oferty różnią się wyposażeniem, terminem dostawy, warunkami serwisu lub finansowania.\n\nKahneman - framing przez stratę: jeśli różnica jest realna: "Różnica to X złotych. Czy warto ryzykować [dłuższy czas dostawy / brak lokalnego serwisu] dla tej kwoty?"`},
      {id:"4.3",title:"Dajcie X% i biorę dziś",source:"Cialdini, Influence",text:`Co naprawdę znaczy: klient chce zamknąć - to dobry sygnał. Jednocześnie testuje czy presja czasowa działa na Ciebie bardziej niż na niego.\n\nRiposte (Cialdini - wzajemność): "Jeżeli jesteśmy w stanie zamknąć to dziś, sprawdzę co mogę zrobić - ale potrzebuję czegoś od Pana w zamian. Czy jest Pan w stanie potwierdzić zamówienie z zaliczką jeszcze dziś?"\n\nNigdy nie dajesz rabatu bez zabrania czegoś.`},
      {id:"4.4",title:"Muszę porozmawiać ze wspólnikiem / szefem",source:"Rackham, SPIN Selling",text:`Co naprawdę znaczy: albo prawda (decydent jest gdzie indziej) albo ucieczka od decyzji.\n\nBłędna reakcja: "oczywiście, proszę dać znać" - i czekanie.\n\nRiposte (Rackham - odkryj proces decyzyjny): "Rozumiem. Żeby dobrze przygotować się do tej rozmowy - co jest dla Pana wspólnika najważniejsze przy tego typu zakupie?"\n\nJeśli klient zna odpowiedź - rozmawiasz z osobą zaangażowaną. Jeśli nie zna - decydent jest gdzie indziej i powinieneś zaproponować spotkanie bezpośrednie.`},
      {id:"4.5",title:"Przemyślę to",source:"Voss / Rackham",text:`Co naprawdę znaczy: istnieje ukryta obiekcja której klient nie powiedział wprost.\n\nRiposte A (Voss): "Rozumiem. Co sprawia że potrzebuje Pan więcej czasu na tę decyzję?"\n\nRiposte B - technika bezpośrednia: "Rozumiem. Większość moich klientów kiedy tak mówi ma obiekcje wobec ceny albo wobec mnie - jak jest w Pana przypadku?" - i cisza.\n\nJeśli klient odpowie "nie, chodzi mi o coś innego" - NIE PRZERYWAJ. Właśnie usłyszałeś prawdziwą obiekcję. Wróć do etykietowania (Voss): "Rozumiem, że chodzi o [X]. Czy dobrze to rozumiem?" - zanim zaproponujesz jakiekolwiek rozwiązanie.`}
    ]},
    {id:5,title:"Techniki negocjacyjne",sections:[
      {id:"5.1",title:"Mirroring - lustro",source:"Voss, Never Split the Difference",text:`Voss (Never Split the Difference): najprostsza i najbardziej niedoceniana technika. Powtarzasz ostatnie 2-3 słowa tego co powiedział klient - z lekkim uniesieniem głosu na końcu. Klient automatycznie kontynuuje i ujawnia więcej niż zamierzał.\n\nPrzykład:\nKlient: "Ta cena jest dla nas za wysoka na ten moment."\nHandlowiec: "Za wysoka na ten moment?"\nKlient: "No bo mamy jeszcze drugi zakup zaplanowany na kwiecień..."\n\nWłaśnie dowiedziałeś się że jest drugi pojazd w planach - bez zadawania pytania.`},
      {id:"5.2",title:"Kotwiczenie - kto mówi pierwszy",source:"Kahneman, Thinking Fast and Slow",text:`Kahneman (Thinking Fast and Slow): pierwsza liczba która pada w rozmowie działa jak kotwica - nieracjonalnie przyciąga obie strony przez całą negocjację.\n\nZasada: zawsze podawaj cenę katalogową jako punkt startowy. Każde zejście z niej to Twoje świadome ustępstwo.\n\nBłąd który kosztuje: "dla Pana zrobimy najlepszą cenę od razu" - oddajesz kotwicę zanim rozmowa się zaczęła.`},
      {id:"5.3",title:"Malejące ustępstwa - Ackermann Model",source:"Voss, Never Split the Difference",text:`Voss (Never Split the Difference, Ackermann Model): sekwencja ustępstw musi być malejąca. Pierwsze ustępstwo jest największe z całej serii - ale nie może być na tyle duże żeby sygnalizować nieograniczone pole manewru. Każde kolejne wyraźnie mniejsze.\n\nPrzykład przy cenie wyjściowej 195 000 zł:\n- Pierwsze zejście: 3 000 zł (192 000 zł)\n- Drugie zejście: 1 200 zł (190 800 zł)\n- Trzecie zejście: 400 zł (190 400 zł)\n\nKlient widzi malejące kroki i rozumie że za chwilę nie ma już gdzie schodzić. Ciągłe równe ustępstwa (2 000/2 000/2 000) sugerują że masz jeszcze dużo miejsca.`},
      {id:"5.4",title:"Ustępstwo warunkowe",source:"Cialdini, Influence",text:`Cialdini (Influence): reguła wzajemności - ustępstwo bez warunku niszczy mechanizm zobowiązania.\n\nFormuła: "Jeżeli [coś od klienta] - to [coś od Ciebie]."\n\nPrzykłady:\n"Jeżeli zdecyduje się Pan dziś - jestem w stanie zaproponować przedłużony pakiet serwisowy."\n"Jeżeli weźmiecie dwa pojazdy - mogę porozmawiać o lepszych warunkach na oba."\n"Jeżeli wpłaci Pan zaliczkę do końca tygodnia - trzymam dla Pana tę cenę."\n\nNigdy: "Dobra, dorzucę pakiet serwisowy."`},
      {id:"5.5",title:"Redukcja rabatu do kosztu dziennego",source:"Kahneman, Thinking Fast and Slow",text:`Kahneman (Thinking Fast and Slow) - framing: ta sama kwota postrzegana jest różnie w zależności od opisu. 5 000 zł różnicy w cenie auta brzmi poważnie. Rozłożona na 4 lata użytkowania to 3,42 zł dziennie.\n\nPrzykład: "Mówimy o różnicy 4 800 zł na pojeździe który będzie jeździł przez 4 lata. To około 3 złotych i 30 groszy dziennie. Czy warto dla tej kwoty rezygnować z [serwisu / gwarancji / dostępności terminu]?"\n\nTechnika szczególnie skuteczna gdy klient liczy każdą złotówkę.`},
      {id:"5.6",title:"Niedobór - dostępność jako argument",source:"Cialdini, Influence",text:`Cialdini (Influence) - reguła niedoboru: to czego jest mało, jest bardziej pożądane. W sprzedaży samochodów to często fakt, nie manipulacja.\n\nPrzykład: "Ten kolor z tym silnikiem mamy aktualnie jeden w stocku. Nie wiem kiedy będzie kolejna dostawa i w jakiej cenie."\n\nWarunek bezwzględny: musi być prawda. Klient który wróci i znajdzie 5 takich samych aut - nie wróci do Ciebie nigdy więcej.`}
    ]},
    {id:6,title:"Bledy ktore kosztuja marze",sections:[
      {id:"6.1",title:"Pierwsze ustępstwo zbyt duże",source:"Voss, Never Split the Difference",text:`Voss (Ackermann Model): pierwsze ustępstwo jest największe z zaplanowanej sekwencji - ale nie może sygnalizować nieograniczonego pola manewru. Skok o 8 000 zł przy pierwszym nacisku mówi klientowi że warto naciskać dalej.\n\nZasada: zaplanuj całą sekwencję ustępstw zanim wejdziesz w negocjację. Wiedz z góry: pierwsze zejście, drugie, trzecie i twarda granica.\n\nBłąd: handlowiec chce szybko zadowolić klienta i schodzi od razu o dużą kwotę. Efekt odwrotny - klient traci zaufanie do ceny wyjściowej i negocjuje od nowego punktu.`},
      {id:"6.2",title:"Ustępowanie bez warunku",source:"Cialdini, Influence",text:`Cialdini (Influence): każde ustępstwo musi mieć formułę "jeżeli... to...". Bez wyjątków. Nawet małe rzeczy - dywaniki, przedłużenie gwarancji o miesiąc - powinny być wymienialne na coś: decyzję dziś, zaliczkę, rekomendację.\n\nUstępstwo bez warunku uczy klienta że wystarczy prosić.`},
      {id:"6.3",title:"Tłumaczenie się z ceny",source:"Kahneman, Thinking Fast and Slow",text:`Kahneman (Thinking Fast and Slow): uzasadnianie ceny sugeruje że sam w nią nie wierzysz. Klient który słyszy długie wyjaśnienia słyszy niepewność, nie wartość.\n\nCena pada - i cisza. Jeśli klient pyta dlaczego tyle - odpowiadasz jednym zdaniem o wartości.\n\nBłąd w praktyce: "No wie Pan, teraz ceny wszędzie poszły w górę, Ford podniósł cenniki, my sami niewiele zarabiamy..." - zniszczenie własnej pozycji w kilku zdaniach.`},
      {id:"6.4",title:"Mówienie za dużo po ofercie",source:"Voss, Never Split the Difference",text:`Voss: po podaniu ceny - cisza. Handlowiec który wypełnia ciszę po cenie negocjuje sam ze sobą.\n\nTypowy błąd: "Transit Custom to 168 000 zł netto... oczywiście to jest cena katalogowa... możemy porozmawiać o warunkach... zazwyczaj dajemy jakiś rabat dla firm..."\n\nKlient nie musiał nic zrobić. Właśnie dostał informację że cena jest negocjowalna i że handlowiec się spieszy.`},
      {id:"6.5",title:"Zamykanie za wcześnie",source:"Rackham, SPIN Selling",text:`Rackham (SPIN Selling, badania na 35 000 rozmowach): techniki zamykania użyte przed zakończeniem fazy rozpoznania - aktywnie szkodzą. Klient czuje presję zanim poczuł że jego potrzeby zostały zrozumiane.\n\nZasada: zamknięcie jest możliwe dopiero gdy klient zrozumiał wartość produktu i gdy zbadałeś jego rzeczywiste potrzeby.`},
      {id:"6.6",title:"Negocjowanie z niezdecydentem",source:"Rackham, SPIN Selling",text:`Rackham: najkosztowniejszy błąd w sprzedaży B2B. Dajesz rabat osobie która nie może podjąć decyzji - a decydent dostaje tę cenę jako punkt startowy do kolejnej rundy negocjacji.\n\nZasada: zanim zaczniesz negocjować - sprawdź czy rozmawiasz z osobą która może powiedzieć "tak".\n\nPytanie kalibrowane: "Jak wygląda u Państwa proces decyzyjny przy tego typu zakupie?"`}
    ]}
  ],
  zamykanie: [
    {id:1,title:"Mindset zamykania",sections:[
      {id:"1.1",title:"Zamknięcie to nie atak - to obowiązek",source:"Rackham, SPIN Selling",text:`Rackham (SPIN Selling): zamknięcie sprzedaży jest często mylone z presją i manipulacją. To błąd. Klient który przyszedł do salonu i jest zainteresowany - oczekuje że ktoś go poprowadzi do decyzji. Handlowiec który nie pyta o zamknięcie - zawodzi klienta.\n\nZamknięcie to nie moment ataku. To moment w którym handlowiec mówi: "zrobiłem wszystko żebyś mógł podjąć dobrą decyzję - czy jesteś gotowy?"`},
      {id:"1.2",title:"Strach przed odmową kosztuje więcej niż odmowa",source:"Hopkins, How to Master the Art of Selling",text:`Hopkins (How to Master the Art of Selling): największy wróg zamknięcia to strach handlowca przed słowem "nie". Paradoks: handlowiec który boi się zapytać o decyzję - dostaje "nie" przez zaniechanie, nie przez próbę.\n\nKażde "nie" to informacja. Każde pytanie o decyzję które nie pada - to stracona szansa bez danych.`},
      {id:"1.3",title:"Zamknięcie zaczyna się na początku rozmowy",source:"Voss, Never Split the Difference",text:`Voss (Never Split the Difference): handlowiec który dobrze przeprowadził rozpoznanie, zbadał ZOPA, właściwie zakotwiczył i przeprowadził wymianę ustępstw - zamknięcie jest ostatnim małym krokiem, nie wielkim skokiem.\n\nZasada: jeśli musisz używać agresywnych technik zamykania - rozmowa przed nimi była przeprowadzona źle.`},
      {id:"1.4",title:"Klient chce być poprowadzony",source:"Cialdini, Influence",text:`Cialdini (Influence): w sytuacji niepewności ludzie szukają autorytetu który wskaże właściwy kierunek. Klient który stoi przed decyzją o wydaniu 150-200 000 zł jest w naturalnym stanie niepewności.\n\nPewny siebie handlowiec który spokojnie prowadzi przez proces - obniża ten dyskomfort i ułatwia decyzję. Niepewny handlowiec dyskomfort klienta zwiększa.`}
    ]},
    {id:2,title:"Sygnały gotowości zakupu",sections:[
      {id:"2.1",title:"Dlaczego handlowiec je przegapia",source:"Rackham, SPIN Selling",text:`Rackham (SPIN Selling): skuteczni handlowcy wychwytywali sygnały gotowości dwukrotnie częściej niż nieefektywni. Różnica nie leżała w technikach zamykania - leżała w słuchaniu.\n\nHandlowiec który jest skupiony na tym co powie za chwilę - nie słyszy tego co klient mówi teraz. Gdy aktywnie szukasz sygnałów - zaczynasz je słyszeć. Gdy sprzedajesz - je zagłuszasz.`},
      {id:"2.2",title:"Sygnały werbalne - co mówi klient",source:"Hopkins, How to Master the Art of Selling",text:`Hopkins (How to Master the Art of Selling): pytania o szczegóły logistyczne i użytkowanie to najsilniejszy sygnał gotowości. Klient który pyta o datę dostawy - w głowie już kupił.\n\nSygnały które słyszysz:\n"A kiedy byłby dostępny / kiedy można by go odebrać?" - klient planuje już posiadanie auta.\n"Ile wynosi rata miesięczna przy leasingu na 3 lata?" - przelicza czy go stać, nie czy chce.\n"Czy można dorzucić do tego pakiet serwisowy?" - myśli o użytkowaniu.\n"To by chyba pasowało do naszego drugiego auta kolorystycznie." - wizualizuje auto w swoim życiu.\n"Żona by to zaakceptowała." - mentalnie sprzedaje zakup komuś bliskiemu.\n"Ile czasu zajmuje rejestracja?" - pyta o post-zakupową logistykę.`},
      {id:"2.3",title:"Sygnały behawioralne - co robi klient",source:"Hopkins, How to Master the Art of Selling",text:`Hopkins: język ciała i zachowanie mówią więcej niż słowa.\n\nSygnały które widzisz:\n- Wraca do tego samego modelu drugi raz lub zatrzymuje się przy nim dłużej\n- Siada za kierownicą bez zaproszenia lub prosi o możliwość usiadania\n- Dotyka tapicerki, sprawdza bagażnik, mierzy przestrzeń wzrokiem\n- Robi zdjęcia autu telefonem\n- Zaczyna rozmawiać z partnerem półgłosem z dala od handlowca\n- Przestaje zadawać pytania i zapada cisza - przetwarza decyzję`},
      {id:"2.4",title:"Moment który większość handlowców przegapia",source:"Voss, Never Split the Difference",text:`Voss (Never Split the Difference): cisza po fazie pytań to jeden z najmocniejszych sygnałów. Klient który przestał pytać i milczy - nie jest niezainteresowany. Przetwarza. To jest moment na jedno spokojne pytanie zamykające.\n\nBłąd: handlowiec czuje ciszę jako dyskomfort i zaczyna mówić - o wyposażeniu, promocji, serwisie. Klient który był gotowy do decyzji - wraca do analizy.\n\nZasada: gdy klient przestał pytać i milczy - Ty też milczysz. Pierwszy który się odezwie - otwiera kolejną rundę lub zamyka deal.`}
    ]},
    {id:3,title:"Techniki zamykania",sections:[
      {id:"3.1",title:"Próbne zamknięcie - sprawdź zanim zapytasz",source:"Rackham, SPIN Selling",text:`Rackham (SPIN Selling): próbne zamknięcie to pytanie o opinię zamiast o decyzję. Sprawdzasz gotowość bez stawiania klienta pod presją. Jeśli odpowiedź pozytywna - idziesz do właściwego zamknięcia. Jeśli negatywna - wychodzi ukryta obiekcja.\n\nPrzykład: "Jak Pan ocenia to rozwiązanie jak na Pana potrzeby?"\n"Czy to jest kierunek który Pana interesuje?"\n\nNie pytasz jeszcze "czy kupuje Pan" - pytasz czy idziecie w dobrą stronę.`},
      {id:"3.2",title:"Zamknięcie alternatywne",source:"Hopkins, How to Master the Art of Selling",text:`Hopkins (How to Master the Art of Selling): zamiast pytać "czy kupuje Pan" - dajesz klientowi wybór między dwiema opcjami zakupu. Klient skupia się na wyborze, nie na decyzji czy w ogóle kupić.\n\nPrzykład:\n"Czy woli Pan wersję z automatem czy manualną?"\n"Czy rozliczamy to przez leasing operacyjny czy kredyt?"\n"Czy odbiera Pan auto w tym tygodniu czy w przyszłym?"\n\nObie opcje zakładają zakup. Uwaga: technika działa gdy klient jest bliski decyzji. Użyta za wcześnie - brzmi manipulacyjnie.`},
      {id:"3.3",title:"Zamknięcie przez milczenie",source:"Voss, Never Split the Difference",text:`Voss (Never Split the Difference): po pytaniu zamykającym - cisza. Bezwzględna. Kto mówi pierwszy - ten ustępuje.\n\nPrzykład: "Czy możemy to sfinalizować na tych warunkach?" - i milczenie.\n\nCwiczenie praktyczne: policz w głowie do dziesięciu po pytaniu zamykającym. Nie otwieraj ust przed dziesiątką. Brzmi prosto - w praktyce większość handlowców nie wytrzymuje pięciu sekund.`},
      {id:"3.4",title:"Zamknięcie podsumowujące",source:"Rackham, SPIN Selling",text:`Rackham (SPIN Selling): przed finalnym pytaniem o decyzję - podsumowujesz wszystko na co klient się zgodził. Budujesz momentum pozytywnych odpowiedzi.\n\nPrzykład: "Dobrze, podsumujmy: zdecydował się Pan na Custom L2 w kolorze białym, z pakietem serwisowym na 3 lata, dostawa w przyszły piątek, leasing operacyjny na 36 miesięcy. Czy dobrze to rozumiem?"\n\nKlient potwierdza - i w tym momencie: "To możemy to sfinalizować?"`},
      {id:"3.5",title:"Zamknięcie warunkowe",source:"Fisher & Ury, Getting to Yes",text:`Fisher & Ury (Getting to Yes): gdy klient ma jedną konkretną obiekcję która blokuje decyzję - oferujesz rozwiązanie tej obiekcji w zamian za decyzję.\n\nFormuła: "Jeżeli rozwiążemy kwestię [X] - czy jesteśmy w stanie sfinalizować?"\n\nPrzykład: "Jeżeli jestem w stanie zagwarantować dostawę do piątku - czy możemy podpisać zamówienie dziś?"\n\nKluczowe: najpierw pytasz czy to jedyna przeszkoda - zanim cokolwiek obiecasz.`},
      {id:"3.6",title:"Zamknięcie przez niedobór",source:"Cialdini, Influence",text:`Cialdini (Influence) - reguła niedoboru: ograniczona dostępność zwiększa postrzeganą wartość i przyspiesza decyzję.\n\nPrzykład: "Ten egzemplarz w tej specyfikacji mamy jeden w stocku. Nie jestem w stanie zagwarantować że będzie dostępny za tydzień - i nie wiem po jakiej cenie przyjdzie kolejna dostawa."\n\nWarunek bezwzględny: musi być prawda. Klient który wróci i znajdzie 5 takich samych aut w tej samej cenie - nie wróci do Ciebie nigdy więcej.`}
    ]},
    {id:4,title:"Obiekcje przy zamykaniu",sections:[
      {id:"4.1",title:"Skąd się bierze obiekcja na końcu",source:"Kahneman, Thinking Fast and Slow",text:`Kahneman (Thinking Fast and Slow): decyzja o dużym wydatku aktywuje naturalny mechanizm awersji do straty. Im bliżej klient jest do podpisania - tym silniej czuje ryzyko. To nie jest zmiana zdania - to fizjologia decyzji.\n\nObiekcja przy zamykaniu rzadko oznacza że klient nie chce kupić. Oznacza że potrzebuje ostatniego potwierdzenia że robi dobrą decyzję.`},
      {id:"4.2",title:"Jeszcze się zastanowię",source:"Voss, Never Split the Difference",text:`Voss (Never Split the Difference): nie pytaj "co Pana powstrzymuje" - zbyt ogólne. Zamiast tego etykietuj:\n\n"Odnoszę wrażenie że coś jeszcze budzi wątpliwości." - i cisza.\n\nKlient doprecyzuje. Teraz masz realną obiekcję do przepracowania.`},
      {id:"4.3",title:"To dużo pieniędzy",source:"Kahneman, Thinking Fast and Slow",text:`To zdanie może oznaczać dwie zupełnie różne rzeczy:\n\nWariant A - klient nie chce lub nie może wydać tyle jednorazowo.\nRozwiązanie: leasing, kredyt, rata miesięczna.\n\nWariant B - klient ma pieniądze ale nie jest przekonany że auto jest tyle warte.\nRozwiązanie: wracasz do wartości - trwałość, serwis, niższy koszt eksploatacji.\n\nOdpowiedź leasingiem na Wariant B - klient czuje że próbujesz ominąć jego wątpliwość zamiast ją rozwiązać.\n\nDlatego zanim odpiszesz - pytasz: "Czy chodzi o to że to za dużo jak na Pana możliwości w tej chwili - czy o to że nie jest Pan przekonany że ta kwota jest uzasadniona?"\n\nKahneman: właściwe zdiagnozowanie obiekcji jest ważniejsze niż technika jej usunięcia.`},
      {id:"4.4",title:"Muszę to przemyśleć przez noc",source:"Hopkins, How to Master the Art of Selling",text:`Hopkins (How to Master the Art of Selling): noc rzadko zmienia decyzję na tak - częściej ją rozmywa. Klient który wychodzi bez podpisania wraca rzadziej niż handlowcy chcą wierzyć.\n\nWłaściwa reakcja: "Rozumiem. Co konkretnie chciałby Pan przemyśleć - żebym mógł się do tego odnieść zanim Pan wyjdzie?"\n\nJeśli klient podaje konkretny powód - przepracowujesz go teraz. Jeśli nie potrafi - "przemyślenie" jest wymówką, nie realną obiekcją.`},
      {id:"4.5",title:"Jedna obiekcja usunięta - pojawia się kolejna",source:"Rackham, SPIN Selling",text:`Rackham (SPIN Selling): jeśli po usunięciu obiekcji pojawia się natychmiast następna - klient albo nie jest gotowy albo ukrywa prawdziwą blokadę.\n\nZasada: zanim usuniesz obiekcję - zapytaj czy to jedyna.\n\n"Jeżeli rozwiążemy tę kwestię - czy jest coś innego co mogłoby stanąć na drodze do decyzji?"\n\nZbierasz wszystkie obiekcje najpierw - usuwasz je razem, nie jedna po drugiej w nieskończoność.`}
    ]},
    {id:5,title:"Bledy ktore niszcza zamkniecia",sections:[
      {id:"5.1",title:"Sprzedawanie po zamknięciu",source:"Rackham, SPIN Selling",text:`Rackham (SPIN Selling): klient dał sygnał gotowości lub powiedział "dobra, bierzemy" - a handlowiec kontynuuje prezentację produktu. Każde nowe zdanie po sygnale gotowości to nowe ryzyko że klient zacznie ponownie analizować decyzję którą właśnie podjął.\n\nZasada: gdy klient powiedział tak - zamknij usta. Przejdź do formalności. Sprzedaż jest zamknięta - nie otwieraj jej ponownie.`},
      {id:"5.2",title:"Zamykanie za wcześnie",source:"Rackham, SPIN Selling",text:`Rackham (SPIN Selling, badania na 35 000 rozmowach): techniki zamykania użyte przed zakończeniem fazy rozpoznania i budowania wartości - aktywnie szkodzą. Klient czuje presję zanim poczuł że jego potrzeby zostały zrozumiane.\n\nBłąd: klient pyta o cenę, handlowiec podaje i od razu pyta "to co, składamy zamówienie?" Klient który przyszedł po informacje - czuje się atakowany.`},
      {id:"5.3",title:"Zamykanie za późno - przegapienie momentu",source:"Hopkins, How to Master the Art of Selling",text:`Hopkins (How to Master the Art of Selling): każda rozmowa sprzedażowa ma okno gotowości. Klient osiąga szczyt zainteresowania i jeśli handlowiec go nie wykorzysta - entuzjazm opada.\n\nKlient który wychodzi z salonu "żeby jeszcze pomyśleć" wraca rzadziej niż handlowcy chcą wierzyć. Sygnały z Bloku 2 istnieją właśnie po to żeby ten moment rozpoznać.`},
      {id:"5.4",title:"Odpuszczanie przy pierwszym nie",source:"Hopkins, How to Master the Art of Selling",text:`Hopkins (How to Master the Art of Selling): statystycznie większość decyzji zakupowych zapada po trzecim lub czwartym pytaniu zamykającym - nie pierwszym.\n\nPierwsze "nie" to najczęściej odruch, nie decyzja. Różnica między wytrwałością a presją leży w tym jak reagujesz - nie w tym że pytasz ponownie.\n\nZasada: odpuszczasz dopiero gdy klient powiedział "nie" i wyjaśnił dlaczego - a Ty przepracowałeś ten powód i nadal słyszysz "nie".`},
      {id:"5.5",title:"Zamykanie przez presję",source:"Cialdini, Influence",text:`Cialdini (Influence): presja jako technika zamykania działa krótkoterminowo i niszczy relację długoterminowo. Klient który kupił pod presją - żałuje zakupu, nie wraca, nie poleca.\n\nW sprzedaży samochodów użytkowych gdzie klient kupuje regularnie - spalona relacja to spalona flota na kolejne lata.`},
      {id:"5.6",title:"Niezapytanie o decyzję w ogóle",source:"Hopkins, How to Master the Art of Selling",text:`Hopkins: najprostszy i najbardziej kosztowny błąd - handlowiec kończy rozmowę bez pytania o decyzję. Czeka aż klient sam powie "biorę". Większość klientów tego nie zrobi.\n\nKlient wychodzi. Handlowiec myśli "był zainteresowany, pewnie wróci". Klient idzie do kolejnego dealera gdzie ktoś zapytał wprost.\n\nPytanie zamykające jest obowiązkiem, nie ryzykiem. Najgorsze co może się stać - to "nie" które i tak byś dostał.`}
    ]}
  ]
};

/* ═══════════════════════════════ SCORING ═══════════════════════════════ */
const SCORING = {
  negocjacje: {
    keys: ["rozpoznanie","kotwiczenie","ustepstwa","informacja","wynik"],
    labels: ["Rozpoznanie","Kotwiczenie","Ustępstwa","Zarządzanie informacją","Wynik negocjacji"],
    prompt: `KRYTERIA OCENY - NEGOCJACJE (każda kategoria 0-20 punktów):\n\n1. rozpoznanie: Czy handlowiec zbadał potrzeby i BATNA klienta przed podaniem ceny? Czy zadawał pytania kalibrowane? Czy mówił mniej niż pytał? Czy rozmawiał z właściwą osobą decyzyjną?\n\n2. kotwiczenie: Czy handlowiec zakotwiczył cenę pierwszy i wysoko? Czy pozwolił klientowi narzucić punkt startowy? Czy utrzymał kotwicę pod presją czy zbyt szybko z niej zszedł?\n\n3. ustepstwa: Czy ustępstwa były warunkowe (jeżeli...to...)? Czy malejące? Czy cokolwiek dał za darmo bez warunku? Czy miał zaplanowaną sekwencję ustępstw?\n\n4. informacja: Czy handlowiec milczał po podaniu ceny? Czy ujawniał własną presję lub słabą BATNA? Czy mówił więcej niż było potrzebne? Czy dawał klientowi nieużyteczne informacje które osłabiały jego pozycję?\n\n5. wynik: Gdzie wylądowała cena/warunki względem celu handlowca? Czy osiągnął cel symulacji? Czy zamknął lub utrzymał dobrą pozycję negocjacyjną?`
  },
  zamykanie: {
    keys: ["sygnaly","timing","technika","obiekcje","wynik"],
    labels: ["Sygnały gotowości","Timing zamknięcia","Technika","Obsługa obiekcji","Wynik"],
    prompt: `KRYTERIA OCENY - ZAMYKANIE (każda kategoria 0-20 punktów):\n\n1. sygnaly: Czy handlowiec rozpoznał sygnały gotowości zakupu klienta? Czy zareagował na nie we właściwym momencie? Czy nie przegapił okna gotowości gdy klient dawał sygnały?\n\n2. timing: Czy próba zamknięcia nastąpiła we właściwym momencie - nie za wcześnie (przed rozpoznaniem) ani za późno (po wyraźnych sygnałach)? Oceń kiedy nastąpiła pierwsza próba zamknięcia.\n\n3. technika: Czy handlowiec użył konkretnej techniki zamknięcia? Która to była (alternatywne, milczenie, podsumowujące, warunkowe, niedobór)? Czy była odpowiednia do tej persony i sytuacji?\n\n4. obiekcje: Czy handlowiec przepracował ostatnie obiekcje bez presji i bez odpuszczania? Czy zapytał czy to jedyna obiekcja zanim zaproponował rozwiązanie? Czy nie sprzedawał po zamknięciu?\n\n5. wynik: Czy udało się zamknąć symulację z decyzją klienta lub wyraźnym przesunięciem ku decyzji? Czy nie odpuścił przy pierwszym "nie"?`
  }
};

/* ═══════════════════════════════ API ═══════════════════════════════ */
const callAPI = async (messages, system, maxTokens = 800) => {
  const r = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, system, maxTokens }),
  });
  const d = await r.json();
  return d.content?.[0]?.text || "";
};

const getClientSystemPrompt = (persona, scenario) => `Jesteś klientem w salonie Ford. Wcielaj się w rolę i graj ją konsekwentnie przez całą rozmowę.

KIM JESTEŚ:
${persona.prompt}

SCENARIUSZ:
Model: ${scenario.model}
Cena/sytuacja: ${scenario.price}
Twoja pozycja: ${scenario.demand}
Kontekst: ${scenario.context || ""}

ZASADY:
- Odpowiadaj krótko (2-4 zdania) jak prawdziwy klient - nie jak asystent AI
- Nie ułatwiaj handlowcowi - zachowuj się realistycznie
- Jeśli handlowiec da Ci coś za darmo bez warunku - bierz i proś o więcej
- Jeśli handlowiec zadaje dobre pytania i słucha - możesz stopniowo być bardziej otwarty
- NIE wychodź z roli, NIE pomagaj handlowcowi, NIE komentuj jego technik
- Odpowiadaj po polsku, naturalnym językiem klienta
- Możesz być gotowy do decyzji po 10-15 wymianach jeśli handlowiec dobrze przeprowadził rozmowę`;

const getJudgePrompt = (module, persona, scenario) => {
  const keys = SCORING[module].keys;
  const keysJson = keys.map(k => `"${k}":{"score":0,"comment":""}`).join(",");
  return `Jesteś zimnym analitykiem sprzedaży. Oceń poniższy transcript rozmowy handlowca z klientem.

MODUŁ: ${module === "negocjacje" ? "Negocjacje" : "Zamykanie sprzedaży"}
PERSONA KLIENTA: ${persona.name} (${persona.tag})
SCENARIUSZ: ${scenario.model}
CEL HANDLOWCA: ${scenario.goal}

${SCORING[module].prompt}

Odpowiedz WYŁĄCZNIE w formacie JSON (bez markdown, bez backtick, bez komentarzy - tylko czysty JSON):
{"scores":{${keysJson}},"totalScore":0,"summary":"2-3 zdania podsumowania","bestMoment":"co handlowiec zrobił najlepiej","worstMoment":"największy błąd lub stracona okazja"}`;
};

/* ═══════════════════════════════ HELPERS ═══════════════════════════════ */
const pickPersona = async (userName, personas) => {
  const hist = db.getUserHistory(userName);
  const eligible = personas.filter(p => !hist.includes(p.id));
  const pool = eligible.length > 0 ? eligible : personas;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  const newHist = [...hist.slice(-1), picked.id];
  db.setUserHistory(userName, newHist);
  return picked;
};

const scoreColor = (s) => s >= 16 ? "#3DB87A" : s >= 10 ? "#C8973A" : "#E05555";
const totalColor = (s) => s >= 80 ? "#3DB87A" : s >= 55 ? "#C8973A" : "#E05555";

/* ═══════════════════════════════ COMPONENTS ═══════════════════════════════ */

function Btn({ children, onClick, variant = "primary", size = "md", disabled, style = {} }) {
  const cls = `btn btn-${variant} ${size === "sm" ? "btn-sm" : ""}`;
  return <button className={cls} onClick={onClick} disabled={disabled} style={style}>{children}</button>;
}

function ScoreCard({ label, score, comment }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#A0A8C0" }}>{label}</span>
        <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Sora',sans-serif", color: scoreColor(score) }}>
          {score}<span style={{ fontSize: 12, color: "#7A82A0" }}>/20</span>
        </span>
      </div>
      <div className="score-bar-bg">
        <div className="score-bar-fill" style={{ width: `${(score / 20) * 100}%`, background: scoreColor(score) }} />
      </div>
      <p style={{ fontSize: 12, color: "#8A92AA", marginTop: 6, lineHeight: 1.5 }}>{comment}</p>
    </div>
  );
}

function Spinner({ size = 18 }) {
  return <div className="spinner" style={{ width: size, height: size }} />;
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "12px 14px", background: "#1A2030", border: "1px solid #1E2438", borderRadius: 10, width: "fit-content" }}>
      <div className="dot" /><div className="dot" /><div className="dot" />
    </div>
  );
}

/* ═══════════════════════════════ SCREENS ═══════════════════════════════ */

function LoginScreen({ onLogin }) {
  const [name, setName] = useState("");
  return (
    <div className="screen fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", gap: 32 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#C8973A", textTransform: "uppercase", marginBottom: 12 }}>Ford Budmat - Plock</div>
        <h1 className="display" style={{ fontSize: 36, lineHeight: 1.1, marginBottom: 8 }}>Trener Sprzedazy</h1>
        <p style={{ color: "#7A82A0", fontSize: 15 }}>Negocjacje i zamykanie sprzedazy z AI</p>
      </div>
      <div style={{ width: "100%", maxWidth: 340 }}>
        <label className="label" style={{ display: "block", marginBottom: 8 }}>Twoje imie</label>
        <input
          className="input"
          placeholder="np. Andrzej"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && name.trim() && onLogin(name.trim())}
          autoFocus
        />
        <Btn onClick={() => name.trim() && onLogin(name.trim())} disabled={!name.trim()} style={{ width: "100%", marginTop: 12, height: 48 }}>
          Zaloguj sie
        </Btn>
      </div>
    </div>
  );
}

function HomeScreen({ userName, onModule, onManager }) {
  return (
    <div className="screen fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <div className="label" style={{ marginBottom: 4 }}>Zalogowany jako</div>
          <h2 className="display" style={{ fontSize: 24 }}>{userName}</h2>
        </div>
        <button onClick={onManager} style={{ background: "transparent", border: "1px solid #1E2438", borderRadius: 8, padding: "8px 14px", color: "#7A82A0", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
          Manager
        </button>
      </div>
      <div className="label" style={{ marginBottom: 12 }}>Wybierz modul</div>
      <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
        <div className="module-card module-neg" onClick={() => onModule("negocjacje")}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#4A7BE5", textTransform: "uppercase", marginBottom: 6 }}>Modul 1</div>
              <h3 className="display" style={{ fontSize: 22, marginBottom: 6 }}>Negocjacje</h3>
              <p style={{ color: "#7A82A0", fontSize: 13, lineHeight: 1.5 }}>BATNA, ZOPA, techniki, ataki cenowe i riposty</p>
            </div>
            <span style={{ fontSize: 28 }}>⚡</span>
          </div>
          <hr className="divider" style={{ margin: "16px 0" }} />
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={e => { e.stopPropagation(); onModule("negocjacje", "teoria"); }} variant="ghost" size="sm">Teoria</Btn>
            <Btn onClick={e => { e.stopPropagation(); onModule("negocjacje", "symulacja"); }} size="sm">Symulacja</Btn>
          </div>
        </div>
        <div className="module-card module-clos" onClick={() => onModule("zamykanie")}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#C8973A", textTransform: "uppercase", marginBottom: 6 }}>Modul 2</div>
              <h3 className="display" style={{ fontSize: 22, marginBottom: 6 }}>Zamykanie sprzedazy</h3>
              <p style={{ color: "#7A82A0", fontSize: 13, lineHeight: 1.5 }}>Sygnaly gotowosci, techniki zamykania, obiekcje przy finalizacji</p>
            </div>
            <span style={{ fontSize: 28 }}>🎯</span>
          </div>
          <hr className="divider" style={{ margin: "16px 0" }} />
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={e => { e.stopPropagation(); onModule("zamykanie", "teoria"); }} variant="ghost" size="sm">Teoria</Btn>
            <Btn onClick={e => { e.stopPropagation(); onModule("zamykanie", "symulacja"); }} size="sm">Symulacja</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function TheoryScreen({ module, onBack }) {
  const blocks = THEORY[module];
  const [blockIdx, setBlockIdx] = useState(0);
  const [sectionIdx, setSectionIdx] = useState(0);
  const block = blocks[blockIdx];
  const section = block.sections[sectionIdx];
  const color = module === "negocjacje" ? "#4A7BE5" : "#C8973A";

  const goNext = () => {
    if (sectionIdx < block.sections.length - 1) setSectionIdx(sectionIdx + 1);
    else if (blockIdx < blocks.length - 1) { setBlockIdx(blockIdx + 1); setSectionIdx(0); }
  };
  const goPrev = () => {
    if (sectionIdx > 0) setSectionIdx(sectionIdx - 1);
    else if (blockIdx > 0) { const nb = blockIdx - 1; setBlockIdx(nb); setSectionIdx(blocks[nb].sections.length - 1); }
  };
  const isFirst = blockIdx === 0 && sectionIdx === 0;
  const isLast = blockIdx === blocks.length - 1 && sectionIdx === block.sections.length - 1;

  return (
    <div className="screen fade-in">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", color: "#7A82A0", cursor: "pointer", fontSize: 18, padding: "4px 8px" }}>←</button>
        <div>
          <div className="label" style={{ color }}>{module === "negocjacje" ? "NEGOCJACJE" : "ZAMYKANIE"}</div>
          <h2 className="display" style={{ fontSize: 18 }}>{block.title}</h2>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {blocks.map((b, i) => (
          <button key={i} onClick={() => { setBlockIdx(i); setSectionIdx(0); }}
            style={{ padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `1px solid ${i === blockIdx ? color : "#1E2438"}`, background: i === blockIdx ? "#141824" : "transparent", color: i === blockIdx ? color : "#7A82A0", fontFamily: "inherit" }}>
            {i + 1}. {b.title.split(" ").slice(0, 3).join(" ")}
          </button>
        ))}
      </div>
      <div className="card fade-in" key={`${blockIdx}-${sectionIdx}`} style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div className="label" style={{ marginBottom: 4 }}>{section.id}</div>
            <h3 className="display" style={{ fontSize: 18, lineHeight: 1.2 }}>{section.title}</h3>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
            <div style={{ fontSize: 10, color: "#7A82A0", marginBottom: 2 }}>Zrodlo</div>
            <div style={{ fontSize: 11, color, fontWeight: 600, maxWidth: 160, textAlign: "right", lineHeight: 1.3 }}>{section.source}</div>
          </div>
        </div>
        <hr className="divider" style={{ margin: "0 0 16px" }} />
        <div style={{ fontSize: 14, lineHeight: 1.75, color: "#C8CCDC", whiteSpace: "pre-line" }}>{section.text}</div>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {block.sections.map((_, i) => (
          <div key={i} onClick={() => setSectionIdx(i)}
            style={{ height: 3, flex: 1, borderRadius: 2, cursor: "pointer", background: i <= sectionIdx ? color : "#1E2438", transition: "background .2s" }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <Btn onClick={goPrev} variant="ghost" disabled={isFirst}>Poprzedni</Btn>
        {isLast ? <Btn onClick={onBack}>Koniec teorii</Btn> : <Btn onClick={goNext}>Nastepny</Btn>}
      </div>
    </div>
  );
}

function SimModuleSelect({ onSelect, onBack }) {
  return (
    <div className="screen fade-in">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", color: "#7A82A0", cursor: "pointer", fontSize: 18, padding: "4px 8px" }}>←</button>
        <h2 className="display" style={{ fontSize: 22 }}>Wybierz modul symulacji</h2>
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        {["negocjacje", "zamykanie"].map(m => (
          <div key={m} className="card card-hover" onClick={() => onSelect(m)} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 32 }}>{m === "negocjacje" ? "⚡" : "🎯"}</span>
            <div>
              <h3 className="display" style={{ fontSize: 18, marginBottom: 4 }}>{m === "negocjacje" ? "Negocjacje" : "Zamykanie sprzedazy"}</h3>
              <p style={{ color: "#7A82A0", fontSize: 13 }}>{m === "negocjacje" ? "Cwicz negocjowanie ceny i warunkow" : "Cwicz zamykanie i pokonywanie ostatnich obiekcji"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimulationScreen({ userName, module, persona, scenario, onEnd }) {
  const [messages, setMessages] = useState([]);
  const [apiHistory, setApiHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const chatRef = useRef(null);
  const sysPrompt = getClientSystemPrompt(persona, scenario);
  const color = module === "negocjacje" ? "#4A7BE5" : "#C8973A";
  const msgCount = messages.filter(m => m.role === "user").length;
  const canEnd = msgCount >= 5;

  useEffect(() => {
    if (!started) {
      setStarted(true);
      setLoading(true);
      callAPI([{ role: "user", content: "[Scenariusz start - powiedz jedno zdanie otwierające jako klient wchodzący do salonu lub dzwoniący.]" }], sysPrompt)
        .then(resp => {
          setMessages([{ role: "client", content: resp }]);
          setApiHistory([{ role: "user", content: "[START]" }, { role: "assistant", content: resp }]);
          setLoading(false);
        }).catch(() => setLoading(false));
    }
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");
    const updatedMessages = [...messages, { role: "user", content: userText }];
    const updatedApi = [...apiHistory, { role: "user", content: userText }];
    setMessages(updatedMessages);
    setApiHistory(updatedApi);
    setLoading(true);
    try {
      const resp = await callAPI(updatedApi, sysPrompt);
      setMessages([...updatedMessages, { role: "client", content: resp }]);
      setApiHistory([...updatedApi, { role: "assistant", content: resp }]);
    } catch {
      setMessages([...updatedMessages, { role: "client", content: "[Blad polaczenia - sprobuj ponownie]" }]);
    }
    setLoading(false);
  };

  const handleEnd = () => {
    const transcript = messages.map(m =>
      (m.role === "user" ? userName + " (handlowiec)" : persona.name + " (klient)") + ": " + m.content
    ).join("\n\n");
    onEnd(transcript, messages);
  };

  return (
    <div className="screen fade-in" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 32px)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#1A2030", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
            {module === "negocjacje" ? "⚡" : "🎯"}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E5F0" }}>{persona.name}</div>
            <div style={{ fontSize: 11, color: "#7A82A0" }}>{scenario.model}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#7A82A0" }}>{msgCount}/15</span>
          {canEnd && (
            <Btn onClick={handleEnd} size="sm" style={{ background: "#1E2438", color: "#E2E5F0", border: "1px solid #2A3050" }}>
              Zakoncz
            </Btn>
          )}
        </div>
      </div>

      <div className="card" style={{ fontSize: 12, color: "#7A82A0", padding: "10px 14px", marginBottom: 12, lineHeight: 1.5, flexShrink: 0 }}>
        <span style={{ color, fontWeight: 700 }}>Twoj cel: </span>{scenario.goal}
      </div>

      <div ref={chatRef} style={{ flex: 1, overflowY: "auto", paddingRight: 4 }}>
        <div className="chat-wrap">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role === "client" ? "msg-client" : "msg-user"}`}>
              <div className={`msg-avatar ${m.role === "client" ? "avatar-client" : "avatar-user"}`}>
                {m.role === "client" ? persona.name[0] : userName[0]}
              </div>
              <div className="msg-bubble">{m.content}</div>
            </div>
          ))}
          {loading && (
            <div className="msg msg-client">
              <div className="msg-avatar avatar-client">{persona.name[0]}</div>
              <TypingDots />
            </div>
          )}
        </div>
      </div>

      <div style={{ paddingTop: 12, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <textarea
            className="input textarea"
            style={{ flex: 1, minHeight: 52, maxHeight: 120 }}
            placeholder="Twoja odpowiedz..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          />
          <Btn onClick={send} disabled={!input.trim() || loading} style={{ alignSelf: "flex-end", minWidth: 52, height: 52 }}>
            {loading ? <Spinner size={16} /> : "→"}
          </Btn>
        </div>
        {msgCount >= 15 && (
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <Btn onClick={handleEnd} style={{ width: "100%" }}>Zakoncz i ocen rozmowe</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

function FeedbackScreen({ module, persona, scenario, transcript, messages, userName, onHome, onNewSim }) {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);
  const color = module === "negocjacje" ? "#4A7BE5" : "#C8973A";
  const scoring = SCORING[module];

  useEffect(() => {
    const judgePrompt = getJudgePrompt(module, persona, scenario);
    const transcriptMsg = [{ role: "user", content: `TRANSCRIPT ROZMOWY:\n\n${transcript}\n\nOcen rozmowe wedlug podanych kryteriow.` }];
    callAPI(transcriptMsg, judgePrompt, 1200)
      .then(resp => {
        try {
          const clean = resp.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(clean);
          setFeedback(parsed);
          const log = {
            user_name: userName,
            module: module === "negocjacje" ? "Negocjacje" : "Zamykanie",
            persona_name: persona.name,
            scenario: scenario.model,
            total_score: parsed.totalScore,
            summary: parsed.summary,
            best_moment: parsed.bestMoment,
            worst_moment: parsed.worstMoment,
            scores: parsed.scores,
            transcript,
          };
          db.saveLog(log);
        } catch {
          setFeedback({ error: true, raw: resp });
        }
        setLoading(false);
      }).catch(() => { setFeedback({ error: true }); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="screen" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16 }}>
      <Spinner size={32} />
      <p style={{ color: "#7A82A0" }}>Analizuje rozmowe...</p>
    </div>
  );

  if (feedback?.error) return (
    <div className="screen">
      <div className="card">
        <p style={{ color: "#E05555", marginBottom: 12 }}>Blad analizy. Sprobuj ponownie.</p>
        {feedback.raw && <pre style={{ fontSize: 11, color: "#7A82A0", overflow: "auto" }}>{feedback.raw.slice(0, 500)}</pre>}
        <Btn onClick={onHome} style={{ marginTop: 12 }}>Wroc do menu</Btn>
      </div>
    </div>
  );

  const total = feedback.totalScore || 0;

  return (
    <div className="screen fade-in">
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div className="label" style={{ marginBottom: 8, color }}>Ocena symulacji</div>
        <div className="display" style={{ fontSize: 64, color: totalColor(total), lineHeight: 1 }}>{total}</div>
        <div style={{ fontSize: 15, color: "#7A82A0", marginTop: 4 }}>punktow na 100</div>
        <div style={{ fontSize: 13, color: "#7A82A0", marginTop: 4 }}>{persona.name} · {scenario.model}</div>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <div className="label" style={{ marginBottom: 12 }}>Ocena szczegolowa</div>
        {scoring.keys.map((k, i) => (
          <ScoreCard key={k} label={scoring.labels[i]} score={feedback.scores?.[k]?.score || 0} comment={feedback.scores?.[k]?.comment || ""} />
        ))}
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <div className="label" style={{ marginBottom: 10 }}>Analiza</div>
        <p style={{ fontSize: 14, color: "#C0C5D8", lineHeight: 1.6, marginBottom: 14 }}>{feedback.summary}</p>
        {feedback.bestMoment && (
          <div style={{ background: "#0F2015", border: "1px solid #1A3A22", borderRadius: 8, padding: "10px 14px", marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#3DB87A", marginBottom: 4 }}>NAJLEPSZY MOMENT</div>
            <p style={{ fontSize: 13, color: "#A8D4B8", lineHeight: 1.5 }}>{feedback.bestMoment}</p>
          </div>
        )}
        {feedback.worstMoment && (
          <div style={{ background: "#200F0F", border: "1px solid #3A1A1A", borderRadius: 8, padding: "10px 14px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#E05555", marginBottom: 4 }}>NAJWIEKSZY BLAD</div>
            <p style={{ fontSize: 13, color: "#D4A8A8", lineHeight: 1.5 }}>{feedback.worstMoment}</p>
          </div>
        )}
      </div>

      <button onClick={() => setShowTranscript(!showTranscript)}
        style={{ width: "100%", background: "transparent", border: "1px solid #1E2438", borderRadius: 8, padding: "10px", color: "#7A82A0", fontSize: 13, cursor: "pointer", fontFamily: "inherit", marginBottom: 12 }}>
        {showTranscript ? "Ukryj" : "Pokaz"} transcript rozmowy
      </button>

      {showTranscript && (
        <div className="card" style={{ marginBottom: 12, maxHeight: 300, overflowY: "auto" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < messages.length - 1 ? "1px solid #1E2438" : "none" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: m.role === "user" ? "#C8973A" : "#4A7BE5", marginBottom: 4 }}>
                {m.role === "user" ? userName + " (handlowiec)" : persona.name + " (klient)"}
              </div>
              <p style={{ fontSize: 13, color: "#A8AECA", lineHeight: 1.5 }}>{m.content}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <Btn onClick={onNewSim} variant="ghost">Nowa symulacja</Btn>
        <Btn onClick={onHome}>Menu glowne</Btn>
      </div>
    </div>
  );
}

function ManagerScreen({ onBack }) {
  const [tab, setTab] = useState("logs");
  const [logs, setLogs] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [expandedLog, setExpandedLog] = useState(null);
  const [addMode, setAddMode] = useState(null);
  const [newPersona, setNewPersona] = useState({ name: "", type: "B2B", difficulty: 3, tag: "", prompt: "", negModel: "", negPrice: "", negDemand: "", negGoal: "", closModel: "", closDemand: "", closGoal: "" });
  const [aiDesc, setAiDesc] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    db.getLogs().then(l => setLogs(l || []));
    db.getPersonas().then(p => setPersonas(p && p.length > 0 ? p : PERSONAS_DEFAULT));
  }, []);

  const savePersona = async (p) => {
    setSaving(true);
    const id = "custom_" + Date.now();
    await db.savePersona({ ...p, id });
    setPersonas([...personas, { ...p, id }]);
    setAddMode(null);
    setSaving(false);
  };

  const deletePersona = async (id) => {
    await db.deletePersona(id);
    setPersonas(personas.filter(p => p.id !== id));
  };

  const generatePersonaWithAI = async () => {
    if (!aiDesc.trim()) return;
    setGenerating(true);
    const prompt = `Jestes ekspertem od szkolen sprzedazowych dla dealera Ford. Na podstawie opisu stworz persone klienta do symulacji sprzedazowej.\n\nOPIS: ${aiDesc}\n\nOdpowiedz WYLACZNIE w formacie JSON (bez markdown, bez backtick):\n{"name":"Imie/nazwa persony","type":"B2B lub B2C","difficulty":1,"tag":"krotki etykieta 2 slowa","prompt":"opis dla AI ktory bedzie gral te role - 3-5 zdan","negModel":"model auta","negPrice":"cena wyjsciowa","negDemand":"czego zada lub jaka ma pozycje","negGoal":"cel handlowca w negocjacjach","closModel":"model auta","closDemand":"sytuacja przy zamykaniu","closGoal":"cel handlowca przy zamykaniu"}`;
    try {
      const resp = await callAPI([{ role: "user", content: "Stworz persone wg opisu." }], prompt, 1000);
      const clean = resp.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setNewPersona({
        name: parsed.name || "", type: parsed.type || "B2B", difficulty: parsed.difficulty || 3, tag: parsed.tag || "",
        prompt: parsed.prompt || "", negModel: parsed.negModel || "", negPrice: parsed.negPrice || "",
        negDemand: parsed.negDemand || "", negGoal: parsed.negGoal || "",
        closModel: parsed.closModel || "", closDemand: parsed.closDemand || "", closGoal: parsed.closGoal || ""
      });
      setAddMode("manual");
    } catch { alert("Blad generowania. Sprobuj ponownie."); }
    setGenerating(false);
  };

  return (
    <div className="screen fade-in">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", color: "#7A82A0", cursor: "pointer", fontSize: 18, padding: "4px 8px" }}>←</button>
        <h2 className="display" style={{ fontSize: 22 }}>Widok Managera</h2>
      </div>

      <div className="tabs" style={{ marginBottom: 16 }}>
        <button className={`tab ${tab === "logs" ? "active" : ""}`} onClick={() => setTab("logs")}>Logi rozmon ({logs.length})</button>
        <button className={`tab ${tab === "personas" ? "active" : ""}`} onClick={() => setTab("personas")}>Persony ({personas.length})</button>
      </div>

      {tab === "logs" && (
        <div>
          {logs.length === 0
            ? <p style={{ color: "#7A82A0", textAlign: "center", padding: 32 }}>Brak zapisanych rozmow</p>
            : logs.map((log, i) => (
              <div key={log.id || i} className="card-sm" style={{ marginBottom: 8, cursor: "pointer" }} onClick={() => setExpandedLog(expandedLog === i ? null : i)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "#0B0E19", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontFamily: "'Sora',sans-serif", fontWeight: 700, color: totalColor(log.total_score) }}>
                      {log.total_score}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{log.user_name} <span style={{ color: "#7A82A0", fontWeight: 400 }}>vs</span> {log.persona_name}</div>
                      <div style={{ fontSize: 12, color: "#7A82A0" }}>{log.module} · {log.scenario} · {new Date(log.created_at).toLocaleDateString("pl-PL")}</div>
                    </div>
                  </div>
                  <span style={{ color: "#7A82A0" }}>{expandedLog === i ? "▲" : "▼"}</span>
                </div>
                {expandedLog === i && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #1E2438" }}>
                    <p style={{ fontSize: 13, color: "#A8AECA", marginBottom: 10, lineHeight: 1.5 }}>{log.summary}</p>
                    {log.best_moment && <div style={{ background: "#0F2015", borderRadius: 6, padding: "8px 12px", marginBottom: 6 }}><span style={{ fontSize: 11, fontWeight: 700, color: "#3DB87A" }}>PLUS: </span><span style={{ fontSize: 12, color: "#A8D4B8" }}>{log.best_moment}</span></div>}
                    {log.worst_moment && <div style={{ background: "#200F0F", borderRadius: 6, padding: "8px 12px", marginBottom: 10 }}><span style={{ fontSize: 11, fontWeight: 700, color: "#E05555" }}>MINUS: </span><span style={{ fontSize: 12, color: "#D4A8A8" }}>{log.worst_moment}</span></div>}
                    {log.scores && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
                        {Object.entries(log.scores).map(([k, v]) => (
                          <div key={k} style={{ background: "#0B0E19", borderRadius: 6, padding: "6px 10px" }}>
                            <div style={{ fontSize: 10, color: "#7A82A0", marginBottom: 2 }}>{k}</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: scoreColor(v.score) }}>{v.score}<span style={{ fontSize: 10 }}>/20</span></div>
                          </div>
                        ))}
                      </div>
                    )}
                    {log.transcript && (
                      <details style={{ marginTop: 10 }}>
                        <summary style={{ fontSize: 12, color: "#7A82A0", cursor: "pointer" }}>Pelny transcript</summary>
                        <pre style={{ fontSize: 11, color: "#7A82A0", marginTop: 8, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{log.transcript}</pre>
                      </details>
                    )}
                  </div>
                )}
              </div>
            ))
          }
        </div>
      )}

      {tab === "personas" && (
        <div>
          {!addMode && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                <Btn onClick={() => { setAddMode("ai"); setNewPersona({ name: "", type: "B2B", difficulty: 3, tag: "", prompt: "", negModel: "", negPrice: "", negDemand: "", negGoal: "", closModel: "", closDemand: "", closGoal: "" }); }} variant="ghost">
                  Generuj z AI
                </Btn>
                <Btn onClick={() => { setAddMode("manual"); setNewPersona({ name: "", type: "B2B", difficulty: 3, tag: "", prompt: "", negModel: "", negPrice: "", negDemand: "", negGoal: "", closModel: "", closDemand: "", closGoal: "" }); }} variant="ghost">
                  Dodaj recznie
                </Btn>
              </div>
              {personas.map(p => (
                <div key={p.id} className="card-sm" style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</span>
                        <span className={`tag tag-${p.type.toLowerCase()}`}>{p.type}</span>
                        {p.id?.startsWith("custom_") && <span style={{ fontSize: 10, color: "#C8973A", fontWeight: 700 }}>WLASNA</span>}
                      </div>
                      <div style={{ fontSize: 12, color: "#7A82A0" }}>{p.tag} · {"★".repeat(p.difficulty)}{"☆".repeat(5 - p.difficulty)}</div>
                    </div>
                    {p.id?.startsWith("custom_") && (
                      <button onClick={() => deletePersona(p.id)} style={{ background: "transparent", border: "none", color: "#E05555", cursor: "pointer", fontSize: 16, padding: "2px 6px" }}>x</button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {addMode === "ai" && (
            <div className="card fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 className="display" style={{ fontSize: 18 }}>Generuj persone z AI</h3>
                <button onClick={() => setAddMode(null)} style={{ background: "transparent", border: "none", color: "#7A82A0", cursor: "pointer", fontSize: 18 }}>x</button>
              </div>
              <label className="label" style={{ display: "block", marginBottom: 6 }}>Opisz klienta jednym zdaniem</label>
              <textarea className="input textarea" placeholder='np. klient z branzy medycznej, kupuje pierwsze auto elektryczne, sceptyczny wobec BEV'
                value={aiDesc} onChange={e => setAiDesc(e.target.value)} style={{ marginBottom: 12 }} />
              <Btn onClick={generatePersonaWithAI} disabled={!aiDesc.trim() || generating} style={{ width: "100%" }}>
                {generating ? <><Spinner size={16} /> Generuje...</> : "Generuj persone"}
              </Btn>
            </div>
          )}

          {addMode === "manual" && (
            <div className="card fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 className="display" style={{ fontSize: 18 }}>Nowa persona</h3>
                <button onClick={() => setAddMode(null)} style={{ background: "transparent", border: "none", color: "#7A82A0", cursor: "pointer", fontSize: 18 }}>x</button>
              </div>
              {[
                ["Imie / nazwa", "name", "text"], ["Tag (2 slowa)", "tag", "text"],
                ["Opis dla AI (zachowanie, styl, BATNA)", "prompt", "textarea"],
                ["NEGOCJACJE", "_neg", "separator"],
                ["Model auta", "negModel", "text"], ["Cena wyjsciowa", "negPrice", "text"],
                ["Pozycja/zadanie klienta", "negDemand", "text"], ["Cel handlowca", "negGoal", "text"],
                ["ZAMYKANIE", "_clos", "separator"],
                ["Model auta", "closModel", "text"],
                ["Sytuacja przy zamykaniu", "closDemand", "textarea"], ["Cel handlowca", "closGoal", "text"],
              ].map(([label, field, type]) => type === "separator"
                ? <div key={field} className="label" style={{ margin: "12px 0 8px", color: "#C8973A" }}>{label}</div>
                : (
                  <div key={field} style={{ marginBottom: 10 }}>
                    <label className="label" style={{ display: "block", marginBottom: 4 }}>{label}</label>
                    {type === "textarea"
                      ? <textarea className="input textarea" value={newPersona[field]} onChange={e => setNewPersona({ ...newPersona, [field]: e.target.value })} style={{ minHeight: 60 }} />
                      : <input className="input" value={newPersona[field]} onChange={e => setNewPersona({ ...newPersona, [field]: e.target.value })} />
                    }
                  </div>
                )
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <select className="input" value={newPersona.type} onChange={e => setNewPersona({ ...newPersona, type: e.target.value })} style={{ flex: 1 }}>
                  <option value="B2B">B2B</option><option value="B2C">B2C</option>
                </select>
                <select className="input" value={newPersona.difficulty} onChange={e => setNewPersona({ ...newPersona, difficulty: Number(e.target.value) })} style={{ flex: 1 }}>
                  {[1, 2, 3, 4, 5].map(d => <option key={d} value={d}>{"★".repeat(d)} ({d}/5)</option>)}
                </select>
              </div>
              <Btn onClick={() => savePersona({
                name: newPersona.name, type: newPersona.type, difficulty: newPersona.difficulty, tag: newPersona.tag,
                prompt: newPersona.prompt,
                neg: { model: newPersona.negModel, price: newPersona.negPrice, demand: newPersona.negDemand, goal: newPersona.negGoal, context: "" },
                clos: { model: newPersona.closModel, price: "Ustalona", demand: newPersona.closDemand, goal: newPersona.closGoal }
              })} disabled={!newPersona.name || saving} style={{ width: "100%", marginTop: 12 }}>
                {saving ? <><Spinner size={16} /> Zapisuje...</> : "Zapisz persone"}
              </Btn>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════ MAIN APP ═══════════════════════════════ */
export default function App() {
  const [screen, setScreen] = useState("login");
  const [userName, setUserName] = useState("");
  const [module, setModule] = useState(null);
  const [persona, setPersona] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [simMessages, setSimMessages] = useState([]);
  const [personas, setPersonas] = useState(PERSONAS_DEFAULT);

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => s.remove();
  }, []);

  useEffect(() => {
    db.getPersonas().then(p => { if (p && p.length > 0) setPersonas(p); });
  }, []);

  const startSim = async (mod) => {
    const allPersonas = await db.getPersonas().then(p => p && p.length > 0 ? p : personas);
    const picked = await pickPersona(userName, allPersonas);
    const sc = mod === "negocjacje" ? picked.neg : picked.clos;
    setModule(mod);
    setPersona(picked);
    setScenario(sc);
    setScreen("simulation");
  };

  const handleModuleSelect = (mod, mode) => {
    setModule(mod);
    if (mode === "teoria") setScreen("theory");
    else startSim(mod);
  };

  const handleSimEnd = (tr, msgs) => {
    setTranscript(tr);
    setSimMessages(msgs);
    setScreen("feedback");
  };

  return (
    <div className="app">
      {screen === "login" && <LoginScreen onLogin={name => { setUserName(name); setScreen("home"); }} />}
      {screen === "home" && <HomeScreen userName={userName} onModule={handleModuleSelect} onManager={() => setScreen("manager")} />}
      {screen === "theory" && <TheoryScreen module={module} onBack={() => setScreen("home")} />}
      {screen === "simmodule" && <SimModuleSelect onSelect={mod => startSim(mod)} onBack={() => setScreen("home")} />}
      {screen === "simulation" && persona && scenario && (
        <SimulationScreen userName={userName} module={module} persona={persona} scenario={scenario} onEnd={handleSimEnd} />
      )}
      {screen === "feedback" && persona && scenario && (
        <FeedbackScreen module={module} persona={persona} scenario={scenario} transcript={transcript} messages={simMessages} userName={userName} onHome={() => setScreen("home")} onNewSim={() => startSim(module)} />
      )}
      {screen === "manager" && (
        <ManagerScreen onBack={() => { db.getPersonas().then(p => { if (p && p.length > 0) setPersonas(p); }); setScreen("home"); }} />
      )}
    </div>
  );
}
