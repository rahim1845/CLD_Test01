import type { LexEntry } from "./types";

export const LEXICON: Record<string, LexEntry> = {};

function def(words: string, entry: LexEntry): void {
  for (const word of words.split("|")) LEXICON[word.trim()] = entry;
}

// Industries
def("fintech|neobank|payments|payment|checkout", {
  kind: "industry", tag: "Fintech", w: 1.2, hue: 262, hw: 1.2,
  dims: { contrast: 0.3, density: 0.3, energy: 0.15, playful: -0.2 },
  font: { geometric: 1, grotesk: 0.8 }, harmony: { complementary: 0.4, split: 0.4 },
  nouns: ["Ledger", "Vault", "Capital", "Mint", "Tender"],
});
def("finance|financial|money|budget|budgeting|accounting|tax|invoice|invoicing", {
  kind: "industry", tag: "Finance", hue: 250, hw: 1.1,
  dims: { contrast: 0.3, density: 0.4, playful: -0.4, energy: -0.2 },
  font: { grotesk: 1, humanist: 0.6 }, harmony: { analogous: 0.6 },
  nouns: ["Ledger", "Capital", "Balance", "Reserve"],
});
def("bank|banking|credit|loan|loans|mortgage", {
  kind: "industry", tag: "Banking", hue: 252, hw: 1.2,
  dims: { contrast: 0.3, playful: -0.6, energy: -0.3, roundness: -0.1, vibrancy: -0.15 },
  font: { grotesk: 0.9, humanist: 0.7, geometric: 0.3 }, harmony: { analogous: 0.7 },
  nouns: ["Vault", "Reserve", "Charter", "Capital"],
});
def("crypto|cryptocurrency|blockchain|web3|defi|nft|nfts|bitcoin|ethereum", {
  kind: "industry", tag: "Crypto", w: 1.2, hue: 285, hw: 1,
  dims: { dark: 0.7, vibrancy: 0.5, energy: 0.5, depth: 0.3, contrast: 0.3 },
  font: { geometric: 0.9, technical: 0.6 }, harmony: { complementary: 0.5, split: 0.4 },
  vibes: ["futuristic", "tech"], nouns: ["Block", "Protocol", "Chain", "Node"],
});
def("invest|investing|investment|investments|wealth|trading|stocks|stock|portfolio management|asset management", {
  kind: "industry", tag: "Investing", hue: 165, hw: 1, accentHue: 80,
  dims: { contrast: 0.3, density: 0.4, elegance: 0.3, playful: -0.4 },
  font: { grotesk: 0.8, geometric: 0.6, editorial: 0.3 }, harmony: { complementary: 0.4, analogous: 0.4 },
  nouns: ["Capital", "Reserve", "Summit", "Yield"],
});
def("insurance|insurer|coverage", {
  kind: "industry", tag: "Insurance", hue: 235, hw: 1,
  dims: { playful: -0.3, contrast: 0.2, roundness: 0.2, energy: -0.3 },
  font: { humanist: 1, geometric: 0.4 }, harmony: { analogous: 0.7 },
  nouns: ["Shield", "Harbor", "Haven", "Anchor"],
});
def("health|healthcare|health care|telehealth|care", {
  kind: "industry", tag: "Healthcare", w: 1.1, hue: 192, hw: 1.2,
  dims: { dark: -0.5, contrast: 0.2, roundness: 0.35, energy: -0.2, warmth: -0.1 },
  font: { humanist: 1.1, geometric: 0.4 }, harmony: { analogous: 0.7 },
  nouns: ["Pulse", "Haven", "Remedy", "Vital"],
});
def("medical|medicine|clinic|hospital|pharma|pharmacy|doctor|doctors|patient|patients", {
  kind: "industry", tag: "Medical", hue: 220, hw: 1.1,
  dims: { dark: -0.6, vibrancy: -0.1, energy: -0.3, contrast: 0.3, warmth: -0.3 },
  font: { humanist: 1.1, grotesk: 0.5 }, harmony: { analogous: 0.8 },
  nouns: ["Pulse", "Remedy", "Vital", "Clinic"],
});
def("dental|dentist|orthodontic", {
  kind: "industry", tag: "Dental", hue: 200, hw: 1,
  dims: { dark: -0.7, roundness: 0.4, warmth: -0.3 },
  font: { humanist: 0.8, rounded: 0.4 }, harmony: { analogous: 0.6 }, nouns: ["Smile", "Pearl"],
});
def("wellness|wellbeing|well being|selfcare|self care|spa|holistic", {
  kind: "industry", tag: "Wellness", w: 1.1, hue: 150, hw: 1,
  dims: { vibrancy: -0.45, dark: -0.6, warmth: 0.25, energy: -0.6, roundness: 0.45, density: -0.5 },
  font: { humanist: 0.7, geometric: 0.4, editorial: 0.4 }, harmony: { analogous: 1 },
  vibes: ["soft", "organic"], nouns: ["Sanctuary", "Haven", "Breath", "Ritual"],
});
def("meditation|meditate|mindfulness|mindful|yoga|zen|breathwork|sleep", {
  kind: "industry", tag: "Mindfulness", w: 1.1, hue: 285, hw: 0.8,
  dims: { vibrancy: -0.5, energy: -0.85, dark: -0.2, roundness: 0.45, density: -0.6, contrast: -0.2 },
  font: { humanist: 0.7, editorial: 0.5, geometric: 0.3 }, harmony: { analogous: 1, monochrome: 0.5 },
  vibes: ["soft"], nouns: ["Breath", "Stillness", "Lotus", "Ritual"],
});
def("therapy|therapist|mental health|counseling|counselling", {
  kind: "industry", tag: "Mental Health", hue: 200, hw: 0.8,
  dims: { vibrancy: -0.4, energy: -0.5, warmth: 0.25, roundness: 0.5, dark: -0.4 },
  font: { humanist: 1, rounded: 0.4 }, harmony: { analogous: 0.9 }, vibes: ["soft"], nouns: ["Haven", "Harbor", "Kindred"],
});
def("fitness|gym|workout|workouts|training|athletic|athletics|running|runner|crossfit|strength", {
  kind: "industry", tag: "Fitness", w: 1.1, hue: 25, hw: 1,
  dims: { energy: 0.85, vibrancy: 0.6, contrast: 0.55, dark: 0.4, roundness: -0.15 },
  font: { grotesk: 1, geometric: 0.6 }, harmony: { complementary: 0.7 },
  vibes: ["bold"], nouns: ["Pulse", "Sprint", "Forge", "Stride"],
});
def("sport|sports|league|football|soccer|basketball|tennis|golf|cycling", {
  kind: "industry", tag: "Sports", hue: 15, hw: 0.8,
  dims: { energy: 0.9, contrast: 0.6, vibrancy: 0.7, roundness: -0.2 },
  font: { grotesk: 1, geometric: 0.5 }, harmony: { complementary: 0.8 }, vibes: ["bold"],
  nouns: ["League", "Arena", "Stride", "Victory"],
});
def("nutrition|diet|healthy eating|meal|meals|salad|vegan|plant based", {
  kind: "industry", tag: "Nutrition", hue: 135, hw: 1,
  dims: { warmth: 0.3, vibrancy: 0.3, dark: -0.5, roundness: 0.35 },
  font: { geometric: 0.7, humanist: 0.6 }, harmony: { complementary: 0.5 }, vibes: ["organic"],
  nouns: ["Harvest", "Sprout", "Orchard"],
});
def("kid|kids|child|children|childrens|toddler|toddlers|baby|babies|preschool|kindergarten|toy|toys", {
  kind: "industry", tag: "Kids", w: 1.3, hue: 45, hw: 0.4,
  dims: { playful: 1, roundness: 1, vibrancy: 0.55, energy: 0.6, dark: -0.75, warmth: 0.35, contrast: 0.1 },
  font: { rounded: 1.6, geometric: 0.3 }, harmony: { triadic: 1, complementary: 0.4 },
  nouns: ["Playground", "Kite", "Balloon", "Crayon", "Treehouse"],
});
def("family|families|parent|parents|parenting", {
  kind: "industry", tag: "Family", hue: 35, hw: 0.5,
  dims: { warmth: 0.6, roundness: 0.6, playful: 0.4, dark: -0.5 },
  font: { rounded: 0.8, humanist: 0.8 }, harmony: { analogous: 0.5, complementary: 0.4 }, nouns: ["Hearth", "Nest", "Kindred"],
});
def("education|edtech|learning|learn|school|schools|course|courses|tutor|tutoring|teaching|teacher|teachers|students|student|classroom|study", {
  kind: "industry", tag: "Education", w: 1.1, hue: 235, hw: 0.8,
  dims: { dark: -0.45, roundness: 0.3, playful: 0.2, contrast: 0.25, warmth: 0.1 },
  font: { humanist: 1, geometric: 0.6 }, harmony: { complementary: 0.5, split: 0.5 },
  nouns: ["Academy", "Chapter", "Quill", "Compass", "Notebook"],
});
def("university|academic|academia|college|scholar|scholarly|research", {
  kind: "industry", tag: "Academic", hue: 245, hw: 0.9,
  dims: { playful: -0.4, elegance: 0.3, vibrancy: -0.25, contrast: 0.3 },
  font: { editorial: 1, humanist: 0.6 }, harmony: { analogous: 0.6, monochrome: 0.3 }, vibes: ["classic"],
  nouns: ["Quill", "Chapter", "Archive", "Lyceum"],
});
def("gaming|game|games|gamer|gamers|arcade|videogame|videogames|console", {
  kind: "industry", tag: "Gaming", w: 1.2, hue: 290, hw: 1,
  dims: { dark: 0.9, vibrancy: 0.75, energy: 0.8, depth: 0.5, contrast: 0.45, playful: 0.3 },
  font: { geometric: 0.7, grotesk: 0.6, technical: 0.3 }, harmony: { complementary: 0.6, triadic: 0.5 },
  vibes: ["futuristic", "bold"], nouns: ["Arcade", "Quest", "Arena", "Realm", "Respawn"],
});
def("esports|e sports|tournament|tournaments|competitive|clan", {
  kind: "industry", tag: "Esports", w: 1.3, hue: 355, hw: 0.9,
  dims: { dark: 1, vibrancy: 0.9, energy: 1, contrast: 0.65, roundness: -0.45, depth: 0.4 },
  font: { grotesk: 0.9, geometric: 0.6, technical: 0.4 }, harmony: { complementary: 0.8 },
  vibes: ["bold", "futuristic"], nouns: ["Arena", "Clash", "Legion", "Siege"],
});
def("legal|law|lawyer|lawyers|attorney|attorneys|counsel|litigation|notary", {
  kind: "industry", tag: "Legal", w: 1.2, hue: 255, hw: 1,
  dims: { vibrancy: -0.4, energy: -0.6, playful: -0.85, contrast: 0.35, roundness: -0.35, elegance: 0.35 },
  font: { editorial: 1.3, humanist: 0.4 }, harmony: { monochrome: 0.6, analogous: 0.7 }, vibes: ["classic"],
  nouns: ["Counsel", "Charter", "Covenant", "Statute"],
});
def("consulting|consultancy|advisory|advisors|firm|b2b services", {
  kind: "industry", tag: "Consulting", hue: 240, hw: 0.7,
  dims: { playful: -0.5, elegance: 0.3, contrast: 0.3, vibrancy: -0.2 },
  font: { grotesk: 0.8, editorial: 0.5 }, harmony: { analogous: 0.6 }, nouns: ["Meridian", "Keystone", "Compass"],
});
def("real estate|realestate|property|properties|realty|realtor|housing|homes|rental|rentals|mortgage broker", {
  kind: "industry", tag: "Real Estate", w: 1.1, hue: 215, hw: 0.9, accentHue: 75,
  dims: { elegance: 0.35, vibrancy: -0.2, dark: -0.2, roundness: 0.1 },
  font: { geometric: 0.7, editorial: 0.6 }, harmony: { complementary: 0.6 },
  nouns: ["Keystone", "Residence", "Estate", "Haven"],
});
def("architecture|architect|architects|interior|interiors|interior design|furniture", {
  kind: "industry", tag: "Architecture", hue: 60, hw: 0.4,
  dims: { vibrancy: -0.6, roundness: -0.6, elegance: 0.45, density: -0.5, depth: -0.3 },
  font: { grotesk: 1, editorial: 0.5 }, harmony: { monochrome: 1 },
  nouns: ["Atelier", "Studio", "Plinth", "Monolith"],
});
def("luxury|luxurious|opulent|lavish|high end|upscale|haute|prestige|prestigious|exclusive|bespoke", {
  kind: "industry", tag: "Luxury", w: 1.4, hue: 80, hw: 0.7, accentHue: 80,
  dims: { dark: 0.8, elegance: 1, vibrancy: -0.35, contrast: 0.4, roundness: -0.55, density: -0.6, energy: -0.4, depth: 0.2 },
  font: { luxury: 1.6, editorial: 0.8 }, harmony: { monochrome: 0.8, complementary: 0.3 }, vibes: ["classic"],
  nouns: ["Maison", "Atelier", "Salon", "Regalia"], adjectives: ["Gilded", "Velvet", "Regal"],
});
def("premium|refined luxury|quality|elite", {
  kind: "trait", tag: "Premium", w: 1, dims: { elegance: 0.6, dark: 0.35, vibrancy: -0.15, contrast: 0.2 },
  font: { luxury: 0.5, editorial: 0.4, geometric: 0.3 }, harmony: { monochrome: 0.4 }, adjectives: ["Gilded", "Noble"],
});
def("jewelry|jewellery|jeweler|jeweller|diamond|diamonds|watch|watches|watchmaker", {
  kind: "industry", tag: "Jewelry", w: 1.2, hue: 80, hw: 0.8, accentHue: 80,
  dims: { elegance: 1, dark: 0.6, density: -0.5, roundness: -0.4, vibrancy: -0.2 },
  font: { luxury: 1.3, editorial: 0.6 }, harmony: { monochrome: 0.7 }, vibes: ["classic"],
  nouns: ["Facet", "Carat", "Atelier", "Lumen"],
});
def("fashion|apparel|clothing|couture|boutique|designer label|runway|wardrobe", {
  kind: "industry", tag: "Fashion", w: 1.2, hue: 350, hw: 0.4,
  dims: { elegance: 0.75, contrast: 0.6, vibrancy: -0.25, roundness: -0.45, density: -0.45 },
  font: { editorial: 1.1, luxury: 0.6, grotesk: 0.4 }, harmony: { monochrome: 0.9 },
  nouns: ["Atelier", "Runway", "Silhouette", "Edit"],
});
def("streetwear|sneakers|sneaker|skate|skateboarding|hypebeast", {
  kind: "industry", tag: "Streetwear", w: 1.1, hue: 20, hw: 0.4,
  dims: { contrast: 0.85, energy: 0.65, roundness: -0.6, vibrancy: 0.3, dark: 0.4 },
  font: { grotesk: 1.2, technical: 0.3 }, harmony: { complementary: 0.7 }, vibes: ["bold"],
  nouns: ["Drop", "Block", "Concrete", "Asphalt"],
});
def("beauty|cosmetics|cosmetic|skincare|skin care|makeup|salon|fragrance|perfume|nails", {
  kind: "industry", tag: "Beauty", w: 1.2, hue: 355, hw: 1,
  dims: { warmth: 0.45, vibrancy: -0.15, elegance: 0.6, roundness: 0.3, dark: -0.5, tone: 0.25 },
  font: { editorial: 0.9, luxury: 0.6, geometric: 0.3 }, harmony: { analogous: 0.9 }, vibes: ["soft"],
  nouns: ["Bloom", "Petal", "Glow", "Ritual", "Velvet"],
});
def("food|foodie|recipe|recipes|cooking|kitchen|grocery|groceries|delivery|snack|snacks|takeout", {
  kind: "industry", tag: "Food", w: 1.1, hue: 35, hw: 1.1,
  dims: { warmth: 0.85, vibrancy: 0.5, energy: 0.4, roundness: 0.45, dark: -0.5, playful: 0.3 },
  font: { geometric: 0.6, rounded: 0.5, humanist: 0.5 }, harmony: { complementary: 0.6, analogous: 0.4 },
  nouns: ["Pantry", "Harvest", "Table", "Skillet", "Larder"],
});
def("coffee|cafe|coffeehouse|espresso|roastery|roaster|barista|tea|teahouse", {
  kind: "industry", tag: "Coffee", w: 1.2, hue: 55, hw: 1.3,
  dims: { warmth: 0.9, vibrancy: -0.45, roundness: 0.25, energy: -0.25, dark: 0.15, tone: -0.35 },
  font: { editorial: 0.8, humanist: 0.6 }, harmony: { analogous: 1 }, vibes: ["organic", "classic"],
  nouns: ["Roast", "Brew", "Crema", "Bean", "Hearth"],
});
def("bakery|baker|pastry|patisserie|bread|cake|cakes|dessert|desserts", {
  kind: "industry", tag: "Bakery", hue: 65, hw: 1,
  dims: { warmth: 0.85, playful: 0.3, dark: -0.6, roundness: 0.5, vibrancy: -0.1 },
  font: { editorial: 0.7, rounded: 0.5 }, harmony: { analogous: 0.8 }, nouns: ["Hearth", "Crumb", "Oven", "Larder"],
});
def("restaurant|restaurants|dining|bistro|brasserie|eatery|chef|culinary|gastronomy", {
  kind: "industry", tag: "Restaurant", w: 1.1, hue: 30, hw: 1,
  dims: { warmth: 0.75, elegance: 0.45, vibrancy: -0.1, dark: 0.2 },
  font: { editorial: 1.1, luxury: 0.3 }, harmony: { analogous: 0.7 }, vibes: ["classic"],
  nouns: ["Table", "Hearth", "Supper", "Cellar"],
});
def("winery|vineyard|vineyards|sommelier|wine bar", {
  kind: "industry", tag: "Wine", w: 1.1, hue: 10, hw: 1.3,
  dims: { elegance: 0.75, dark: 0.5, warmth: 0.5, tone: -0.5 },
  font: { editorial: 1, luxury: 0.6 }, harmony: { analogous: 0.6, monochrome: 0.4 }, vibes: ["classic"],
  nouns: ["Cellar", "Vintage", "Cask", "Vine"],
});
def("brewery|beer|craft beer|brewing|distillery|cocktail|cocktails|pub", {
  kind: "industry", tag: "Brewery", hue: 70, hw: 1,
  dims: { warmth: 0.85, energy: 0.2, dark: 0.3 },
  font: { grotesk: 0.6, editorial: 0.5 }, harmony: { complementary: 0.5 }, vibes: ["retro"],
  nouns: ["Cask", "Tap", "Barrel", "Hops"],
});
def("travel|tourism|trip|trips|vacation|vacations|holiday|holidays|airline|airlines|flight|flights|booking|getaway", {
  kind: "industry", tag: "Travel", w: 1.1, hue: 215, hw: 1, accentHue: 40,
  dims: { vibrancy: 0.35, energy: 0.35, warmth: 0.15, dark: -0.45, roundness: 0.35 },
  font: { geometric: 0.9, humanist: 0.5 }, harmony: { complementary: 1 },
  nouns: ["Voyage", "Compass", "Passport", "Horizon", "Atlas"],
});
def("hotel|hotels|hospitality|resort|resorts|inn|lodge", {
  kind: "industry", tag: "Hospitality", hue: 45, hw: 0.6,
  dims: { elegance: 0.55, warmth: 0.45, density: -0.4 },
  font: { editorial: 0.8, luxury: 0.5 }, harmony: { analogous: 0.7 }, nouns: ["Lodge", "Retreat", "Residence"],
});
def("outdoor|outdoors|adventure|adventures|hiking|hike|camping|climbing|expedition|trail|trails|backpacking", {
  kind: "industry", tag: "Outdoor", w: 1.1, hue: 140, hw: 1, accentHue: 45,
  dims: { warmth: 0.3, vibrancy: -0.1, energy: 0.4, roundness: -0.2, contrast: 0.35 },
  font: { grotesk: 0.8, geometric: 0.4, humanist: 0.4 }, harmony: { complementary: 0.8 }, vibes: ["organic"],
  nouns: ["Trail", "Summit", "Basecamp", "Ridge", "Canyon"],
});
def("eco|ecological|sustainable|sustainability|climate|environmental|environment|renewable|recycling|recycled|zero waste|conservation|regenerative", {
  kind: "industry", tag: "Sustainable", w: 1.2, hue: 148, hw: 1.3,
  dims: { warmth: 0.2, vibrancy: -0.2, dark: -0.4, roundness: 0.35, energy: -0.1 },
  font: { humanist: 0.9, geometric: 0.5 }, harmony: { analogous: 1 }, vibes: ["organic"],
  nouns: ["Canopy", "Seedling", "Grove", "Terra", "Commons"],
});
def("energy company|power|utility|utilities|power grid|battery|batteries|electricity", {
  kind: "industry", tag: "Energy", hue: 85, hw: 0.9, accentHue: 230,
  dims: { energy: 0.5, vibrancy: 0.5, contrast: 0.3 },
  font: { geometric: 0.7, grotesk: 0.6 }, harmony: { complementary: 1 }, nouns: ["Current", "Volt", "Grid", "Flux"],
});
def("solar|sun power|clean energy", {
  kind: "industry", tag: "Solar", hue: 78, hw: 1.2,
  dims: { warmth: 0.6, vibrancy: 0.55, energy: 0.4, dark: -0.3 },
  font: { geometric: 0.9 }, harmony: { complementary: 0.8 }, nouns: ["Ray", "Helios", "Flare"],
});
def("saas|b2b|platform|software|startup|startups|dashboard|dashboards|workspace", {
  kind: "industry", tag: "SaaS", w: 0.9, hue: 268, hw: 0.6,
  dims: { contrast: 0.2, density: 0.25, roundness: 0.05 },
  font: { grotesk: 1, geometric: 0.8 }, harmony: { split: 0.4, analogous: 0.4 },
  nouns: ["Stack", "Orbit", "Relay", "Beacon"],
});
def("dev tools|devtools|developer|developers|developer tools|api|apis|sdk|code|coding|programming|engineering|infrastructure|cloud|devops|open source|database|backend|hosting|deploy|git", {
  kind: "industry", tag: "Developer Tools", w: 1.3, hue: 260, hw: 0.5,
  dims: { dark: 0.9, density: 0.6, contrast: 0.45, roundness: -0.25, vibrancy: 0.1, playful: -0.3 },
  font: { technical: 1.3, grotesk: 0.8 }, harmony: { analogous: 0.5, monochrome: 0.4 }, vibes: ["tech"],
  nouns: ["Kernel", "Forge", "Stack", "Compiler", "Runtime", "Shell"],
});
def("terminal|cli|command line|shell|hacker|hackers|matrix", {
  kind: "industry", tag: "Terminal", w: 1.2, hue: 150, hw: 1,
  dims: { dark: 1, roundness: -0.7, density: 0.6, vibrancy: 0.5, contrast: 0.5 },
  font: { technical: 1.8 }, harmony: { monochrome: 0.8 }, vibes: ["tech", "retro"],
  nouns: ["Shell", "Prompt", "Kernel", "Daemon"],
});
def("ai|artificial intelligence|machine learning|ml|llm|llms|neural|gpt|chatbot|agents|agentic|genai|generative", {
  kind: "industry", tag: "AI", w: 1.3, hue: 285, hw: 1, accentHue: 200,
  dims: { dark: 0.6, vibrancy: 0.5, energy: 0.3, depth: 0.3, contrast: 0.3 },
  font: { geometric: 1, grotesk: 0.6 }, harmony: { split: 0.6, complementary: 0.4 }, vibes: ["futuristic", "glass"],
  nouns: ["Cortex", "Neuron", "Synapse", "Oracle", "Lattice"],
});
def("data|analytics|metrics|insights|bi|reporting|observability|monitoring|statistics", {
  kind: "industry", tag: "Analytics", w: 1.1, hue: 245, hw: 0.8,
  dims: { density: 0.65, contrast: 0.35, dark: 0.25, roundness: -0.15 },
  font: { grotesk: 1, technical: 0.5 }, harmony: { triadic: 0.4, analogous: 0.5 }, vibes: ["tech"],
  nouns: ["Signal", "Metric", "Lens", "Vector", "Insight"],
});
def("security|cybersecurity|cyber security|privacy|encryption|vpn|identity|authentication|auth|firewall|compliance", {
  kind: "industry", tag: "Security", w: 1.2, hue: 230, hw: 0.8,
  dims: { dark: 0.7, contrast: 0.55, density: 0.3, playful: -0.6, roundness: -0.35 },
  font: { technical: 0.8, grotesk: 0.9 }, harmony: { monochrome: 0.5, analogous: 0.5 }, vibes: ["tech"],
  nouns: ["Bastion", "Citadel", "Sentinel", "Aegis", "Vault"],
});
def("music|audio|podcast|podcasts|sound|concert|concerts|festival|festivals|band|dj|record label|playlist|streaming music", {
  kind: "industry", tag: "Music", w: 1.2, hue: 320, hw: 1,
  dims: { energy: 0.7, vibrancy: 0.65, dark: 0.6, contrast: 0.4, playful: 0.2 },
  font: { grotesk: 0.8, geometric: 0.6, editorial: 0.3 }, harmony: { complementary: 0.6, triadic: 0.4 },
  vibes: ["bold"], nouns: ["Cadence", "Echo", "Rhythm", "Chord", "Encore"],
});
def("media|news|newspaper|journalism|journal|press|publishing|publisher|blog|newsletter", {
  kind: "industry", tag: "Publishing", w: 1.1, hue: 20, hw: 0.4,
  dims: { contrast: 0.65, vibrancy: -0.25, density: 0.4, roundness: -0.45 },
  font: { editorial: 1.4, grotesk: 0.4 }, harmony: { monochrome: 0.9 }, vibes: ["classic"],
  nouns: ["Press", "Gazette", "Column", "Dispatch", "Ledger"],
});
def("film|cinema|movie|movies|streaming|video|documentary|filmmaking", {
  kind: "industry", tag: "Film", hue: 25, hw: 0.4,
  dims: { dark: 1, contrast: 0.5, depth: 0.55, elegance: 0.3 },
  font: { grotesk: 0.6, editorial: 0.6, luxury: 0.3 }, harmony: { complementary: 0.5 },
  nouns: ["Reel", "Premiere", "Frame", "Marquee"],
});
def("photography|photo|photos|photographer|portfolio|gallery|art|artist|artists|museum|exhibition|creative|creatives|design studio|studio", {
  kind: "industry", tag: "Creative", hue: 300, hw: 0.3,
  dims: { vibrancy: -0.15, density: -0.55, contrast: 0.3 },
  font: { editorial: 0.7, grotesk: 0.8 }, harmony: { monochrome: 0.7 },
  nouns: ["Studio", "Canvas", "Gallery", "Frame", "Atelier"],
});
def("nonprofit|non profit|charity|charities|ngo|foundation|donation|donations|donate|volunteer|volunteers|community|social impact|mission", {
  kind: "industry", tag: "Nonprofit", w: 1.1, hue: 30, hw: 0.7,
  dims: { warmth: 0.6, roundness: 0.4, playful: 0.15, dark: -0.4 },
  font: { humanist: 1.2, geometric: 0.4 }, harmony: { complementary: 0.5, analogous: 0.4 },
  nouns: ["Commons", "Harbor", "Kindred", "Beacon"],
});
def("government|civic|public sector|municipal|federal|city hall|public service|ministry|council|election", {
  kind: "industry", tag: "Government", w: 1.2, hue: 248, hw: 1,
  dims: { vibrancy: -0.35, contrast: 0.65, playful: -0.8, energy: -0.4, roundness: -0.3 },
  font: { humanist: 1.1, grotesk: 0.6 }, harmony: { analogous: 0.8 }, vibes: ["classic"],
  nouns: ["Civic", "Charter", "Commons", "Capitol"],
});
def("automotive|car|cars|auto|vehicle|vehicles|motor|motors|motorsport|garage|dealership", {
  kind: "industry", tag: "Automotive", w: 1.1, hue: 22, hw: 0.7,
  dims: { contrast: 0.6, dark: 0.65, energy: 0.5, depth: 0.45, roundness: -0.3 },
  font: { grotesk: 1, geometric: 0.6 }, harmony: { complementary: 0.5 }, vibes: ["bold"],
  nouns: ["Torque", "Velocity", "Circuit", "Apex"],
});
def("racing|race|speedway|formula", {
  kind: "industry", tag: "Racing", hue: 25, hw: 1,
  dims: { energy: 1, vibrancy: 0.8, contrast: 0.7, dark: 0.5, roundness: -0.4 },
  font: { grotesk: 1, geometric: 0.5 }, harmony: { complementary: 0.8 }, vibes: ["bold"], nouns: ["Apex", "Velocity", "Pitlane"],
});
def("ev|electric vehicle|electric vehicles|mobility|scooter|ebike", {
  kind: "industry", tag: "Mobility", hue: 195, hw: 1,
  dims: { energy: 0.4, vibrancy: 0.4, contrast: 0.3 },
  font: { geometric: 1 }, harmony: { analogous: 0.5, complementary: 0.4 }, vibes: ["futuristic"], nouns: ["Current", "Volt", "Glide"],
});
def("logistics|shipping|freight|supply chain|transport|transportation|warehouse|fleet|courier", {
  kind: "industry", tag: "Logistics", hue: 35, hw: 0.6,
  dims: { density: 0.45, contrast: 0.45, roundness: -0.2 },
  font: { grotesk: 1 }, harmony: { complementary: 0.6 }, nouns: ["Freight", "Relay", "Depot", "Route"],
});
def("hr|recruiting|recruitment|hiring|jobs|careers|talent|payroll|employees|people ops", {
  kind: "industry", tag: "HR", hue: 260, hw: 0.6,
  dims: { warmth: 0.3, roundness: 0.35, playful: 0.15 },
  font: { geometric: 0.8, humanist: 0.6 }, harmony: { complementary: 0.4, split: 0.4 }, nouns: ["Kindred", "Talent", "Crew"],
});
def("productivity|notes|tasks|todo|calendar|collaboration|project management|planner|planning|crm|sales", {
  kind: "industry", tag: "Productivity", hue: 255, hw: 0.6,
  dims: { density: 0.35, contrast: 0.25, energy: 0.1 },
  font: { grotesk: 1, geometric: 0.5 }, harmony: { analogous: 0.5, split: 0.3 }, nouns: ["Focus", "Flow", "Notebook", "Relay"],
});
def("ecommerce|e commerce|shop|shopping|store|retail|marketplace|commerce|merch", {
  kind: "industry", tag: "E-commerce", hue: 25, hw: 0.6,
  dims: { energy: 0.4, vibrancy: 0.4, warmth: 0.3, roundness: 0.3 },
  font: { geometric: 1 }, harmony: { complementary: 0.7 }, nouns: ["Market", "Bazaar", "Parcel", "Cart"],
});
def("social|social media|social network|dating|chat|messaging|creator|creators|influencer|influencers", {
  kind: "industry", tag: "Social", hue: 330, hw: 0.6,
  dims: { playful: 0.45, vibrancy: 0.55, roundness: 0.6, energy: 0.5 },
  font: { geometric: 0.8, rounded: 0.5 }, harmony: { triadic: 0.5, complementary: 0.5 }, nouns: ["Circle", "Spark", "Chorus", "Hive"],
});
def("pet|pets|dog|dogs|puppy|cat|cats|kitten|veterinary|vet|vets", {
  kind: "industry", tag: "Pets", w: 1.1, hue: 40, hw: 0.8,
  dims: { playful: 0.7, warmth: 0.65, roundness: 0.8, dark: -0.5 },
  font: { rounded: 1, geometric: 0.4 }, harmony: { complementary: 0.6 }, nouns: ["Paw", "Burrow", "Den", "Biscuit"],
});
def("agriculture|farm|farms|farming|farmer|farmers|agritech|harvest|orchard", {
  kind: "industry", tag: "Agriculture", hue: 115, hw: 1,
  dims: { warmth: 0.5, vibrancy: -0.15, roundness: 0.2 },
  font: { humanist: 0.9, editorial: 0.4 }, harmony: { analogous: 0.8 }, vibes: ["organic"], nouns: ["Harvest", "Orchard", "Furrow", "Acre"],
});
def("garden|gardening|plants|plant|botanical|botanic|greenhouse|houseplants|nursery", {
  kind: "industry", tag: "Botanical", hue: 140, hw: 1.1,
  dims: { warmth: 0.3, vibrancy: -0.15, roundness: 0.35, dark: -0.3 },
  font: { editorial: 0.6, humanist: 0.7 }, harmony: { analogous: 0.8 }, vibes: ["organic"], nouns: ["Greenhouse", "Fern", "Conservatory", "Grove"],
});
def("floral|flower|flowers|florist|bouquet|petals", {
  kind: "imagery", tag: "Floral", hue: 350, hw: 1, accentHue: 140,
  dims: { warmth: 0.4, roundness: 0.4, dark: -0.4, tone: 0.3 },
  font: { editorial: 0.8 }, harmony: { complementary: 0.6 }, vibes: ["soft"], nouns: ["Bloom", "Petal", "Bouquet", "Peony"],
});
def("aerospace|rocket|rockets|satellite|satellites|astronomy|spacecraft|space travel|nasa", {
  kind: "industry", tag: "Aerospace", w: 1.1, hue: 255, hw: 0.8,
  dims: { dark: 1, contrast: 0.5, depth: 0.2, density: 0.2 },
  font: { geometric: 0.8, technical: 0.6 }, harmony: { complementary: 0.5 }, vibes: ["futuristic"], nouns: ["Orbit", "Apollo", "Zenith", "Vector"],
});
def("biotech|lab|labs|laboratory|science|scientific|chemistry|genomics|biology", {
  kind: "industry", tag: "Biotech", hue: 185, hw: 0.9,
  dims: { contrast: 0.35, dark: -0.2, density: 0.35, playful: -0.3 },
  font: { grotesk: 0.8, technical: 0.5, humanist: 0.4 }, harmony: { analogous: 0.6 }, vibes: ["tech"],
  nouns: ["Helix", "Catalyst", "Lattice", "Element"],
});
def("telecom|network|networks|connectivity|iot|wireless|internet|broadband", {
  kind: "industry", tag: "Telecom", hue: 220, hw: 0.8,
  dims: { energy: 0.2, contrast: 0.3 }, font: { geometric: 0.9 }, harmony: { split: 0.5 }, nouns: ["Signal", "Relay", "Mesh"],
});
def("manufacturing|industrial|construction|hardware|machinery|factory|tools company|engineering firm", {
  kind: "industry", tag: "Industrial", w: 1.1, hue: 65, hw: 0.8,
  dims: { contrast: 0.7, roundness: -0.6, vibrancy: 0.2, density: 0.3 },
  font: { grotesk: 1.2, technical: 0.4 }, harmony: { complementary: 0.6 }, vibes: ["bold"],
  nouns: ["Foundry", "Forge", "Girder", "Anvil"],
});
def("wedding|weddings|bridal|bride|events|event|party|parties|celebration|invitation", {
  kind: "industry", tag: "Events", hue: 350, hw: 0.6,
  dims: { elegance: 0.75, vibrancy: -0.35, dark: -0.6, roundness: 0.2, tone: 0.3 },
  font: { luxury: 0.9, editorial: 1 }, harmony: { analogous: 0.8 }, vibes: ["soft", "classic"],
  nouns: ["Soiree", "Vow", "Gala", "Garland"],
});
def("church|faith|spiritual|spirituality|ministry of faith|worship", {
  kind: "industry", tag: "Spiritual", hue: 285, hw: 0.6,
  dims: { energy: -0.5, elegance: 0.4, vibrancy: -0.25 },
  font: { editorial: 1 }, harmony: { analogous: 0.8 }, vibes: ["classic"], nouns: ["Sanctum", "Vesper", "Haven"],
});
def("library|libraries|books|book|bookstore|reading|literature|writing|writers|writer|poetry|author|authors|novel", {
  kind: "industry", tag: "Literary", w: 1.1, hue: 35, hw: 0.6,
  dims: { warmth: 0.5, vibrancy: -0.4, elegance: 0.3, density: -0.2 },
  font: { editorial: 1.4 }, harmony: { analogous: 0.6 }, vibes: ["classic"],
  nouns: ["Folio", "Chapter", "Quill", "Archive", "Margin"],
});
def("marketing|advertising|agency|agencies|branding|brand studio", {
  kind: "industry", tag: "Marketing", hue: 15, hw: 0.4,
  dims: { energy: 0.4, vibrancy: 0.3, contrast: 0.3 },
  font: { geometric: 0.8, grotesk: 0.6 }, harmony: { complementary: 0.6 }, nouns: ["Spark", "Studio", "Signal"],
});

// Traits
def("calm|calming|serene|serenity|tranquil|peaceful|relaxing|soothing|gentle|quiet|restful|balanced", {
  kind: "trait", tag: "Calm", w: 1.1, hue: 200, hw: 0.35,
  dims: { energy: -0.85, vibrancy: -0.4, contrast: -0.2, density: -0.4, roundness: 0.25 },
  font: { humanist: 0.5, geometric: 0.2 }, harmony: { analogous: 1, monochrome: 0.4 }, vibes: ["soft"],
  adjectives: ["Quiet", "Still", "Gentle", "Hushed", "Serene"],
});
def("bold|strong|striking|loud|confident|powerful|impactful|fearless|intense|daring", {
  kind: "trait", tag: "Bold", w: 1.1,
  dims: { vibrancy: 0.6, contrast: 0.8, energy: 0.6, depth: 0.2, tone: -0.15 },
  font: { grotesk: 0.8, geometric: 0.5 }, harmony: { complementary: 0.8 }, vibes: ["bold"],
  adjectives: ["Bold", "Vivid", "Fierce", "Electric"],
});
def("playful|fun|whimsical|joyful|joyous|cheerful|happy|silly|cute|lighthearted|light hearted|goofy|delightful|cartoon|cartoony", {
  kind: "trait", tag: "Playful", w: 1.2, hue: 330, hw: 0.25,
  dims: { playful: 1, roundness: 0.85, vibrancy: 0.5, energy: 0.6, warmth: 0.3, dark: -0.35 },
  font: { rounded: 1.3, geometric: 0.3 }, harmony: { triadic: 0.9, complementary: 0.5 },
  adjectives: ["Bubbly", "Merry", "Jolly", "Zesty", "Peppy"],
});
def("serious|professional|formal|businesslike|institutional|conservative|sober|grown up|mature", {
  kind: "trait", tag: "Professional", w: 1.1, hue: 245, hw: 0.3,
  dims: { playful: -0.9, energy: -0.4, vibrancy: -0.3, roundness: -0.3, contrast: 0.35 },
  font: { grotesk: 0.8, humanist: 0.6 }, harmony: { analogous: 0.8, monochrome: 0.4 },
  adjectives: ["Steady", "Measured", "Noble"],
});
def("corporate|enterprise|business", {
  kind: "trait", tag: "Corporate", hue: 245, hw: 0.5,
  dims: { playful: -0.7, contrast: 0.35, density: 0.3, vibrancy: -0.2, roundness: -0.2 },
  font: { grotesk: 1 }, harmony: { analogous: 0.8 }, adjectives: ["Steady", "Measured"],
});
def("trustworthy|trusted|trust|reliable|dependable|secure|safe|stable|credible|honest|transparent", {
  kind: "trait", tag: "Trustworthy", w: 1.1, hue: 245, hw: 0.8,
  dims: { vibrancy: -0.2, contrast: 0.35, energy: -0.3, playful: -0.3 },
  font: { humanist: 0.6, grotesk: 0.6 }, harmony: { analogous: 0.6 },
  adjectives: ["Steady", "True", "Anchored"], nouns: ["Anchor", "Harbor", "Keystone"],
});
def("modern|contemporary|sleek|current|fresh take|new|next|forward", {
  kind: "trait", tag: "Modern",
  dims: { contrast: 0.2, roundness: 0.1, depth: -0.1 },
  font: { geometric: 1, grotesk: 0.8 }, harmony: { split: 0.3 }, adjectives: ["Modern", "Vector", "Linear"],
});
def("minimal|minimalist|minimalism|simple|understated|restrained|essential|essentials|bare|less is more|uncluttered", {
  kind: "trait", tag: "Minimal", w: 1.1,
  dims: { vibrancy: -0.45, density: -0.35, depth: -0.5, contrast: 0.2, energy: -0.3 },
  font: { grotesk: 1, geometric: 0.5 }, harmony: { monochrome: 1, analogous: 0.5 },
  adjectives: ["Quiet", "Pale", "Linear", "Bare"],
});
def("clean|crisp|tidy|neat|polished", {
  kind: "trait", tag: "Clean",
  dims: { depth: -0.3, density: -0.3, vibrancy: -0.1, contrast: 0.2 },
  font: { grotesk: 0.7, geometric: 0.6 }, harmony: { analogous: 0.3 },
});
def("elegant|elegance|refined|sophisticated|graceful|classy|tasteful|chic|stylish|poised|cultured", {
  kind: "trait", tag: "Elegant", w: 1.2,
  dims: { elegance: 1, vibrancy: -0.3, roundness: -0.25, density: -0.45, energy: -0.3 },
  font: { editorial: 1, luxury: 0.8 }, harmony: { monochrome: 0.6, analogous: 0.5 }, vibes: ["classic"],
  adjectives: ["Velvet", "Satin", "Opal", "Gilded", "Silken"],
});
def("retro|nostalgic|nostalgia|old school|throwback|groovy|disco", {
  kind: "trait", tag: "Retro", w: 1.1, hue: 40, hw: 0.5,
  dims: { warmth: 0.6, vibrancy: 0.15, roundness: 0.25, playful: 0.3 },
  font: { editorial: 0.6, geometric: 0.4, rounded: 0.4 }, harmony: { complementary: 0.6, triadic: 0.3 }, vibes: ["retro"],
  adjectives: ["Groovy", "Analog", "Faded"],
});
def("vintage|antique|heritage|old world|aged|patina|weathered", {
  kind: "trait", tag: "Vintage", w: 1.1, hue: 55, hw: 0.5,
  dims: { warmth: 0.7, vibrancy: -0.45, elegance: 0.3 },
  font: { editorial: 1.1 }, harmony: { analogous: 0.7 }, vibes: ["retro", "classic"],
  adjectives: ["Faded", "Antique", "Sepia", "Weathered"],
});
def("classic|timeless|traditional|established|iconic|enduring", {
  kind: "trait", tag: "Timeless",
  dims: { vibrancy: -0.3, elegance: 0.5, energy: -0.4, contrast: 0.2 },
  font: { editorial: 1.1, humanist: 0.3 }, harmony: { analogous: 0.5, monochrome: 0.3 }, vibes: ["classic"],
  adjectives: ["Noble", "Classic", "Storied"],
});
def("80s|eighties|synthwave|retrowave|outrun|vaporwave", {
  kind: "style", tag: "Synthwave", w: 1.3, hue: 320, hw: 1.2, accentHue: 200,
  dims: { vibrancy: 1, dark: 0.85, energy: 0.7, contrast: 0.5, depth: 0.4 },
  font: { geometric: 1, technical: 0.4 }, harmony: { complementary: 1 }, vibes: ["retro", "futuristic"],
  adjectives: ["Neon", "Electric", "Chrome"], nouns: ["Arcade", "Boulevard", "Mixtape"],
});
def("70s|seventies", {
  kind: "style", tag: "70s", hue: 50, hw: 1, accentHue: 25,
  dims: { warmth: 0.95, vibrancy: 0.1, roundness: 0.5, playful: 0.4 },
  font: { editorial: 0.8, rounded: 0.6 }, harmony: { analogous: 0.8 }, vibes: ["retro"], adjectives: ["Groovy", "Amber"],
});
def("90s|nineties|y2k", {
  kind: "style", tag: "Y2K", hue: 300, hw: 0.8, accentHue: 190,
  dims: { vibrancy: 0.75, playful: 0.7, energy: 0.6, glass: 0.4 },
  font: { geometric: 0.8, rounded: 0.4 }, harmony: { triadic: 0.6, complementary: 0.4 }, vibes: ["retro", "futuristic"],
  adjectives: ["Chrome", "Pixel", "Holo"],
});
def("futuristic|future|futurism|scifi|sci fi|science fiction|cyber|high tech|hightech|next gen|space age|innovative|cutting edge|visionary", {
  kind: "trait", tag: "Futuristic", w: 1.2, hue: 280, hw: 0.4,
  dims: { dark: 0.75, vibrancy: 0.55, contrast: 0.5, depth: 0.3, roundness: -0.1, energy: 0.4 },
  font: { geometric: 1, technical: 0.6 }, harmony: { complementary: 0.6, split: 0.4 }, vibes: ["futuristic"],
  adjectives: ["Quantum", "Holo", "Ionic", "Chrome"],
});
def("cozy|cosy|homey|homely|comfortable|comfy|snug|hygge|inviting|wholesome", {
  kind: "trait", tag: "Cozy", w: 1.1, hue: 45, hw: 0.6,
  dims: { warmth: 1, vibrancy: -0.3, roundness: 0.5, energy: -0.4, contrast: -0.3, dark: -0.15 },
  font: { humanist: 0.8, editorial: 0.6, rounded: 0.4 }, harmony: { analogous: 1 }, vibes: ["soft", "organic"],
  adjectives: ["Toasted", "Honeyed", "Snug", "Hearth"], nouns: ["Hearth", "Nook", "Cabin"],
});
def("energetic|energizing|energising|dynamic|lively|exciting|excited|active|upbeat|punchy|spirited|hype", {
  kind: "trait", tag: "Energetic", w: 1.1, hue: 25, hw: 0.3,
  dims: { energy: 1, vibrancy: 0.7, contrast: 0.4, playful: 0.3 },
  font: { geometric: 0.8, grotesk: 0.6 }, harmony: { complementary: 1, triadic: 0.5 }, vibes: ["bold"],
  adjectives: ["Kinetic", "Vivid", "Electric", "Radiant"],
});
def("friendly|approachable|welcoming|human|humane|caring|empathetic|warmhearted|warm hearted|inclusive|personable|neighborly", {
  kind: "trait", tag: "Friendly", w: 1.1, hue: 30, hw: 0.3,
  dims: { roundness: 0.7, warmth: 0.5, playful: 0.4, contrast: -0.1 },
  font: { rounded: 0.8, humanist: 0.8, geometric: 0.4 }, harmony: { analogous: 0.4, complementary: 0.4 },
  adjectives: ["Sunny", "Kindly", "Merry", "Gentle"],
});
def("organic|natural|nature|earthy|earth|raw|handmade|handcrafted|artisanal|artisan|crafted|rustic|grounded", {
  kind: "trait", tag: "Organic", w: 1.1, hue: 90, hw: 0.5,
  dims: { warmth: 0.7, vibrancy: -0.5, roundness: 0.4, contrast: -0.1 },
  font: { humanist: 0.8, editorial: 0.6 }, harmony: { analogous: 1 }, vibes: ["organic"],
  adjectives: ["Earthen", "Rustic", "Wild", "Mossy"], nouns: ["Terra", "Grove", "Clay"],
});
def("technical|tech|technological|engineered|precise|precision|systematic|scientific method|analytical|rigorous", {
  kind: "trait", tag: "Technical", w: 1.1, hue: 250, hw: 0.3,
  dims: { density: 0.5, contrast: 0.4, roundness: -0.4, playful: -0.45 },
  font: { technical: 1.2, grotesk: 0.8 }, vibes: ["tech"],
  adjectives: ["Binary", "Vector", "Signal", "Modular", "Atomic"],
});
def("warm|warmth|toasty|sunlit|golden hour", {
  kind: "trait", tag: "Warm", w: 1.1, hue: 45, hw: 0.8, dims: { warmth: 1, tone: 0.05 },
  adjectives: ["Ember", "Golden", "Sunlit", "Honeyed"],
});
def("cool|cold|icy|chilly|frosty", {
  kind: "trait", tag: "Cool", w: 1.1, hue: 225, hw: 0.8, dims: { warmth: -1 },
  adjectives: ["Frosted", "Glacial", "Polar", "Silver"],
});
def("dark|darkmode|dark mode|moody|nocturnal|night|nighttime|noir|dim|shadowy|gothic|goth", {
  kind: "trait", tag: "Dark", w: 1.1, hue: 270, hw: 0.2,
  dims: { dark: 1, depth: 0.3, contrast: 0.2, tone: -0.2 },
  adjectives: ["Midnight", "Obsidian", "Shadow", "Nocturne", "Onyx"],
});
def("light|lightmode|light mode|airy|breezy|bright and airy|open|daylight|white space|whitespace", {
  kind: "trait", tag: "Airy", w: 1.1,
  dims: { dark: -1, density: -0.6, depth: -0.2, contrast: -0.1, tone: 0.15 },
  adjectives: ["Airy", "Pale", "Morning", "Cloud", "Feather"],
});
def("spacious|roomy|generous|breathable|breathing room|open space", {
  kind: "trait", tag: "Spacious", dims: { density: -1 }, adjectives: ["Airy", "Open"],
});
def("compact|dense|data dense|information dense|efficient|tight|condensed|power user|power users", {
  kind: "trait", tag: "Compact", dims: { density: 1, roundness: -0.2 }, font: { grotesk: 0.6, technical: 0.4 },
});
def("neon|fluorescent|glowing|glow|luminous|electric|laser|acid", {
  kind: "trait", tag: "Neon", w: 1.2,
  dims: { vibrancy: 1, dark: 0.8, contrast: 0.55, energy: 0.6, depth: 0.2 },
  harmony: { complementary: 0.7 }, vibes: ["futuristic"], adjectives: ["Neon", "Electric", "Laser", "Glowing"],
});
def("pastel|pastels|powdery|dreamy|delicate|candy colored|soft colors", {
  kind: "trait", tag: "Pastel", w: 1.2,
  dims: { tone: 0.85, vibrancy: -0.35, dark: -0.65, roundness: 0.45, playful: 0.3, contrast: -0.45 },
  harmony: { analogous: 0.5, triadic: 0.4 }, vibes: ["soft"], adjectives: ["Pastel", "Powder", "Dreamy", "Cotton"],
});
def("soft|softly|subtle|mellow|muted tones|low key|lowkey", {
  kind: "trait", tag: "Soft",
  dims: { contrast: -0.5, roundness: 0.5, vibrancy: -0.3, depth: -0.2, energy: -0.3 },
  vibes: ["soft"], adjectives: ["Soft", "Hushed", "Gentle"],
});
def("deep|rich|jewel|jewel tones|jewel toned|saturated deep|luxe", {
  kind: "trait", tag: "Rich",
  dims: { tone: -0.6, vibrancy: 0.35, dark: 0.35, elegance: 0.25 },
  adjectives: ["Velvet", "Deep", "Royal", "Opulent"],
});
def("muted|desaturated|subdued|dusty|faded|washed|washed out|toned down|greyish|grayish|understated colors|calm colors", {
  kind: "trait", tag: "Muted", w: 1.2, dims: { vibrancy: -1, energy: -0.2 }, harmony: { analogous: 0.5 },
  adjectives: ["Dusty", "Faded", "Muted", "Smoked"],
});
def("vibrant|vivid|saturated|colorful|colourful|bright|rainbow|poppy|loud colors|juicy", {
  kind: "trait", tag: "Vibrant", w: 1.2,
  dims: { vibrancy: 1, energy: 0.4, dark: -0.1 },
  harmony: { triadic: 0.6, complementary: 0.5 }, adjectives: ["Vivid", "Radiant", "Vibrant", "Prism"],
});
def("brutalist|brutalism|brutal|stark|blocky|utilitarian|raw brutalist|neobrutalism|neo brutalism|neubrutalism", {
  kind: "style", tag: "Brutalist", w: 1.6,
  dims: { roundness: -1, contrast: 1, depth: 0.5, vibrancy: 0.4, density: 0.25, elegance: -0.5 },
  font: { technical: 1.2, grotesk: 1 }, harmony: { complementary: 1, monochrome: 0.25 }, vibes: ["brutal", "bold"],
  adjectives: ["Raw", "Concrete", "Blunt", "Iron"], nouns: ["Monolith", "Concrete", "Block", "Slab"],
});
def("editorial|magazine|journalistic|literary|typographic|typography|bookish", {
  kind: "style", tag: "Editorial", w: 1.3,
  dims: { contrast: 0.55, vibrancy: -0.3, density: -0.2, roundness: -0.4, elegance: 0.4 },
  font: { editorial: 1.7 }, harmony: { monochrome: 0.7 }, vibes: ["classic"],
  adjectives: ["Inked", "Folio", "Serif"], nouns: ["Folio", "Column", "Press", "Margin"],
});
def("rebellious|rebel|edgy|punk|grunge|subversive|disruptive|irreverent|gritty|underground|anarchic|chaotic", {
  kind: "trait", tag: "Rebellious", w: 1.2, hue: 350, hw: 0.5,
  dims: { contrast: 0.85, energy: 0.7, vibrancy: 0.6, dark: 0.6, roundness: -0.65, elegance: -0.3 },
  font: { grotesk: 1, technical: 0.4 }, harmony: { complementary: 0.7 }, vibes: ["bold", "brutal"],
  adjectives: ["Feral", "Riot", "Static", "Wild"], nouns: ["Riot", "Static", "Anthem"],
});
def("aggressive|fierce|savage|ferocious|hardcore|extreme|intense energy|adrenaline|competitive edge", {
  kind: "trait", tag: "Aggressive", w: 1.1,
  dims: { energy: 1, contrast: 0.9, vibrancy: 0.7, roundness: -0.6, dark: 0.5, tone: -0.1 },
  font: { grotesk: 1, geometric: 0.4 }, harmony: { complementary: 0.8 }, vibes: ["bold"],
  adjectives: ["Fierce", "Savage", "Blazing"], nouns: ["Siege", "Fury", "Strike"],
});
def("senior|seniors|elderly|older adults|retirement|retirees|aging", {
  kind: "industry", tag: "Seniors", hue: 215, hw: 0.5,
  dims: { contrast: 0.9, density: -0.6, energy: -0.4, roundness: 0.3, dark: -0.6 },
  font: { humanist: 1.2 }, harmony: { analogous: 0.6 }, nouns: ["Haven", "Harbor", "Porch"],
});
def("glam|glamorous|glamour|glitz|glitzy|sparkle|sparkly|glitter", {
  kind: "trait", tag: "Glamorous", hue: 340, hw: 0.5, accentHue: 80,
  dims: { elegance: 0.7, vibrancy: 0.4, dark: 0.4, depth: 0.4 },
  font: { luxury: 0.9, editorial: 0.5 }, harmony: { complementary: 0.5 }, adjectives: ["Gilded", "Glimmer", "Starlit"],
});
def("nerdy|geeky|nerd|geek|hacky", {
  kind: "trait", tag: "Geeky", dims: { playful: 0.4, density: 0.4, roundness: -0.2 },
  font: { technical: 1, geometric: 0.3 }, vibes: ["tech", "retro"], adjectives: ["Binary", "Pixel"],
});
def("affordable|budget|accessible pricing|value|everyday|practical|honest pricing", {
  kind: "trait", tag: "Approachable", dims: { roundness: 0.3, warmth: 0.2, elegance: -0.3, playful: 0.2 },
  font: { geometric: 0.6, humanist: 0.4 },
});
def("sharp|angular|square|squared|pointed|hard edged|hard edges|edgy corners", {
  kind: "trait", tag: "Sharp", dims: { roundness: -1, contrast: 0.3 }, font: { grotesk: 0.4 },
});
def("geometric|grid|structured|architectural", {
  kind: "trait", tag: "Geometric", dims: { roundness: -0.25, contrast: 0.2 }, font: { geometric: 1.3, grotesk: 0.4 },
});
def("rounded|round|curvy|pill|pills|smooth|soft corners|bubbly|squishy|pillowy|organic shapes", {
  kind: "trait", tag: "Rounded", dims: { roundness: 1, playful: 0.2 }, font: { rounded: 0.6, geometric: 0.3 },
});
def("dramatic|theatrical|cinematic|epic|grand|majestic", {
  kind: "trait", tag: "Dramatic", w: 1.1,
  dims: { depth: 0.8, contrast: 0.7, dark: 0.6, elegance: 0.3, tone: -0.2 },
  font: { editorial: 0.5, luxury: 0.4 }, harmony: { complementary: 0.4 }, adjectives: ["Epic", "Grand", "Midnight"],
});
def("flat|flat design|2d", {
  kind: "style", tag: "Flat", dims: { depth: -1 }, font: { geometric: 0.4 },
});
def("layered|depth|elevated|elevation|3d|tactile|skeuomorphic|skeuomorphism|material", {
  kind: "style", tag: "Layered", dims: { depth: 0.75, roundness: 0.2 },
});
def("glass|glassy|glassmorphism|frosted|translucent|blur|blurry|acrylic", {
  kind: "style", tag: "Glassy", w: 1.1, dims: { glass: 1, depth: 0.45, roundness: 0.45, dark: 0.3, vibrancy: 0.2 },
  vibes: ["glass", "futuristic"], adjectives: ["Frosted", "Prism", "Crystal"],
});
def("gradient|gradients|ombre|holographic|iridescent", {
  kind: "style", tag: "Gradient", dims: { vibrancy: 0.3, depth: 0.2, energy: 0.2 }, harmony: { analogous: 0.5, split: 0.3 },
});
def("shadow|shadows|drop shadow|drop shadows", { kind: "style", dims: { depth: 0.6 } });
def("youthful|young|gen z|genz|teen|teens|students life", {
  kind: "trait", tag: "Youthful", dims: { vibrancy: 0.6, playful: 0.6, energy: 0.6, roundness: 0.4 },
  font: { geometric: 0.8, rounded: 0.3 }, harmony: { triadic: 0.5 }, adjectives: ["Zesty", "Fresh", "Peppy"],
});
def("quirky|weird|eclectic|funky|offbeat|zany|kooky|memphis|maximalist|maximalism", {
  kind: "trait", tag: "Quirky", w: 1.1,
  dims: { playful: 0.85, vibrancy: 0.65, energy: 0.5 },
  font: { rounded: 0.4, editorial: 0.4, geometric: 0.4 }, harmony: { triadic: 1 }, vibes: ["retro"],
  adjectives: ["Zany", "Funky", "Kooky"],
});
def("accessible|accessibility|a11y|readable|legible|high contrast|high-contrast|inclusive design", {
  kind: "trait", tag: "Accessible", w: 1.1, dims: { contrast: 1 }, font: { humanist: 1 },
});
def("low contrast|soft contrast|subtle contrast", { kind: "trait", tag: "Low Contrast", dims: { contrast: -0.9 } });
def("fast|quick|speed|speedy|instant|snappy|agile|rapid|swift", {
  kind: "trait", tag: "Fast", dims: { energy: 0.7, roundness: -0.1 }, font: { grotesk: 0.5, geometric: 0.5 },
  adjectives: ["Swift", "Kinetic", "Rapid"],
});
def("relaxed|laid back|laidback|chill|easygoing|easy going|carefree|leisurely", {
  kind: "trait", tag: "Relaxed", dims: { energy: -0.6, warmth: 0.3, roundness: 0.35 }, harmony: { analogous: 0.6 },
  adjectives: ["Mellow", "Lazy", "Breezy"],
});
def("royal|regal|majesty|imperial|noble|aristocratic", {
  kind: "trait", tag: "Regal", hue: 295, hw: 0.7, accentHue: 80,
  dims: { elegance: 0.8, tone: -0.4, dark: 0.4 },
  font: { luxury: 0.9, editorial: 0.6 }, harmony: { complementary: 0.6 }, vibes: ["classic"],
  adjectives: ["Regal", "Royal", "Imperial"],
});
def("smart|intelligent|clever|insightful", {
  kind: "trait", tag: "Smart", hue: 265, hw: 0.3, dims: { contrast: 0.2 }, font: { geometric: 0.6, grotesk: 0.4 },
});
def("optimistic|hopeful|positive|uplifting|joy|sunny|sunshine|radiant", {
  kind: "trait", tag: "Optimistic", hue: 70, hw: 0.5,
  dims: { warmth: 0.6, vibrancy: 0.5, dark: -0.6, energy: 0.3, tone: 0.2 },
  harmony: { complementary: 0.4, triadic: 0.3 }, adjectives: ["Sunny", "Radiant", "Golden", "Bright"],
});
def("mysterious|mystery|mystic|mystical|magical|magic|enchanted|occult|arcane|witchy", {
  kind: "trait", tag: "Mystical", w: 1.1, hue: 295, hw: 0.8,
  dims: { dark: 0.85, vibrancy: 0.3, elegance: 0.3, depth: 0.4 },
  font: { editorial: 0.6, luxury: 0.5 }, harmony: { analogous: 0.6 }, adjectives: ["Arcane", "Mystic", "Twilight", "Velvet"],
  nouns: ["Oracle", "Grimoire", "Veil"],
});
def("fresh|crisp air|clean energy feel|refreshing|zesty|zingy", {
  kind: "trait", tag: "Fresh", hue: 160, hw: 0.4, dims: { vibrancy: 0.35, dark: -0.45, tone: 0.15, energy: 0.2 },
  adjectives: ["Fresh", "Zesty", "Crisp"],
});
def("clinical|sterile|hygienic|pure|purity", {
  kind: "trait", tag: "Clinical", hue: 210, hw: 0.5, dims: { dark: -0.85, vibrancy: -0.3, warmth: -0.45, contrast: 0.2 },
  font: { humanist: 0.6, grotesk: 0.6 },
});
def("scandinavian|nordic|scandi|japandi|wabi sabi|danish|swedish", {
  kind: "style", tag: "Scandinavian", w: 1.2, hue: 70, hw: 0.3,
  dims: { vibrancy: -0.65, warmth: 0.25, density: -0.6, roundness: 0.1, contrast: -0.1, depth: -0.4, dark: -0.5 },
  font: { grotesk: 0.7, humanist: 0.6, geometric: 0.4 }, harmony: { monochrome: 0.9, analogous: 0.4 }, vibes: ["organic"],
  adjectives: ["Pale", "Birch", "Nordic", "Linen"], nouns: ["Fjord", "Birch", "Linen", "Hygge"],
});
def("swiss|international style|bauhaus|modernist|modernism|helvetica", {
  kind: "style", tag: "Swiss", w: 1.2, hue: 25, hw: 0.4, accentHue: 85,
  dims: { roundness: -0.7, contrast: 0.7, density: 0.1 },
  font: { grotesk: 1.5 }, harmony: { triadic: 0.5, monochrome: 0.4 }, adjectives: ["Modular", "Linear", "Grid"],
});
def("art deco|deco|gatsby|roaring twenties|1920s", {
  kind: "style", tag: "Art Deco", w: 1.2, hue: 80, hw: 0.8,
  dims: { elegance: 0.85, dark: 0.65, contrast: 0.5, roundness: -0.4 },
  font: { luxury: 1.2, editorial: 0.4 }, harmony: { complementary: 0.6 }, vibes: ["classic"],
  adjectives: ["Gilded", "Brass", "Jazz"], nouns: ["Ballroom", "Gala", "Salon"],
});
def("monochrome|monochromatic|black and white|black & white|greyscale|grayscale|mono|single color|one color|colorless", {
  kind: "style", tag: "Monochrome", w: 1.4,
  dims: { vibrancy: -1, contrast: 0.4 }, font: { grotesk: 0.6 }, harmony: { monochrome: 2 },
  adjectives: ["Graphite", "Ink", "Slate", "Charcoal"], nouns: ["Ink", "Monolith", "Graphite"],
});
def("pixel|pixels|8 bit|8bit|16 bit|retro game|retro gaming|chiptune", {
  kind: "style", tag: "Pixel", w: 1.2, hue: 300, hw: 0.3,
  dims: { roundness: -1, vibrancy: 0.85, playful: 0.5, dark: 0.6 },
  font: { technical: 1.4 }, harmony: { triadic: 0.8 }, vibes: ["retro", "tech"], adjectives: ["Pixel", "Arcade", "Retro"],
});
def("feminine|girly|delicate touch", {
  kind: "trait", tag: "Graceful", hue: 350, hw: 0.4, dims: { roundness: 0.5, warmth: 0.3, tone: 0.3 },
  font: { editorial: 0.5, rounded: 0.3 },
});
def("masculine|rugged|tough|robust|sturdy|heavy duty", {
  kind: "trait", tag: "Rugged", dims: { roundness: -0.4, contrast: 0.45, dark: 0.3, vibrancy: -0.2 },
  font: { grotesk: 0.9 }, vibes: ["bold"], adjectives: ["Iron", "Granite", "Rugged"],
});
def("urban|city|metropolitan|metropolis|street|downtown|concrete jungle", {
  kind: "imagery", tag: "Urban", dims: { contrast: 0.5, vibrancy: 0.1, dark: 0.4 },
  font: { grotesk: 1 }, adjectives: ["Concrete", "Metro", "Asphalt"], nouns: ["Avenue", "District", "Metro", "Skyline"],
});

// Imagery and nature
def("ocean|sea|seas|marine|maritime|underwater|deep sea|aquatic|nautical", {
  kind: "imagery", tag: "Oceanic", w: 1.2, hue: 228, hw: 1.6,
  dims: { warmth: -0.45, tone: -0.15, vibrancy: 0.1 }, harmony: { analogous: 0.7 },
  adjectives: ["Abyssal", "Tidal", "Cobalt", "Marine"], nouns: ["Tide", "Harbor", "Reef", "Current", "Depth"],
});
def("wave|waves|surf|surfing|tide|tides|harbor|harbour|bay|cove", {
  kind: "imagery", tag: "Coastal", hue: 215, hw: 1.2, dims: { warmth: -0.2, energy: 0.2 }, harmony: { analogous: 0.5 },
  nouns: ["Tide", "Harbor", "Cove", "Swell"],
});
def("beach|coastal|coast|seaside|shore|island|islands", {
  kind: "imagery", tag: "Coastal", hue: 205, hw: 1.2, accentHue: 70,
  dims: { warmth: 0.25, dark: -0.5, vibrancy: 0.2, tone: 0.2 }, harmony: { complementary: 0.6 },
  adjectives: ["Sunlit", "Salty", "Breezy"], nouns: ["Shore", "Cove", "Dune", "Lagoon"],
});
def("tropical|tropics|paradise|palm|palms|caribbean|hawaii|hawaiian", {
  kind: "imagery", tag: "Tropical", w: 1.1, hue: 178, hw: 1.3, accentHue: 25,
  dims: { warmth: 0.45, vibrancy: 0.7, playful: 0.45, dark: -0.4 }, harmony: { complementary: 1 },
  adjectives: ["Tropic", "Lush", "Sunlit"], nouns: ["Lagoon", "Palm", "Reef", "Mango"],
});
def("lagoon|reef|coral reef|atoll", {
  kind: "imagery", tag: "Lagoon", hue: 190, hw: 1.3, accentHue: 25, dims: { vibrancy: 0.4 }, harmony: { complementary: 0.7 },
  nouns: ["Lagoon", "Reef", "Atoll"],
});
def("forest|forests|woods|woodland|woodlands|jungle|rainforest|evergreen|grove|timber|wilderness", {
  kind: "imagery", tag: "Forest", w: 1.2, hue: 152, hw: 1.6,
  dims: { warmth: 0.1, vibrancy: -0.2, dark: 0.3, tone: -0.6 }, harmony: { analogous: 0.7 }, vibes: ["organic"],
  adjectives: ["Mossy", "Verdant", "Wild", "Woodland"], nouns: ["Grove", "Canopy", "Fern", "Thicket", "Pine"],
});
def("leaf|leaves|fern|ferns|botany|herbal|herb|herbs|tea leaf", {
  kind: "imagery", tag: "Botanical", hue: 140, hw: 1.2, dims: { warmth: 0.2, vibrancy: -0.1 }, vibes: ["organic"],
  nouns: ["Fern", "Sprig", "Leaf"],
});
def("sunset|sunsets|dusk|evening|golden sky", {
  kind: "imagery", tag: "Sunset", w: 1.2, hue: 42, hw: 1.6, accentHue: 350,
  dims: { warmth: 0.85, vibrancy: 0.5, energy: 0.2 }, harmony: { analogous: 0.9 },
  adjectives: ["Ember", "Amber", "Burnished", "Sunlit"], nouns: ["Horizon", "Dusk", "Ember", "Afterglow"],
});
def("sunrise|dawn|morning|daybreak", {
  kind: "imagery", tag: "Dawn", hue: 35, hw: 1.3, accentHue: 330,
  dims: { warmth: 0.7, dark: -0.5, tone: 0.35, vibrancy: 0.2 }, harmony: { analogous: 0.8 },
  adjectives: ["Morning", "Rosy", "Early"], nouns: ["Dawn", "Daybreak", "Horizon"],
});
def("twilight|dusky|blue hour|nightfall", {
  kind: "imagery", tag: "Twilight", hue: 285, hw: 1.3, accentHue: 35,
  dims: { dark: 0.6, vibrancy: 0.2 }, harmony: { complementary: 0.6 }, adjectives: ["Dusky", "Twilight", "Violet"],
  nouns: ["Dusk", "Vesper", "Twilight"],
});
def("desert|deserts|dune|dunes|sahara|canyon|canyons|mesa|arid|southwest", {
  kind: "imagery", tag: "Desert", w: 1.1, hue: 55, hw: 1.4, accentHue: 30,
  dims: { warmth: 0.85, vibrancy: -0.25, dark: -0.2 }, harmony: { analogous: 0.8 }, vibes: ["organic"],
  adjectives: ["Sunbaked", "Dusty", "Amber", "Sandy"], nouns: ["Dune", "Mesa", "Canyon", "Oasis", "Mirage"],
});
def("midnight|night sky|nightsky|moon|moonlight|moonlit|lunar|stars|starry|starlight|celestial", {
  kind: "imagery", tag: "Midnight", w: 1.2, hue: 272, hw: 1.4, accentHue: 85,
  dims: { dark: 1, vibrancy: -0.1, tone: -0.35, depth: 0.3 }, harmony: { complementary: 0.4, monochrome: 0.4 },
  adjectives: ["Midnight", "Lunar", "Starlit", "Velvet"], nouns: ["Midnight", "Eclipse", "Nocturne", "Orbit"],
});
def("aurora|northern lights|borealis|aurora borealis", {
  kind: "imagery", tag: "Aurora", w: 1.3, hue: 168, hw: 1.6, accentHue: 295,
  dims: { dark: 0.8, vibrancy: 0.7, energy: 0.3, glass: 0.3 }, harmony: { split: 1 }, vibes: ["futuristic"],
  adjectives: ["Polar", "Luminous", "Shimmering"], nouns: ["Aurora", "Borealis", "Veil", "Lumen"],
});
def("galaxy|galaxies|cosmic|cosmos|nebula|universe|space|stellar|interstellar|astral", {
  kind: "imagery", tag: "Cosmic", w: 1.2, hue: 290, hw: 1.3, accentHue: 200,
  dims: { dark: 0.95, vibrancy: 0.6, depth: 0.45, energy: 0.2 }, harmony: { split: 0.8 }, vibes: ["futuristic"],
  adjectives: ["Cosmic", "Stellar", "Astral", "Nebular"], nouns: ["Nebula", "Orbit", "Quasar", "Zenith"],
});
def("fire|flame|flames|blaze|inferno|volcano|volcanic|lava|magma|ember|embers|heat", {
  kind: "imagery", tag: "Fiery", w: 1.2, hue: 35, hw: 1.5,
  dims: { energy: 0.8, vibrancy: 0.85, warmth: 1, dark: 0.45 }, harmony: { analogous: 0.8 }, vibes: ["bold"],
  adjectives: ["Blazing", "Molten", "Ember", "Scorched"], nouns: ["Ember", "Forge", "Flare", "Kiln", "Ignite"],
});
def("ice|glacier|glaciers|arctic|antarctic|frost|frozen|snow|snowy|winter|polar|tundra|alpine", {
  kind: "imagery", tag: "Arctic", w: 1.1, hue: 225, hw: 1.3,
  dims: { warmth: -1, vibrancy: -0.3, dark: -0.35, tone: 0.2 }, harmony: { analogous: 0.8, monochrome: 0.3 },
  adjectives: ["Glacial", "Frosted", "Polar", "Arctic"], nouns: ["Glacier", "Fjord", "Frost", "Tundra"],
});
def("autumn|fall|harvest moon|pumpkin|maple|october", {
  kind: "imagery", tag: "Autumn", w: 1.1, hue: 48, hw: 1.5, accentHue: 25,
  dims: { warmth: 1, vibrancy: 0.15, tone: -0.2 }, harmony: { analogous: 0.9 }, vibes: ["organic"],
  adjectives: ["Russet", "Amber", "Burnished", "Copper"], nouns: ["Harvest", "Orchard", "Maple", "Hearth"],
});
def("spring|springtime|blossom|blossoms|bloom|blooming|meadow|meadows|easter", {
  kind: "imagery", tag: "Spring", hue: 140, hw: 1.2, accentHue: 345,
  dims: { dark: -0.6, tone: 0.3, vibrancy: 0.3, playful: 0.2 }, harmony: { complementary: 0.6 },
  adjectives: ["Verdant", "Dewy", "Blooming"], nouns: ["Meadow", "Blossom", "Sprout", "Bloom"],
});
def("cherry blossom|cherry blossoms|sakura|hanami", {
  kind: "imagery", tag: "Sakura", w: 1.2, hue: 355, hw: 1.6, accentHue: 150,
  dims: { tone: 0.55, dark: -0.6, vibrancy: -0.1, elegance: 0.35 }, harmony: { analogous: 0.6 }, vibes: ["soft"],
  adjectives: ["Blush", "Petal", "Rosy"], nouns: ["Blossom", "Petal", "Sakura"],
});
def("summer|summertime|sun|citrus|lemonade|poolside", {
  kind: "imagery", tag: "Summer", hue: 75, hw: 1.2, accentHue: 200,
  dims: { warmth: 0.8, vibrancy: 0.7, energy: 0.6, dark: -0.55, playful: 0.3 }, harmony: { complementary: 0.7 },
  adjectives: ["Sunny", "Golden", "Zesty"], nouns: ["Sun", "Citrus", "Shore", "Lemonade"],
});
def("storm|stormy|thunder|thunderstorm|rain|rainy|monsoon", {
  kind: "imagery", tag: "Stormy", hue: 235, hw: 1.1,
  dims: { dark: 0.6, vibrancy: -0.4, contrast: 0.3, warmth: -0.4 }, harmony: { monochrome: 0.5, analogous: 0.4 },
  adjectives: ["Stormy", "Slate", "Brooding"], nouns: ["Tempest", "Squall", "Thunder"],
});
def("fog|foggy|mist|misty|haze|hazy|smoke|smoky|clouds|cloudy", {
  kind: "imagery", tag: "Misty", hue: 225, hw: 0.4,
  dims: { vibrancy: -0.8, contrast: -0.5, dark: -0.2, roundness: 0.25 }, harmony: { monochrome: 0.7 }, vibes: ["soft"],
  adjectives: ["Misty", "Hazy", "Smoked", "Cloud"], nouns: ["Fog", "Mist", "Haze", "Vapor"],
});
def("mountain|mountains|summit|peak|peaks|highland|highlands|ridge", {
  kind: "imagery", tag: "Alpine", hue: 220, hw: 0.9, accentHue: 30,
  dims: { warmth: -0.3, contrast: 0.35 }, harmony: { complementary: 0.4 },
  adjectives: ["Alpine", "Granite", "Lofty"], nouns: ["Summit", "Ridge", "Peak", "Crest"],
});
def("river|rivers|lake|lakes|water|waterfall|stream|spring water", {
  kind: "imagery", tag: "Water", hue: 212, hw: 1.1, dims: { warmth: -0.3, energy: -0.1 },
  nouns: ["Stream", "Current", "Delta", "Brook"],
});
def("stone|granite|concrete|cement|slab", {
  kind: "imagery", tag: "Concrete", hue: 70, hw: 0.2,
  dims: { vibrancy: -0.9, roundness: -0.4, contrast: 0.2 }, font: { grotesk: 0.6 }, harmony: { monochrome: 0.7 },
  adjectives: ["Granite", "Concrete", "Ashen"], nouns: ["Monolith", "Slab", "Quarry"],
});
def("marble|alabaster|porcelain|linen|paper", {
  kind: "imagery", tag: "Paper", hue: 75, hw: 0.2,
  dims: { dark: -0.8, vibrancy: -0.6, elegance: 0.4, warmth: 0.3 }, font: { editorial: 0.6 }, harmony: { monochrome: 0.6 },
  adjectives: ["Ivory", "Linen", "Pale"], nouns: ["Folio", "Linen", "Plinth"],
});
def("ink|letterpress|print|stationery", {
  kind: "imagery", tag: "Ink", dims: { vibrancy: -0.6, contrast: 0.5 }, font: { editorial: 0.8 }, harmony: { monochrome: 0.6 },
  nouns: ["Ink", "Press", "Quill"],
});
def("cyberpunk|cyber punk|blade runner|neon city|city lights|night city|tokyo nights", {
  kind: "style", tag: "Cyberpunk", w: 1.4, hue: 340, hw: 1.4, accentHue: 195,
  dims: { dark: 1, vibrancy: 1, energy: 0.8, contrast: 0.6, depth: 0.4, roundness: -0.35 },
  font: { technical: 0.9, geometric: 0.6 }, harmony: { complementary: 1 }, vibes: ["futuristic", "tech"],
  adjectives: ["Neon", "Chrome", "Electric", "Static"], nouns: ["District", "Circuit", "Grid", "Signal"],
});
def("candy|bubblegum|sweet|sweets|ice cream|cupcake|lollipop|sugar", {
  kind: "imagery", tag: "Sweet", w: 1.1, hue: 345, hw: 1.2, accentHue: 190,
  dims: { tone: 0.5, vibrancy: 0.5, playful: 1, roundness: 0.85, dark: -0.7 }, harmony: { triadic: 0.6 },
  font: { rounded: 1 }, adjectives: ["Sugar", "Candy", "Bubbly"], nouns: ["Sprinkle", "Gumdrop", "Sundae"],
});
def("velvet|silk|satin|cashmere|plush", {
  kind: "imagery", tag: "Plush", hue: 340, hw: 0.4,
  dims: { elegance: 0.65, tone: -0.45, dark: 0.45, vibrancy: 0.1 }, font: { luxury: 0.6, editorial: 0.4 },
  adjectives: ["Velvet", "Satin", "Silken"], nouns: ["Velvet", "Silk", "Drape"],
});
def("metal|metallic|chrome|steel|industrial metal|titanium", {
  kind: "imagery", tag: "Metallic", hue: 240, hw: 0.3,
  dims: { vibrancy: -0.6, contrast: 0.5, depth: 0.4 }, font: { grotesk: 0.6, technical: 0.4 },
  adjectives: ["Chrome", "Steel", "Titanium"], nouns: ["Alloy", "Forge", "Anvil"],
});
def("earth tones|earth tone|terra|soil|mud|clay tones", {
  kind: "imagery", tag: "Earthy", hue: 55, hw: 1, dims: { warmth: 0.85, vibrancy: -0.55 }, harmony: { analogous: 1 },
  vibes: ["organic"], adjectives: ["Earthen", "Clay", "Umber"], nouns: ["Terra", "Clay", "Loam"],
});

const NEGATORS = new Set([
  "not", "no", "non", "without", "never", "avoid", "avoiding", "dont", "doesnt", "isnt", "arent",
  "nothing", "none", "zero", "minus", "anti", "nor", "lacking", "except", "ditch", "skip", "less",
]);
const NEGATION_PHRASES = ["instead of", "rather than", "anything but", "free of", "free from", "away from", "too much"];
const FILLERS = new Set([
  "too", "very", "overly", "so", "any", "a", "an", "the", "at", "all", "really", "be", "being", "much",
  "of", "that", "it", "way", "super", "remotely", "even", "particularly", "terribly", "excessively", "feel", "look", "looking",
]);

export function isNegator(token: string): boolean {
  return NEGATORS.has(token);
}

export function negationPhraseLength(tokens: string[], i: number): number {
  for (const phrase of NEGATION_PHRASES) {
    const parts = phrase.split(" ");
    if (parts.every((p, k) => tokens[i + k] === p)) return parts.length;
  }
  return 0;
}

export function isFiller(token: string): boolean {
  return FILLERS.has(token);
}

export const ACCENT_MARKERS = new Set(["accent", "accents", "accented", "highlight", "highlights", "pop", "pops", "details", "detail", "touches", "touch", "splash", "hint", "hints", "secondary"]);
export const ACCENT_LEADS = ["pop of", "pops of", "touch of", "touches of", "hint of", "hints of", "splash of", "splashes of", "accent of", "accents of", "accented with", "highlights of", "dash of"];
