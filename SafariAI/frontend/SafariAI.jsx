import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bus,
  Clock3,
  Compass,
  Heart,
  Leaf,
  Map,
  MapPin,
  Navigation,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trees,
  Wallet,
} from "lucide-react";
import { safariAPI } from "../src/api";

const STORAGE_KEYS = {
  cache: "safari_ai_last_plan",
  favorites: "safari_ai_favorites",
};

const defaultFilters = {
  location: "Nairobi",
  budget: 8000,
  currency: "KES",
  interests: ["nature", "food"],
  availableHours: 6,
  transportMode: "driving",
  radiusKm: 25,
  category: "all",
};

const fallbackMeta = {
  categories: ["all", "food", "nature", "adventure", "history", "wellness", "culture", "wildlife"],
  interests: ["food", "nature", "adventure", "history", "wellness", "culture", "wildlife"],
  transportModes: ["walking", "driving", "public transport"],
  currencies: ["KES", "USD", "EUR", "GBP"],
};

const categoryAccent = {
  food: "from-amber-300 via-orange-200 to-stone-100",
  nature: "from-emerald-300 via-green-200 to-lime-100",
  adventure: "from-orange-300 via-amber-200 to-yellow-100",
  history: "from-stone-300 via-zinc-200 to-slate-100",
  wellness: "from-teal-300 via-cyan-200 to-sky-100",
  culture: "from-rose-300 via-orange-100 to-amber-50",
  wildlife: "from-lime-300 via-emerald-200 to-stone-100",
  all: "from-emerald-300 via-lime-200 to-amber-100",
};

function formatCurrency(amount, currency) {
  try {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "KES" ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

function loadStoredArray(key) {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStorage(key, value) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.34em] text-emerald-700">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-3xl leading-tight text-stone-900 sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-sm leading-7 text-stone-600 sm:text-base">{description}</p> : null}
    </div>
  );
}

function ItineraryChip({ item, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
        active
          ? "border-emerald-700 bg-emerald-700 text-white"
          : "border-stone-200 bg-white/90 text-stone-700 hover:border-emerald-300 hover:text-emerald-700"
      }`}
    >
      {item.name}
    </button>
  );
}

function ActivityCard({ activity, currency, isFavorite, onFavorite, onOpen }) {
  return (
    <article className="overflow-hidden rounded-[30px] border border-white/70 bg-white/90 shadow-[0_20px_60px_rgba(57,78,58,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(57,78,58,0.14)]">
      <div className={`h-40 bg-gradient-to-br ${categoryAccent[activity.category] || categoryAccent.all} p-5`}>
        <div className="flex items-start justify-between gap-4">
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-stone-700">
            {activity.category}
          </span>
          <button
            type="button"
            onClick={() => onFavorite(activity.id)}
            className={`rounded-full p-2 transition ${isFavorite ? "bg-rose-500 text-white" : "bg-white/80 text-stone-600 hover:text-rose-500"}`}
            aria-label={`Save ${activity.name}`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        </div>
        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-stone-900/75 px-3 py-1 text-xs font-semibold text-stone-50">
          <MapPin className="h-3.5 w-3.5" />
          {activity.distanceKm} km away
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-stone-900">{activity.name}</h3>
            <p className="mt-1 text-sm text-stone-500">{activity.locationLabel}</p>
          </div>
          <p className="text-right text-sm font-bold text-emerald-700">
            {formatCurrency(activity.estimatedCost.amount, currency)}
          </p>
        </div>

        <p className="mt-4 text-sm leading-6 text-stone-600">{activity.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {activity.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-stone-50 p-3">
            <p className="text-stone-500">Time</p>
            <p className="mt-1 font-bold text-stone-900">{activity.durationHours} hrs</p>
          </div>
          <div className="rounded-2xl bg-stone-50 p-3">
            <p className="text-stone-500">Mood</p>
            <p className="mt-1 font-bold text-stone-900">{activity.tags[0]}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
        >
          Open intelligence panel
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

function RouteMap({ plan, selectedActivity }) {
  const center = selectedActivity?.coordinates || plan?.origin;
  const iframeUrl = useMemo(() => {
    if (!center) {
      return "";
    }

    const delta = 0.08;
    const left = center.lng - delta;
    const right = center.lng + delta;
    const top = center.lat + delta;
    const bottom = center.lat - delta;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${center.lat}%2C${center.lng}`;
  }, [center]);

  if (!plan) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-[32px] border border-white/60 bg-white/80 shadow-[0_20px_60px_rgba(57,78,58,0.08)] backdrop-blur">
      <div className="flex items-center justify-between border-b border-stone-200/70 px-5 py-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">Route Intelligence</p>
          <h3 className="mt-2 text-xl font-bold text-stone-900">Map-aware and time-aware</h3>
        </div>
        <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
          {plan?.directions?.totalDistanceKm ?? 0} km
        </div>
      </div>

      {iframeUrl ? (
        <iframe
          title="Safari AI route map"
          src={iframeUrl}
          className="h-72 w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : null}

      <div className="grid gap-3 p-5">
        {(plan?.directions?.steps || []).map((step) => (
          <div key={step.order} className="rounded-2xl bg-stone-50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-stone-900">{step.title}</p>
                <p className="mt-1 text-sm text-stone-600">{step.instruction}</p>
              </div>
              <div className="text-right text-xs font-semibold text-stone-500">
                <p>{step.travelMinutes} min</p>
                <p>{step.distanceKm} km</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailPanel({ detail, currency, loading }) {
  if (loading) {
    return (
      <div className="rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(57,78,58,0.08)] backdrop-blur">
        <p className="text-sm text-stone-500">Gathering the richer local notes for this stop...</p>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="rounded-[32px] border border-dashed border-stone-300 bg-white/60 p-6 text-sm text-stone-500">
        Pick an activity and Safari AI will open its detailed guide panel here.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[32px] border border-white/60 bg-white/88 shadow-[0_20px_60px_rgba(57,78,58,0.08)] backdrop-blur">
      <div className="grid gap-3 p-3 sm:grid-cols-2">
        {(detail.gallery || []).slice(0, 2).map((image) => (
          <img key={image} src={image} alt={detail.name} className="h-44 w-full rounded-[24px] object-cover" />
        ))}
      </div>

      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">{detail.category}</p>
            <h3 className="mt-2 text-2xl font-bold text-stone-900">{detail.name}</h3>
            <p className="mt-2 text-sm text-stone-500">{detail.locationLabel}</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
            {formatCurrency(detail.estimatedCost.amount, currency)}
          </div>
        </div>

        <p className="mt-5 text-sm leading-7 text-stone-600">{detail.longDescription}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] bg-stone-50 p-5">
            <p className="text-sm font-bold text-stone-900">Pros</p>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              {(detail.prosAndCons?.pros || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-[24px] bg-stone-50 p-5">
            <p className="text-sm font-bold text-stone-900">Considerations</p>
            <ul className="mt-3 space-y-2 text-sm text-stone-600">
              {(detail.prosAndCons?.cons || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] bg-emerald-950 p-5 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-200">Best Time</p>
            <p className="mt-3 text-sm leading-6 text-emerald-50">{detail.bestTimeToVisit}</p>
            <p className="mt-4 text-sm text-emerald-100">{detail.prosAndCons?.summary || "Safari AI is still gathering a fuller summary for this stop."}</p>
          </div>
          <div className="rounded-[24px] bg-amber-50 p-5">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-800">Safety Tips</p>
            <ul className="mt-3 space-y-2 text-sm text-amber-900">
              {(detail.safetyTips || []).map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] bg-stone-50 p-5">
          <p className="text-sm font-bold text-stone-900">Cultural insight</p>
          <p className="mt-3 text-sm leading-7 text-stone-600">{detail.culturalInsights}</p>
        </div>

        <div className="mt-6">
          <p className="text-sm font-bold text-stone-900">Recent review snapshots</p>
          <div className="mt-4 grid gap-3">
            {(detail.reviews || []).map((review) => (
              <div key={`${review.author}-${review.text}`} className="rounded-2xl border border-stone-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-stone-900">{review.author}</p>
                  <div className="inline-flex items-center gap-1 text-sm font-bold text-amber-600">
                    <Star className="h-4 w-4 fill-current" />
                    {review.rating}
                  </div>
                </div>
                <p className="mt-2 text-sm text-stone-600">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SafariAI() {
  const [filters, setFilters] = useState(defaultFilters);
  const [meta, setMeta] = useState(fallbackMeta);
  const [plan, setPlan] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [detail, setDetail] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [useGps, setUseGps] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [favorites, setFavorites] = useState(() => loadStoredArray(STORAGE_KEYS.favorites));
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const response = await safariAPI.getMeta();
        setMeta({
          categories: response.categories || fallbackMeta.categories,
          interests: response.interests || fallbackMeta.interests,
          transportModes: response.transportModes || fallbackMeta.transportModes,
          currencies: response.currencies || fallbackMeta.currencies,
        });
      } catch {
        setMeta(fallbackMeta);
      }
    };

    loadMeta();
  }, []);

  useEffect(() => {
    saveStorage(STORAGE_KEYS.favorites, favorites);
  }, [favorites]);

  useEffect(() => {
    // Initial featured plan load should happen once on mount.
    runDiscovery(defaultFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }

    const fetchDetail = async () => {
      setLoadingDetail(true);
      try {
        const response = await safariAPI.getActivity(selectedId, {
          currency: filters.currency,
          location: filters.location,
        });
        setDetail(response.activity);
      } catch {
        setDetail(null);
      } finally {
        setLoadingDetail(false);
      }
    };

    fetchDetail();
  }, [selectedId, filters.currency, filters.location]);

  const recommendedActivities = plan?.activities || [];
  const selectedActivity = detail || recommendedActivities.find((item) => item.id === selectedId) || null;
  const totalItineraryCost = plan?.itinerary?.reduce((sum, item) => sum + item.estimatedCost.amount, 0) || 0;

  async function runDiscovery(overrides = filters) {
    setLoadingPlan(true);
    setError("");
    setNotice("");

    try {
      const response = await safariAPI.discover({
        ...overrides,
        coordinates,
      });
      setPlan(response);
      setSelectedId(response.itinerary?.[0]?.id || response.activities?.[0]?.id || "");
      saveStorage(STORAGE_KEYS.cache, response);
      if (response.provider?.ai !== "openai" || response.provider?.places !== "google") {
        setNotice("Safari AI is using curated local intelligence and can get richer when Google/OpenAI keys are added.");
      }
    } catch {
      const cached = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEYS.cache) : null;
      if (cached) {
        const parsed = JSON.parse(cached);
        setPlan(parsed);
        setSelectedId(parsed.itinerary?.[0]?.id || "");
        setNotice("Offline-friendly fallback engaged. You are seeing the last cached Safari plan.");
      } else {
        setError("Safari AI could not reach the planner just now. Try again in a moment.");
      }
    } finally {
      setLoadingPlan(false);
    }
  }

  const toggleInterest = (interest) => {
    setFilters((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest],
    }));
  };

  const toggleFavorite = (activityId) => {
    setFavorites((current) =>
      current.includes(activityId) ? current.filter((item) => item !== activityId) : [...current, activityId]
    );
  };

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      setNotice("This browser does not expose GPS here, so Safari AI will stick with your typed location.");
      return;
    }

    setUseGps(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setNotice("GPS location captured. Safari AI will now bias routes around where you are standing.");
        setUseGps(false);
      },
      () => {
        setNotice("Safari AI could not read your GPS, so manual location remains in charge.");
        setUseGps(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#eef7ef_0%,#f8f4e9_28%,#fbfaf6_100%)]">
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(22,163,74,0.22),transparent_32%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.7),transparent_80%)]" />
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-700/15 bg-white/85 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm backdrop-blur">
                <Leaf className="h-4 w-4 text-emerald-700" />
                Calm routes. Clever budgets. A guide with a pulse.
              </div>
              <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-tight text-stone-900 sm:text-6xl">
                Safari AI turns your location, time, and budget into a thoughtful day out.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">
                It behaves like a mellow local guide with good map sense. Tell it where you are, what you enjoy,
                and how much you want to spend, then let the itinerary settle into place.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur">
                  <Compass className="h-6 w-6 text-emerald-700" />
                  <p className="mt-4 font-bold text-stone-900">Dynamic discovery</p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">Nearby activities ranked for vibe, budget, and timing.</p>
                </div>
                <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur">
                  <Wallet className="h-6 w-6 text-emerald-700" />
                  <p className="mt-4 font-bold text-stone-900">Budget planner</p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">One splurge or several soft-priced stops, broken down clearly.</p>
                </div>
                <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur">
                  <Route className="h-6 w-6 text-emerald-700" />
                  <p className="mt-4 font-bold text-stone-900">Route intelligence</p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">Ordered by proximity and time efficiency with step guidance.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[36px] border border-white/70 bg-white/82 p-5 shadow-[0_24px_90px_rgba(57,78,58,0.12)] backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">Plan Builder</p>
                  <h2 className="mt-2 text-2xl font-bold text-stone-900">Tell Safari AI your vibe</h2>
                </div>
                <button
                  type="button"
                  onClick={handleUseGps}
                  disabled={useGps}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-70"
                >
                  <Navigation className="h-4 w-4" />
                  {useGps ? "Finding you..." : "Use GPS"}
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="mb-2 block font-semibold text-stone-700">Location</span>
                  <input
                    value={filters.location}
                    onChange={(event) => setFilters((current) => ({ ...current, location: event.target.value }))}
                    className="h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 outline-none transition focus:border-emerald-500 focus:bg-white"
                    placeholder="Nairobi, Karen, Mombasa..."
                  />
                </label>
                <label className="text-sm">
                  <span className="mb-2 block font-semibold text-stone-700">Budget</span>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      value={filters.budget}
                      onChange={(event) => setFilters((current) => ({ ...current, budget: Number(event.target.value || 0) }))}
                      className="h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 outline-none transition focus:border-emerald-500 focus:bg-white"
                    />
                    <select
                      value={filters.currency}
                      onChange={(event) => setFilters((current) => ({ ...current, currency: event.target.value }))}
                      className="rounded-2xl border border-stone-200 bg-stone-50 px-4 outline-none transition focus:border-emerald-500 focus:bg-white"
                    >
                      {meta.currencies.map((currency) => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>
                </label>
                <label className="text-sm">
                  <span className="mb-2 block font-semibold text-stone-700">Hours available</span>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={filters.availableHours}
                    onChange={(event) => setFilters((current) => ({ ...current, availableHours: Number(event.target.value) }))}
                    className="mt-3 w-full accent-emerald-700"
                  />
                  <span className="mt-2 block text-sm text-stone-500">{filters.availableHours} hours to roam</span>
                </label>
                <label className="text-sm">
                  <span className="mb-2 block font-semibold text-stone-700">Transport mode</span>
                  <select
                    value={filters.transportMode}
                    onChange={(event) => setFilters((current) => ({ ...current, transportMode: event.target.value }))}
                    className="h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 outline-none transition focus:border-emerald-500 focus:bg-white"
                  >
                    {meta.transportModes.map((mode) => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="mb-2 block font-semibold text-stone-700">Category focus</span>
                  <select
                    value={filters.category}
                    onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}
                    className="h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 outline-none transition focus:border-emerald-500 focus:bg-white"
                  >
                    {meta.categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <label className="text-sm">
                  <span className="mb-2 block font-semibold text-stone-700">Search radius</span>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    value={filters.radiusKm}
                    onChange={(event) => setFilters((current) => ({ ...current, radiusKm: Number(event.target.value) }))}
                    className="mt-3 w-full accent-emerald-700"
                  />
                  <span className="mt-2 block text-sm text-stone-500">Within {filters.radiusKm} km</span>
                </label>
              </div>

              <div className="mt-5">
                <span className="block text-sm font-semibold text-stone-700">Interests</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {meta.interests.map((interest) => {
                    const active = filters.interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          active ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => runDiscovery(filters)}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[22px] bg-emerald-700 px-6 py-4 font-semibold text-white transition hover:bg-emerald-800"
              >
                <Search className="h-4 w-4" />
                {loadingPlan ? "Mapping your safari..." : "Generate Safari Plan"}
              </button>

              {notice ? <p className="mt-4 text-sm text-emerald-800">{notice}</p> : null}
              {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="rounded-[34px] border border-white/70 bg-[linear-gradient(135deg,#103d29_0%,#265a3f_100%)] p-6 text-white shadow-[0_24px_80px_rgba(16,61,41,0.16)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-200">AI Personality Layer</p>
                  <h2 className="mt-3 font-serif text-3xl">A guide that sounds like it has touched grass</h2>
                </div>
                <Sparkles className="h-8 w-8 text-amber-300" />
              </div>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-emerald-50">
                {plan?.message || "This hidden gem feels like nature whispering directly to you, and your wallet will probably nod in approval too."}
              </p>
            </div>

            <div className="rounded-[32px] border border-white/60 bg-white/85 p-6 shadow-[0_20px_60px_rgba(57,78,58,0.08)] backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <SectionTitle eyebrow="Budget Planner" title="Spend wisely, wander richly" description="Safari AI weighs one premium moment against a softer combination of affordable stops." />
                <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">
                  Total entries: {formatCurrency(totalItineraryCost, filters.currency)}
                </div>
              </div>
              {plan?.budgetPlanner ? (
                <div className="mt-6 grid gap-4">
                  <div className="rounded-[28px] bg-stone-50 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-stone-900">Recommended</p>
                        <p className="mt-1 text-sm text-stone-600">
                          {plan.budgetPlanner.recommendedType === "premium" ? "One premium experience" : "A combination of affordable activities"}
                        </p>
                      </div>
                      <div className="rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">
                        {plan.budgetPlanner.recommendedType}
                      </div>
                    </div>
                  </div>
                  {plan.budgetPlanner.premiumExperience ? (
                    <div className="rounded-[28px] border border-stone-200 p-5">
                      <p className="font-bold text-stone-900">{plan.budgetPlanner.premiumExperience.title}</p>
                      <div className="mt-4 space-y-2 text-sm text-stone-600">
                        {plan.budgetPlanner.premiumExperience.entries.map((entry) => (
                          <div key={entry.label} className="flex items-center justify-between gap-4">
                            <span>{entry.label}</span>
                            <span className="font-semibold text-stone-900">{formatCurrency(entry.amount, filters.currency)}</span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-4 text-sm font-bold text-emerald-700">
                        Total: {formatCurrency(plan.budgetPlanner.premiumExperience.total.amount, filters.currency)}
                      </p>
                    </div>
                  ) : null}
                  <div className="rounded-[28px] border border-stone-200 p-5">
                    <p className="font-bold text-stone-900">{plan.budgetPlanner.comboPlan.title}</p>
                    <p className="mt-2 text-sm text-stone-600">{plan.budgetPlanner.comboPlan.activities.join(" • ")}</p>
                    <div className="mt-4 space-y-2 text-sm text-stone-600">
                      {plan.budgetPlanner.comboPlan.entries.map((entry) => (
                        <div key={entry.label} className="flex items-center justify-between gap-4">
                          <span>{entry.label}</span>
                          <span className="font-semibold text-stone-900">{formatCurrency(entry.amount, filters.currency)}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-sm font-bold text-emerald-700">
                      Total: {formatCurrency(plan.budgetPlanner.comboPlan.total.amount, filters.currency)}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/60 bg-white/85 p-6 shadow-[0_20px_60px_rgba(57,78,58,0.08)] backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <SectionTitle eyebrow="Recommended Itinerary" title="Curated for proximity and pacing" description="One to five stops, sensibly ordered so the day feels smooth rather than overstuffed." />
              <div className="inline-flex rounded-full bg-stone-100 p-1">
                <button type="button" onClick={() => setViewMode("list")} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${viewMode === "list" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"}`}>List view</button>
                <button type="button" onClick={() => setViewMode("map")} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${viewMode === "map" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"}`}>Map view</button>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {plan?.itinerary?.map((item) => (
                <ItineraryChip key={item.id} item={item} active={selectedId === item.id} onClick={() => setSelectedId(item.id)} />
              ))}
            </div>
            <div className="mt-6">
              {viewMode === "map" ? (
                <RouteMap plan={plan} selectedActivity={selectedActivity} />
              ) : (
                <div className="grid gap-5">
                  {recommendedActivities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      currency={filters.currency}
                      isFavorite={favorites.includes(activity.id)}
                      onFavorite={toggleFavorite}
                      onOpen={() => setSelectedId(activity.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <DetailPanel detail={detail} currency={filters.currency} loading={loadingDetail} />
          </div>
          <div className="space-y-6">
            <div className="rounded-[32px] border border-white/60 bg-white/88 p-6 shadow-[0_20px_60px_rgba(57,78,58,0.08)] backdrop-blur">
              <SectionTitle eyebrow="Mobility Snapshot" title="Transport, time, and rhythm" description="A quick read on how the day moves from stop to stop." />
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] bg-stone-50 p-4">
                  <Clock3 className="h-5 w-5 text-emerald-700" />
                  <p className="mt-3 text-sm text-stone-500">Travel time</p>
                  <p className="mt-1 text-xl font-bold text-stone-900">{plan?.directions?.totalTravelMinutes || 0} min</p>
                </div>
                <div className="rounded-[24px] bg-stone-50 p-4">
                  <Map className="h-5 w-5 text-emerald-700" />
                  <p className="mt-3 text-sm text-stone-500">Distance</p>
                  <p className="mt-1 text-xl font-bold text-stone-900">{plan?.directions?.totalDistanceKm || 0} km</p>
                </div>
                <div className="rounded-[24px] bg-stone-50 p-4">
                  <Bus className="h-5 w-5 text-emerald-700" />
                  <p className="mt-3 text-sm text-stone-500">Mode</p>
                  <p className="mt-1 text-xl font-bold capitalize text-stone-900">{filters.transportMode}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[32px] border border-white/60 bg-white/88 p-6 shadow-[0_20px_60px_rgba(57,78,58,0.08)] backdrop-blur">
              <SectionTitle eyebrow="Trust Layer" title="Built for the real world" description="Even when external APIs are absent, the app remains functional and transparent." />
              <div className="mt-6 grid gap-4">
                <div className="flex items-start gap-4 rounded-[24px] bg-stone-50 p-4">
                  <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-700" />
                  <p className="text-sm leading-6 text-stone-600">Offline-friendly cache keeps the latest itinerary available when the network is moody.</p>
                </div>
                <div className="flex items-start gap-4 rounded-[24px] bg-stone-50 p-4">
                  <Trees className="mt-1 h-5 w-5 shrink-0 text-emerald-700" />
                  <p className="text-sm leading-6 text-stone-600">Favorites are stored locally so returning travelers can keep a short list of beloved stops.</p>
                </div>
                <div className="flex items-start gap-4 rounded-[24px] bg-stone-50 p-4">
                  <Sparkles className="mt-1 h-5 w-5 shrink-0 text-emerald-700" />
                  <p className="text-sm leading-6 text-stone-600">AI summaries gracefully downgrade to curated templates, so the guide still sounds coherent instead of broken.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SafariAI;
