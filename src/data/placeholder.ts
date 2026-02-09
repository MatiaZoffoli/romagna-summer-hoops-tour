// ============================================
// PLACEHOLDER DATA - Replace with Supabase later
// ============================================

export interface Tappa {
  id: string;
  nome: string;
  nomeCompleto: string;
  data: string;
  orario: string;
  luogo: string;
  indirizzo: string;
  provincia: string;
  organizzatore: string;
  contattoOrganizzatore: string;
  instagram: string;
  descrizione: string;
  stato: "prossima" | "completata" | "in-arrivo";
  risultati?: Risultato[];
  foto?: string[];
}

export interface Risultato {
  posizione: number;
  squadra: string;
  puntiTour: number;
}

export interface Squadra {
  id: string;
  nome: string;
  motto?: string;
  instagram?: string;
  giocatori: Giocatore[];
  puntiTotali: number;
  tappeGiocate: number;
  risultatiPerTappa: { tappaId: string; posizione: number; punti: number }[];
}

export interface Giocatore {
  nome: string;
  cognome: string;
  ruolo?: string;
  instagram?: string;
}

export interface NewsItem {
  id: string;
  titolo: string;
  contenuto: string;
  data: string;
  anteprima: string;
}

// ------ TAPPE CONFERMATE ------
export const tappe: Tappa[] = [
  {
    id: "kotg-cesenatico",
    nome: "KOTG",
    nomeCompleto: "Kings of the Ghetto - Tappa ufficiale del Romagna Summer Hoops Tour",
    data: "Sabato 11 Luglio 2026",
    orario: "16:00",
    luogo: "Cesenatico",
    indirizzo: "Cesenatico (FC)",
    provincia: "Forli-Cesena",
    organizzatore: "Ghetto Ponente",
    contattoOrganizzatore: "",
    instagram: "",
    descrizione:
      "Kings of the Ghetto - il torneo 3x3 di Cesenatico organizzato dal team Ghetto Ponente. Streetball, musica e good vibes sulla riviera.",
    stato: "prossima",
  },
  {
    id: "torneo-san-piero",
    nome: "San Piero",
    nomeCompleto: "Torneo di San Piero - Tappa ufficiale del Romagna Summer Hoops Tour",
    data: "Sabato 25 Luglio 2026",
    orario: "16:00",
    luogo: "San Piero",
    indirizzo: "San Piero (FC)",
    provincia: "Forli-Cesena",
    organizzatore: "",
    contattoOrganizzatore: "",
    instagram: "",
    descrizione:
      "Il Torneo di San Piero entra nel circuito del Romagna Summer Hoops Tour. Un appuntamento fisso per gli appassionati del 3x3.",
    stato: "in-arrivo",
  },
];

// ------ SAMPLE SQUADRE ------
export const squadre: Squadra[] = [
  {
    id: "i-predatori",
    nome: "I Predatori",
    motto: "Non si fanno prigionieri.",
    instagram: "@ipredatori3x3",
    giocatori: [
      { nome: "Marco", cognome: "Rossi", ruolo: "Guardia", instagram: "@marcorossi" },
      { nome: "Luca", cognome: "Bianchi", ruolo: "Ala", instagram: "@lucabianchi" },
      { nome: "Andrea", cognome: "Verdi", ruolo: "Centro" },
      { nome: "Davide", cognome: "Neri", ruolo: "Guardia" },
    ],
    puntiTotali: 0,
    tappeGiocate: 0,
    risultatiPerTappa: [],
  },
  {
    id: "rimini-ballers",
    nome: "Rimini Ballers",
    motto: "Dalla spiaggia al playground.",
    instagram: "@riminiballers",
    giocatori: [
      { nome: "Simone", cognome: "Ferri", ruolo: "Guardia" },
      { nome: "Matteo", cognome: "Costa", ruolo: "Ala", instagram: "@matteocosta" },
      { nome: "Filippo", cognome: "Galli", ruolo: "Centro" },
    ],
    puntiTotali: 0,
    tappeGiocate: 0,
    risultatiPerTappa: [],
  },
  {
    id: "cesena-wolves",
    nome: "Cesena Wolves",
    motto: "Il branco non si ferma.",
    instagram: "@cesenawolves",
    giocatori: [
      { nome: "Alessandro", cognome: "Lupo", ruolo: "Guardia" },
      { nome: "Roberto", cognome: "Mancini", ruolo: "Ala" },
      { nome: "Giorgio", cognome: "De Luca", ruolo: "Centro" },
      { nome: "Francesco", cognome: "Martini", ruolo: "Guardia" },
    ],
    puntiTotali: 0,
    tappeGiocate: 0,
    risultatiPerTappa: [],
  },
  {
    id: "ravenna-thunder",
    nome: "Ravenna Thunder",
    motto: "Il tuono si sente da lontano.",
    instagram: "@ravennathunder",
    giocatori: [
      { nome: "Paolo", cognome: "Romano", ruolo: "Guardia" },
      { nome: "Stefano", cognome: "Greco", ruolo: "Ala" },
      { nome: "Lorenzo", cognome: "Conti", ruolo: "Centro" },
    ],
    puntiTotali: 0,
    tappeGiocate: 0,
    risultatiPerTappa: [],
  },
];

// ------ SAMPLE NEWS ------
export const news: NewsItem[] = [
  {
    id: "lancio-tour-2026",
    titolo: "Nasce il Romagna Summer Hoops Tour!",
    data: "9 Febbraio 2026",
    anteprima:
      "Il primo circuito estivo di basket 3x3 in Romagna e' ufficiale. Un'estate di canestri, musica e street culture ti aspetta.",
    contenuto:
      "E' con grande entusiasmo che annunciamo la nascita del Romagna Summer Hoops Tour, il primo circuito estivo di basket 3x3 che unisce i tornei della Romagna in un'unica grande esperienza. Da Rimini a Ravenna, da Cesena a Forli, l'estate 2026 sara' all'insegna dello streetball. Preparatevi a vivere un'estate indimenticabile tra canestri, musica e buone vibes. Restate sintonizzati per tutte le novita'!",
  },
  {
    id: "prime-tappe-confermate",
    titolo: "Le prime tappe sono confermate!",
    data: "9 Febbraio 2026",
    anteprima:
      "KOTG a Cesenatico e il Torneo di San Piero aprono il calendario ufficiale del Tour.",
    contenuto:
      "Il calendario del Romagna Summer Hoops Tour inizia a prendere forma! Siamo felici di annunciare le prime due tappe ufficiali: il KOTG (Kings of the Ghetto) a Cesenatico (11 Luglio) e il Torneo di San Piero (25 Luglio). Altre tappe saranno annunciate nelle prossime settimane. Seguite i nostri canali per non perdere nessun aggiornamento!",
  },
];

// ------ RSHT CREW ------
export interface CrewMember {
  id: string;
  ruolo: string;
  ruoloLabel: string;
  nome: string;
  descrizione: string;
  instagram?: string;
  contatto?: string;
  disponibile: boolean;
}

export const crew: CrewMember[] = [
  {
    id: "official-photographer",
    ruolo: "OFFICIAL PHOTOGRAPHER",
    ruoloLabel: "Fotografo Ufficiale",
    nome: "Coming Soon",
    descrizione:
      "Copre ogni tappa del Tour con scatti professionali. Contenuti per social, sito web e archivio visivo della stagione.",
    disponibile: true,
  },
  {
    id: "official-videographer",
    ruolo: "OFFICIAL VIDEOGRAPHER",
    ruoloLabel: "Videomaker Ufficiale",
    nome: "Coming Soon",
    descrizione:
      "Highlight reel, recap video e produzioni professionali per immortalare i momenti migliori di ogni tappa.",
    disponibile: true,
  },
  {
    id: "official-dj",
    ruolo: "OFFICIAL DJ",
    ruoloLabel: "DJ Ufficiale",
    nome: "Coming Soon",
    descrizione:
      "La colonna sonora del Tour. Hip-hop, vibes estive e set live che accendono l'atmosfera ad ogni tappa.",
    disponibile: true,
  },
  {
    id: "official-voice",
    ruolo: "OFFICIAL VOICE",
    ruoloLabel: "Commentatore Ufficiale",
    nome: "Coming Soon",
    descrizione:
      "La voce ufficiale del Romagna Summer Hoops Tour. Commento live delle partite, presentazioni e intrattenimento.",
    disponibile: true,
  },
  {
    id: "official-after-party",
    ruolo: "OFFICIAL AFTER-PARTY",
    ruoloLabel: "After-Party Ufficiale",
    nome: "Coming Soon",
    descrizione:
      "Organizzazione dell'after-party ufficiale del Tour. Perche' il basket non finisce con l'ultimo canestro.",
    disponibile: true,
  },
  {
    id: "official-graphic-designer",
    ruolo: "OFFICIAL GRAPHIC DESIGNER",
    ruoloLabel: "Graphic Designer Ufficiale",
    nome: "Coming Soon",
    descrizione:
      "Locandine, grafiche social, branding e materiali visivi per le tappe e per il Tour.",
    disponibile: true,
  },
  {
    id: "official-food-truck",
    ruolo: "OFFICIAL FOOD TRUCK",
    ruoloLabel: "Food Truck Ufficiale",
    nome: "Coming Soon",
    descrizione:
      "Il gusto ufficiale del Tour. Street food di qualita' presente alle tappe e protagonista a The Finals.",
    disponibile: true,
  },
  {
    id: "official-streetwear",
    ruolo: "OFFICIAL STREETWEAR BRAND",
    ruoloLabel: "Streetwear Ufficiale",
    nome: "Coming Soon",
    descrizione:
      "Il brand streetwear del Tour. Merch, custom jerseys e limited edition per vestire la community.",
    disponibile: true,
  },
  {
    id: "official-physio",
    ruolo: "OFFICIAL PHYSIO",
    ruoloLabel: "Fisioterapista Ufficiale",
    nome: "Coming Soon",
    descrizione:
      "Warm-up, prevenzione infortuni e assistenza atletica per garantire sicurezza e performance ad ogni tappa.",
    disponibile: true,
  },
];

// ------ POINT SYSTEM ------
export const sistemaPunteggio = [
  { posizione: "1° posto", punti: 100 },
  { posizione: "2° posto", punti: 80 },
  { posizione: "3° posto", punti: 65 },
  { posizione: "4° posto", punti: 55 },
  { posizione: "Eliminati ai Quarti", punti: 45 },
  { posizione: "Eliminati agli Ottavi", punti: 30 },
  { posizione: "Eliminati ai gironi", punti: 20 },
];
