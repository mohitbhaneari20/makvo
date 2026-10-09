// Placeholder photography from Unsplash (free to use under the Unsplash License).
// Swap these for real uploads when profiles are live.

const PORTRAITS: Record<string, string> = {
  "Varun Sharma": "photo-1507003211169-0a1dd7228f2d",
  "Rahul Mehta": "photo-1721410875030-0b1668364b7d",
  "Sarah Lindqvist": "photo-1685760259914-ee8d2c92d2e0",
  "Aiko Tanaka": "photo-1773709536200-0e77b5f78463",
  "Leo Marchetti": "photo-1705645930353-0e335311ef20",
  "Priya Nair": "photo-1689580298851-d4482a124290",
  "Diego Ramos": "photo-1757744705465-ea08b0ddc38a",
  "Maya Okafor": "photo-1628682814595-a3f0816b25ff",
  "Tomás Vidal": "photo-1500648767791-00dcc994a43e",
  "Elena Petrova": "photo-1699899657680-421c2c2d5064",
  "Jonas Weber": "photo-1590086782957-93c06ef21604",
  "Zara Hussain": "photo-1592621385645-e41659e8aabe",
  "Kai Brennan": "photo-1560250097-0b93528c311a",
  "Nadia Rahman": "photo-1701096351544-7de3c7fa0272",
  "Owen Callahan": "photo-1746813628069-40e23e834c37",
  // Clients & reviewers
  "Amelia Brooks": "photo-1652471949169-9c587e8898cd",
  "Ines Carvalho": "photo-1494790108377-be9c29b29330",
  "Daniel Roth": "photo-1564564244660-5d73c057f2d2",
  "Ana Ruiz": "photo-1662850886700-4ec19bd30d11",
  "Tom Whitfield": "photo-1650091903029-fc3f1ddcb7f9",
  "Priya Anand": "photo-1547212371-eb5e6a4b590c",
  "Marcus Lee": "photo-1543132220-3ec99c6094dc",
  "Rohan Desai": "photo-1649433658557-54cf58577c68",
  "Elliot Park": "photo-1652471943570-f3590a4e52ed",
  "Marta Bellini": "photo-1526080652727-5b77f74eacd2",
  "Callum Reid": "photo-1592234789031-94bf65f630ed",
  "Funmi Adeyemi": "photo-1534470717-233b39a41c54",
  "Sam Whitaker": "photo-1583264277168-58ceba4b84e7",
  "Hana Sato": "photo-1613020092739-5d01102e080b",
  "Jonas Eklund": "photo-1528892952291-009c663ce843",
  "Lena Hoffmann": "photo-1607569708758-0270aa4651bd",
};

/** People at work: used for profile, team and marketing banners. */
export const BANNERS = [
  "photo-1787647560610-435c393752ec",
  "photo-1758873268364-15bef4162221",
  "photo-1758691736843-90f58dce465e",
  "photo-1758691737045-3ece61135061",
  "photo-1758691736804-4e88c52ad58b",
  "photo-1787647561912-660e537b0c65",
  "photo-1681949103006-70066fb25dfe",
  "photo-1568992687947-868a62a9f521",
  "photo-1622675363311-3e1904dc1885",
  "photo-1762784574847-16c5100cd1ff",
  "photo-1587613842352-3022a317a088",
  "photo-1758873268113-326c61b29968",
];

export const img = (id: string, w: number, h = w, faces = false) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=70&w=${w}&h=${h}${faces ? "&crop=faces" : ""}`;

/** Square portrait framed on the detected face, so every head sits the same way in a circle. */
export const portraitFor = (name: string, size = 160) =>
  PORTRAITS[name] ? `https://images.unsplash.com/${PORTRAITS[name]}?auto=format&fit=facearea&facepad=2.5&q=75&w=${size}&h=${size}` : null;

const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 11);
export const bannerFor = (key: string, w = 1600, h = 520) => img(BANNERS[hash(key) % BANNERS.length], w, h);
/** Taller crop of a portrait, for arch-shaped frames. */
export const portraitTall = (name: string, w = 520, h = 760) => (PORTRAITS[name] ? img(PORTRAITS[name], w, h, true) : null);
