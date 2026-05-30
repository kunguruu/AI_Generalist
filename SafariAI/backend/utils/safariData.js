export const LOCATION_COORDINATES = {
  nairobi: { lat: -1.286389, lng: 36.817223, region: "Nairobi" },
  westlands: { lat: -1.2676, lng: 36.8108, region: "Nairobi" },
  karen: { lat: -1.3197, lng: 36.7054, region: "Nairobi" },
  mombasa: { lat: -4.0435, lng: 39.6682, region: "Mombasa" },
  naivasha: { lat: -0.7167, lng: 36.4333, region: "Naivasha" },
  nakuru: { lat: -0.3031, lng: 36.08, region: "Nakuru" },
};

export const SAFARI_INTERESTS = [
  "food",
  "nature",
  "adventure",
  "history",
  "wellness",
  "culture",
  "wildlife",
];

export const SAFARI_CATEGORIES = [
  "all",
  "food",
  "nature",
  "adventure",
  "history",
  "wellness",
  "culture",
  "wildlife",
];

export const SAFARI_ACTIVITIES = [
  {
    id: "giraffe-centre",
    name: "Giraffe Centre",
    region: "Nairobi",
    locationLabel: "Lang'ata, Nairobi",
    coordinates: { lat: -1.3733, lng: 36.7449 },
    category: "wildlife",
    interests: ["nature", "wildlife", "education"],
    tags: ["educational", "fun", "healthy"],
    description: "A gentle wildlife stop where you can meet Rothschild giraffes at eye level.",
    longDescription: "Perfect for a half-day wander, the Giraffe Centre blends conservation, light walking, and delightfully memorable close encounters.",
    estimatedCostKes: 1500,
    durationHours: 2,
    foodCostKes: 900,
    bestTimeToVisit: "Early morning or late afternoon for cooler air and calmer crowds.",
    safetyTips: [
      "Keep valuables close in the parking area.",
      "Carry water and sun protection.",
      "Follow staff guidance during feeding sessions."
    ],
    culturalInsights: "The centre supports conservation education and gives context to Kenya's broader wildlife stewardship story.",
    imageUrls: [
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80"
    ],
    reviews: [
      { author: "Linet", rating: 5, text: "Warm staff, easy visit, and the giraffes are pure joy." },
      { author: "Sam", rating: 4, text: "Lovely quick stop, especially good when your schedule is tight." }
    ]
  },
  {
    id: "nairobi-national-park",
    name: "Nairobi National Park Game Drive",
    region: "Nairobi",
    locationLabel: "Lang'ata Road, Nairobi",
    coordinates: { lat: -1.3731, lng: 36.8588 },
    category: "adventure",
    interests: ["nature", "adventure", "wildlife"],
    tags: ["fun", "healthy", "photogenic"],
    description: "A surprisingly wild escape with skyline views and classic game-drive energy.",
    longDescription: "If your spirit wants a soft roar and open plains without leaving the city behind, this is the signature experience.",
    estimatedCostKes: 4800,
    durationHours: 4,
    foodCostKes: 1200,
    bestTimeToVisit: "Sunrise to mid-morning for animal sightings and gentler light.",
    safetyTips: [
      "Use a reputable guide or self-drive only on marked routes.",
      "Keep windows mostly up around wildlife.",
      "Pack a light jacket for early morning drives."
    ],
    culturalInsights: "This park is one of the world's rare wildlife reserves brushing right up against a major capital city.",
    imageUrls: [
      "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80"
    ],
    reviews: [
      { author: "Miriam", rating: 5, text: "The mix of city skyline and wildlife feels surreal in the best way." },
      { author: "Joseph", rating: 4, text: "Worth the budget if you want one memorable premium stop." }
    ]
  },
  {
    id: "karura-forest",
    name: "Karura Forest Trails",
    region: "Nairobi",
    locationLabel: "Limuru Road, Nairobi",
    coordinates: { lat: -1.2362, lng: 36.8312 },
    category: "nature",
    interests: ["nature", "wellness", "adventure"],
    tags: ["healthy", "fun", "peaceful"],
    description: "Forest walks, waterfalls, and cycling routes that feel like a deep exhale.",
    longDescription: "Karura is where Nairobi softens. It is ideal for reflective walks, easy rides, and that rare sense of space inside a busy week.",
    estimatedCostKes: 650,
    durationHours: 3,
    foodCostKes: 700,
    bestTimeToVisit: "Morning for cooler trails and brighter waterfall views.",
    safetyTips: [
      "Stay on marked trails.",
      "Wear comfortable walking shoes.",
      "Use official entrances and keep emergency contacts handy."
    ],
    culturalInsights: "Karura has become a symbol of urban conservation and citizen-led protection of green spaces.",
    imageUrls: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80"
    ],
    reviews: [
      { author: "Angela", rating: 5, text: "Fresh air, easy trails, and a real mental reset." },
      { author: "David", rating: 4, text: "Simple and affordable, especially when you want a calm day out." }
    ]
  },
  {
    id: "bomas-of-kenya",
    name: "Bomas of Kenya Cultural Experience",
    region: "Nairobi",
    locationLabel: "Lang'ata, Nairobi",
    coordinates: { lat: -1.3404, lng: 36.7615 },
    category: "culture",
    interests: ["history", "culture", "food"],
    tags: ["educational", "historical", "fun"],
    description: "Traditional architecture, dance, and cultural storytelling in one lively stop.",
    longDescription: "This is a rich way to meet Kenya's cultural diversity without racing across counties in a single day.",
    estimatedCostKes: 1800,
    durationHours: 3,
    foodCostKes: 1100,
    bestTimeToVisit: "Afternoons when cultural performances are active.",
    safetyTips: [
      "Arrive a little early for performance seating.",
      "Carry some cash for snacks or crafts.",
      "Stay with marked visitor areas."
    ],
    culturalInsights: "Bomas brings together traditional homestead designs and performance traditions from communities across Kenya.",
    imageUrls: [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80"
    ],
    reviews: [
      { author: "Ruth", rating: 4, text: "Colorful, informative, and easy to enjoy with family." },
      { author: "Ken", rating: 5, text: "A strong culture stop with a lot of energy." }
    ]
  },
  {
    id: "kazuri-beads",
    name: "Kazuri Beads Workshop Visit",
    region: "Nairobi",
    locationLabel: "Karen, Nairobi",
    coordinates: { lat: -1.3146, lng: 36.7198 },
    category: "history",
    interests: ["history", "culture", "wellness"],
    tags: ["educational", "historical", "local"],
    description: "A thoughtful artisan visit with craft, social impact, and a beautifully unrushed pace.",
    longDescription: "Kazuri offers a softer kind of tourism: intimate, handmade, and rooted in local creative labor.",
    estimatedCostKes: 1200,
    durationHours: 2,
    foodCostKes: 800,
    bestTimeToVisit: "Late morning for guided tours and quieter browsing.",
    safetyTips: [
      "Bring a light layer in case of cool weather.",
      "Ask before photographing work areas.",
      "Use card or cash depending on the shop desk available."
    ],
    culturalInsights: "The workshop is well known for supporting women artisans through ceramics and beadwork.",
    imageUrls: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80"
    ],
    reviews: [
      { author: "Njeri", rating: 5, text: "Calm, meaningful, and full of beautiful detail." },
      { author: "Paul", rating: 4, text: "A lovely slower-paced stop between bigger attractions." }
    ]
  },
  {
    id: "nyama-mama",
    name: "Nyama Mama Food Safari",
    region: "Nairobi",
    locationLabel: "Westlands, Nairobi",
    coordinates: { lat: -1.2677, lng: 36.8031 },
    category: "food",
    interests: ["food", "culture"],
    tags: ["fun", "local", "social"],
    description: "A modern Kenyan dining stop for flavor explorers and comfort-food loyalists alike.",
    longDescription: "When your itinerary needs something delicious, playful, and unmistakably local, this one slides in beautifully.",
    estimatedCostKes: 2500,
    durationHours: 2,
    foodCostKes: 2500,
    bestTimeToVisit: "Lunch or early dinner before peak crowds.",
    safetyTips: [
      "Reserve ahead during weekends.",
      "Use ride-hailing if parking is busy.",
      "Check dietary options with staff before ordering."
    ],
    culturalInsights: "The menu leans into Kenyan flavors with a contemporary, city-friendly presentation.",
    imageUrls: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80"
    ],
    reviews: [
      { author: "Asha", rating: 5, text: "Inventive food and a fun atmosphere without feeling fussy." },
      { author: "Leo", rating: 4, text: "A reliable food anchor for a Nairobi day plan." }
    ]
  },
  {
    id: "mama-ocks",
    name: "Mama Oliech Lakeside Fish Lunch",
    region: "Nairobi",
    locationLabel: "Kilimani, Nairobi",
    coordinates: { lat: -1.2924, lng: 36.7838 },
    category: "food",
    interests: ["food", "culture"],
    tags: ["fun", "local", "iconic"],
    description: "An iconic fish spot when your taste buds want something proudly Kenyan and deeply satisfying.",
    longDescription: "This is not the whispering forest kind of stop. It is more of a delicious, lively chorus, and that is exactly the point.",
    estimatedCostKes: 1800,
    durationHours: 1.5,
    foodCostKes: 1800,
    bestTimeToVisit: "Lunch for the freshest flow and best menu availability.",
    safetyTips: [
      "Expect queues during peak lunch hours.",
      "Keep personal items close in busy dining areas.",
      "Ask for portion guidance if you are ordering for one."
    ],
    culturalInsights: "A well-loved local institution that reflects Nairobi's affection for regional fish traditions and shared meals.",
    imageUrls: [
      "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
    ],
    reviews: [
      { author: "Tom", rating: 5, text: "The fish is excellent and the place feels deeply local." },
      { author: "Wanjiku", rating: 4, text: "Busy, energetic, and worth fitting into a food-first day." }
    ]
  },
  {
    id: "nairobi-gallery",
    name: "Nairobi Gallery & Heritage Stop",
    region: "Nairobi",
    locationLabel: "City Centre, Nairobi",
    coordinates: { lat: -1.2865, lng: 36.8178 },
    category: "history",
    interests: ["history", "culture", "wellness"],
    tags: ["educational", "historical", "quiet"],
    description: "A compact heritage stop for art, archives, and a slower city-center pause.",
    longDescription: "Ideal when you want culture without a sprawling time commitment. The mood is thoughtful, not overwhelming.",
    estimatedCostKes: 700,
    durationHours: 1.5,
    foodCostKes: 600,
    bestTimeToVisit: "Late morning for a relaxed indoor session.",
    safetyTips: [
      "Use secure parking or trusted ride-hailing in the CBD.",
      "Avoid carrying too many valuables on foot.",
      "Check opening hours before leaving."
    ],
    culturalInsights: "The gallery helps stitch together Nairobi's civic, artistic, and colonial-era layers.",
    imageUrls: [
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80"
    ],
    reviews: [
      { author: "Grace", rating: 4, text: "Compact but rewarding if you like heritage and quieter spaces." },
      { author: "Ben", rating: 4, text: "Easy to pair with lunch or another CBD stop." }
    ]
  },
  {
    id: "uhuru-gardens",
    name: "Uhuru Gardens Reflection Walk",
    region: "Nairobi",
    locationLabel: "Lang'ata Road, Nairobi",
    coordinates: { lat: -1.3175, lng: 36.7929 },
    category: "wellness",
    interests: ["history", "wellness", "nature"],
    tags: ["historical", "healthy", "calm"],
    description: "A reflective stroll through a landmark of Kenyan independence memory.",
    longDescription: "This is a quieter kind of outing, suited to slow walkers, thoughtful conversations, and modest budgets.",
    estimatedCostKes: 300,
    durationHours: 1.5,
    foodCostKes: 500,
    bestTimeToVisit: "Morning or golden hour for gentler temperatures.",
    safetyTips: [
      "Visit in daylight hours.",
      "Wear a hat and carry water.",
      "Use official parking and main entry routes."
    ],
    culturalInsights: "Uhuru Gardens is closely tied to Kenya's independence story and civic memory.",
    imageUrls: [
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?auto=format&fit=crop&w=1200&q=80"
    ],
    reviews: [
      { author: "Irene", rating: 4, text: "Peaceful, budget-friendly, and meaningful." },
      { author: "Moses", rating: 4, text: "A nice reflective stop that works well with nearby attractions." }
    ]
  },
  {
    id: "hells-gate",
    name: "Hell's Gate Gorge Adventure",
    region: "Naivasha",
    locationLabel: "Hell's Gate National Park, Naivasha",
    coordinates: { lat: -0.892, lng: 36.3183 },
    category: "adventure",
    interests: ["adventure", "nature", "wildlife"],
    tags: ["fun", "healthy", "thrilling"],
    description: "Cycling, cliffs, and dramatic landscapes for travelers who like their fresh air with a little adrenaline.",
    longDescription: "When the day needs edge, movement, and volcanic scenery, Hell's Gate is a strong answer.",
    estimatedCostKes: 4200,
    durationHours: 5,
    foodCostKes: 1200,
    bestTimeToVisit: "Morning start for cooler cycling and brighter views.",
    safetyTips: [
      "Go with a guide for gorge sections.",
      "Carry enough water and sun protection.",
      "Wear sturdy shoes if hiking uneven surfaces."
    ],
    culturalInsights: "The landscape reflects the geological drama of the Rift Valley and is one of Kenya's most cinematic parks.",
    imageUrls: [
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
    ],
    reviews: [
      { author: "Diana", rating: 5, text: "Active, scenic, and very worth the trip if you have the hours." },
      { author: "Chris", rating: 4, text: "Best for people who genuinely want movement, not just photo stops." }
    ]
  },
  {
    id: "fort-jesus",
    name: "Fort Jesus Heritage Walk",
    region: "Mombasa",
    locationLabel: "Mombasa Old Town",
    coordinates: { lat: -4.0622, lng: 39.6761 },
    category: "history",
    interests: ["history", "culture"],
    tags: ["historical", "educational", "iconic"],
    description: "A layered coastal history stop with ocean views and centuries of stories in the walls.",
    longDescription: "Fort Jesus rewards curiosity. It is textured, coastal, and especially good for travelers who love context with their sightseeing.",
    estimatedCostKes: 1400,
    durationHours: 2.5,
    foodCostKes: 900,
    bestTimeToVisit: "Morning before the coastal heat builds.",
    safetyTips: [
      "Wear breathable clothing in warm weather.",
      "Use a guide for richer historical context.",
      "Combine with known routes in Old Town rather than wandering too widely."
    ],
    culturalInsights: "The fort reflects Portuguese, Omani, and Swahili coastal history in one of Kenya's most famous heritage sites.",
    imageUrls: [
      "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80"
    ],
    reviews: [
      { author: "Halima", rating: 5, text: "A great place to understand Mombasa beyond the beach." },
      { author: "Mark", rating: 4, text: "Historical, scenic, and easy to pair with a coastal lunch." }
    ]
  }
];
