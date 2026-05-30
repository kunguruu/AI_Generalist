import { SAFARI_ACTIVITIES, LOCATION_COORDINATES } from "./safariData.js";
import { generateProsAndCons, generateSafariNarrative } from "./safariAI.js";

const TRANSPORT_SPEED_KMH = {
  walking: 4.5,
  driving: 28,
  "public transport": 18,
};

const TRANSPORT_COST_PER_KM_KES = {
  walking: 0,
  driving: 55,
  "public transport": 18,
};

export function resolveBaseCoordinates(location, coordinates) {
  if (coordinates?.lat && coordinates?.lng) {
    return { lat: Number(coordinates.lat), lng: Number(coordinates.lng), region: location || "Custom" };
  }

  if (!location) {
    return LOCATION_COORDINATES.nairobi;
  }

  return LOCATION_COORDINATES[location.trim().toLowerCase()] || LOCATION_COORDINATES.nairobi;
}

function haversineDistanceKm(start, end) {
  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRadians(end.lat - start.lat);
  const dLng = toRadians(end.lng - start.lng);
  const lat1 = toRadians(start.lat);
  const lat2 = toRadians(end.lat);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toCurrency(amountKes, currency) {
  const rates = {
    KES: 1,
    USD: 0.0077,
    EUR: 0.0071,
    GBP: 0.0061,
  };

  const multiplier = rates[currency] || 1;
  return Number((amountKes * multiplier).toFixed(currency === "KES" ? 0 : 2));
}

function buildActivitySummary(activity, distanceKm, currency) {
  return {
    id: activity.id,
    name: activity.name,
    description: activity.description,
    category: activity.category,
    tags: activity.tags,
    estimatedCost: {
      currency,
      amount: toCurrency(activity.estimatedCostKes, currency),
      amountKes: activity.estimatedCostKes,
    },
    distanceKm: Number(distanceKm.toFixed(1)),
    durationHours: activity.durationHours,
    locationLabel: activity.locationLabel,
    coordinates: activity.coordinates,
    imageUrl: activity.imageUrls[0],
    region: activity.region,
  };
}

function scoreActivity(activity, { budget, interests, availableHours, distanceKm }) {
  const interestHits = interests.filter((interest) => activity.interests.includes(interest)).length;
  const budgetScore = budget >= activity.estimatedCostKes ? 1 : Math.max(0, 1 - (activity.estimatedCostKes - budget) / Math.max(budget, 1));
  const timeScore = availableHours >= activity.durationHours ? 1 : Math.max(0, 1 - (activity.durationHours - availableHours));
  const distanceScore = Math.max(0, 1 - distanceKm / 50);
  return interestHits * 2 + budgetScore + timeScore + distanceScore;
}

function getFilteredActivities(preferences, baseCoordinates) {
  return SAFARI_ACTIVITIES
    .map((activity) => {
      const distanceKm = haversineDistanceKm(baseCoordinates, activity.coordinates);
      return {
        activity,
        distanceKm,
        score: scoreActivity(activity, {
          budget: preferences.budget,
          interests: preferences.interests,
          availableHours: preferences.availableHours,
          distanceKm,
        }),
      };
    })
    .filter(({ activity, distanceKm }) => {
      const matchesCategory = preferences.category === "all" || !preferences.category || activity.category === preferences.category;
      const matchesDistance = distanceKm <= preferences.radiusKm;
      const matchesTime = activity.durationHours <= preferences.availableHours + 1;
      const matchesInterest =
        preferences.interests.length === 0 ||
        preferences.interests.some((interest) => activity.interests.includes(interest));

      return matchesCategory && matchesDistance && matchesTime && matchesInterest;
    })
    .sort((left, right) => right.score - left.score || left.distanceKm - right.distanceKm);
}

function buildRoute(items, origin) {
  const route = [];
  const remaining = [...items];
  let current = origin;

  while (remaining.length) {
    remaining.sort(
      (left, right) =>
        haversineDistanceKm(current, left.coordinates) - haversineDistanceKm(current, right.coordinates)
    );
    const next = remaining.shift();
    route.push(next);
    current = next.coordinates;
  }

  return route;
}

function buildDirections(itinerary, origin, transportMode) {
  const steps = [];
  let previousPoint = origin;
  let totalDistanceKm = 0;
  let totalTravelMinutes = 0;

  itinerary.forEach((activity, index) => {
    const distanceKm = haversineDistanceKm(previousPoint, activity.coordinates);
    const travelMinutes = Math.max(8, Math.round((distanceKm / TRANSPORT_SPEED_KMH[transportMode]) * 60));
    totalDistanceKm += distanceKm;
    totalTravelMinutes += travelMinutes;
    steps.push({
      order: index + 1,
      title: index === 0 ? `Set off for ${activity.name}` : `Continue to ${activity.name}`,
      instruction: `Travel ${distanceKm.toFixed(1)} km by ${transportMode} toward ${activity.locationLabel}.`,
      distanceKm: Number(distanceKm.toFixed(1)),
      travelMinutes,
    });
    previousPoint = activity.coordinates;
  });

  return {
    transportMode,
    totalDistanceKm: Number(totalDistanceKm.toFixed(1)),
    totalTravelMinutes,
    steps,
  };
}

function buildBudgetPlanner(itinerary, budget, currency, transportMode, directions) {
  const totalEntryKes = itinerary.reduce((sum, item) => sum + item.estimatedCost.amountKes, 0);
  const totalFoodKes = itinerary.reduce((sum, item) => sum + (item.foodCostKes || 0), 0);
  const transportKes = Math.round(directions.totalDistanceKm * TRANSPORT_COST_PER_KM_KES[transportMode]);
  const premium = [...itinerary].sort((left, right) => right.estimatedCost.amountKes - left.estimatedCost.amountKes)[0];

  const comboOptions = itinerary.slice(0, Math.min(itinerary.length, 3));
  const comboEntryKes = comboOptions.reduce((sum, item) => sum + item.estimatedCost.amountKes, 0);
  const comboFoodKes = comboOptions.reduce((sum, item) => sum + (item.foodCostKes || 0), 0);
  const comboTransportKes = Math.round(Math.max(6, directions.totalDistanceKm / 2) * TRANSPORT_COST_PER_KM_KES[transportMode]);
  const premiumTotalKes = (premium?.estimatedCost.amountKes || 0) + Math.round(transportKes * 0.6) + (premium?.foodCostKes || 0);
  const comboTotalKes = comboEntryKes + comboFoodKes + comboTransportKes;

  return {
    budget: { currency, amount: toCurrency(budget, currency), amountKes: budget },
    recommendedType: premiumTotalKes <= budget && premiumTotalKes >= comboTotalKes * 0.85 ? "premium" : "combo",
    premiumExperience: premium ? {
      title: premium.name,
      entries: [
        { label: "Entry and access", amount: toCurrency(premium.estimatedCost.amountKes, currency), amountKes: premium.estimatedCost.amountKes },
        { label: "Transport estimate", amount: toCurrency(Math.round(transportKes * 0.6), currency), amountKes: Math.round(transportKes * 0.6) },
        { label: "Food cushion", amount: toCurrency(premium.foodCostKes || 0, currency), amountKes: premium.foodCostKes || 0 },
      ],
      total: { currency, amount: toCurrency(premiumTotalKes, currency), amountKes: premiumTotalKes },
    } : null,
    comboPlan: {
      title: comboOptions.length > 1 ? `${comboOptions.length} affordable stops` : "One affordable stop",
      activities: comboOptions.map((item) => item.name),
      entries: [
        { label: "Entry fees", amount: toCurrency(comboEntryKes, currency), amountKes: comboEntryKes },
        { label: "Transport estimate", amount: toCurrency(comboTransportKes, currency), amountKes: comboTransportKes },
        { label: "Food cushion", amount: toCurrency(comboFoodKes, currency), amountKes: comboFoodKes },
      ],
      total: { currency, amount: toCurrency(comboTotalKes, currency), amountKes: comboTotalKes },
    },
    itineraryTotals: {
      entryFeesKes: totalEntryKes,
      transportKes,
      foodKes: totalFoodKes,
    },
  };
}

export async function discoverSafariPlan(rawPreferences = {}) {
  const preferences = {
    location: rawPreferences.location || "Nairobi",
    coordinates: rawPreferences.coordinates || null,
    budget: Number(rawPreferences.budget || 8000),
    currency: rawPreferences.currency || "KES",
    interests: Array.isArray(rawPreferences.interests) ? rawPreferences.interests : [],
    availableHours: Number(rawPreferences.availableHours || 6),
    transportMode: TRANSPORT_SPEED_KMH[rawPreferences.transportMode] ? rawPreferences.transportMode : "driving",
    radiusKm: Number(rawPreferences.radiusKm || 25),
    category: rawPreferences.category || "all",
  };

  const baseCoordinates = resolveBaseCoordinates(preferences.location, preferences.coordinates);
  const ranked = getFilteredActivities(preferences, baseCoordinates);
  const shortlist = ranked.slice(0, 8).map(({ activity, distanceKm }) => buildActivitySummary(activity, distanceKm, preferences.currency));
  const itinerary = buildRoute(shortlist, baseCoordinates).slice(0, Math.min(5, shortlist.length));
  const itineraryWithCosts = itinerary.map((item) => ({
    ...item,
    foodCostKes: SAFARI_ACTIVITIES.find((entry) => entry.id === item.id)?.foodCostKes || 0,
  }));
  const directions = buildDirections(itinerary, baseCoordinates, preferences.transportMode);
  const budgetPlanner = buildBudgetPlanner(itineraryWithCosts, preferences.budget, preferences.currency, preferences.transportMode, directions);
  const message = await generateSafariNarrative({
    location: preferences.location,
    budget: preferences.budget,
    currency: preferences.currency,
    interests: preferences.interests,
    itinerary,
  });

  return {
    preferences,
    origin: baseCoordinates,
    message,
    itinerary,
    activities: shortlist,
    directions,
    budgetPlanner,
    provider: {
      map: process.env.GOOGLE_MAPS_API_KEY ? "google" : "fallback",
      ai: process.env.OPENAI_API_KEY && process.env.OPENAI_MODEL ? "openai" : "template",
      places: process.env.GOOGLE_PLACES_API_KEY ? "google" : "local-curation",
    },
    generatedAt: new Date().toISOString(),
  };
}

export async function getSafariActivityDetail(activityId, query = {}) {
  const activity = SAFARI_ACTIVITIES.find((entry) => entry.id === activityId);
  if (!activity) {
    return null;
  }

  const origin = resolveBaseCoordinates(query.location, query.coordinates);
  const distanceKm = haversineDistanceKm(origin, activity.coordinates);
  const prosAndCons = await generateProsAndCons(activity);

  return {
    ...buildActivitySummary(activity, distanceKm, query.currency || "KES"),
    gallery: activity.imageUrls,
    reviews: activity.reviews,
    bestTimeToVisit: activity.bestTimeToVisit,
    safetyTips: activity.safetyTips,
    culturalInsights: activity.culturalInsights,
    longDescription: activity.longDescription,
    prosAndCons,
    bookingTips: [
      "Start a little earlier than you think you need to, especially in city traffic.",
      "Keep a small cash buffer even when most places accept cards.",
      "Pair this stop with one nearby activity for a smoother day."
    ],
  };
}
