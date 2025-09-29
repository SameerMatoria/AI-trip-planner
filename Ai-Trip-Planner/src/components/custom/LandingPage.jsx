import React from "react";
import { Link } from "react-router-dom";

/** Reusable section wrapper */
const Section = ({ id, children, className = "" }) => (
  <section id={id} className={`px-6 md:px-10 lg:px-16 ${className}`}>
    <div className="max-w-7xl mx-auto">{children}</div>
  </section>
);

/** Simple badge */
const Badge = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-green-50 text-green-700 border border-green-200 px-3 py-1 text-xs font-medium">
    {children}
  </span>
);

/** Icon (inline SVG) */
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d={path} />
  </svg>
);

/** ------------ HERO ------------ */
function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* subtle texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.08),transparent_45%)]"
      />
      <Section className="py-20 lg:py-28 text-center">
        <Badge>
          <Icon
            className="w-4 h-4"
            path="M12 2a10 10 0 100 20 10 10 0 000-20zm1 11h4v2h-6V7h2v6z"
          />
          AI trip planner
        </Badge>

        <h1 className="mt-5 text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
          Plan <span className="text-green-700">Smart</span>, Travel{" "}
          <span className="text-blue-700">Smarter!</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Journey smart with AI guidance. Discover destinations, craft perfect
          itineraries, and travel stress-free from the very start.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/create-trip" aria-label="Create your AI trip itinerary">
            <button className="px-6 py-3 w-[220px] rounded-xl text-white font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all shadow-lg">
              Get Started
            </button>
          </Link>
          <a href="#how-it-works">
            <button className="px-6 py-3 w-[220px] rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition-all font-medium">
              See how it works
            </button>
          </a>
        </div>

        {/* quick trust metrics */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
          {[
            ["50k+", "plans created"],
            ["98%", "user satisfaction"],
            ["120+", "cities covered"],
            ["<2 min", "to first draft"],
          ].map(([stat, label]) => (
            <div
              key={label}
              className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur p-4"
            >
              <div className="text-2xl font-extrabold text-gray-900">
                {stat}
              </div>
              <div className="text-gray-500">{label}</div>
            </div>
          ))}
        </div>

        {/* decorative image */}
        <div className="mt-12">
          <img
            src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1600&auto=format&fit=crop"
            alt="Traveler planning a trip with maps and laptop"
            className="w-full max-w-4xl mx-auto rounded-2xl shadow-xl object-cover"
            loading="lazy"
          />
        </div>
      </Section>
    </div>
  );
}

/** ------------ TRUST BAR ------------ */
function TrustBar() {
  const logos = [
    "Expedia",
    "Booking",
    "Skyscanner",
    "TripAdvisor",
    "Lonely Planet",
  ];
  return (
    <Section className="py-10">
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
        {logos.map((name) => (
          <div
            key={name}
            className="text-sm uppercase tracking-widest text-gray-500"
            aria-label={`Trusted by ${name}`}
            title={name}
          >
            {name}
          </div>
        ))}
      </div>
    </Section>
  );
}

/** ------------ FEATURES ------------ */
function Features() {
  const items = [
    {
      title: "AI-crafted itineraries",
      desc: "Tell us your dates, vibe, and budget—get a day-by-day plan with timings, distances, and must-see spots.",
      icon:
        "M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L5.5 20l2-7L2 9h7l3-7z",
    },
    {
      title: "Real-time tweaks",
      desc: "Drag, drop, and swap activities. We’ll auto-reflow times and transit so nothing breaks.",
      icon:
        "M4 4h16v4H4V4zm0 6h10v4H4v-4zm0 6h16v4H4v-4z",
    },
    {
      title: "Budget & time guardrails",
      desc: "Set your limits; we keep your plan realistic with travel times, opening hours, and costs.",
      icon:
        "M12 1C5.924 1 1 5.924 1 12s4.924 11 11 11 11-4.924 11-11S18.076 1 12 1zm1 5v4h4v2h-6V6h2z",
    },
    {
      title: "Offline & shareable",
      desc: "Save to your phone, export to PDF, and share a live link with friends.",
      icon:
        "M14 9V5l7 7-7 7v-4H3V9h11z",
    },
  ];
  return (
    <Section id="features" className="py-20">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Everything you need to plan with confidence
        </h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          From inspiration to bookings—your travel co-pilot keeps all the moving parts
          tidy and on time.
        </p>
      </div>

      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(({ title, desc, icon }) => (
          <div
            key={title}
            className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-xl transition-shadow"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600">
              <Icon path={icon} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              {title}
            </h3>
            <p className="mt-2 text-gray-600 text-sm">{desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/** ------------ HOW IT WORKS ------------ */
function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Tell us your vibe",
      desc: "Dates, travelers, interests (foodie? nature? nightlife?), and your budget.",
    },
    {
      step: "2",
      title: "Get your plan",
      desc: "A complete timeline with travel times, opening hours, and backup options.",
    },
    {
      step: "3",
      title: "Customize in seconds",
      desc: "Drag to reorder, add places, and we auto-fix conflicts instantly.",
    },
    {
      step: "4",
      title: "Book & go",
      desc: "Pin hotels, tours, and transport in one place. Export or share a live link.",
    },
  ];
  return (
    <Section id="how-it-works" className="py-20 bg-gray-50">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <Badge>It’s this easy</Badge>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-900">
            Turn preferences into a perfect itinerary
          </h2>
          <p className="mt-4 text-gray-600">
            Go from blank page to a polished plan with smart defaults and
            real-world constraints baked in.
          </p>

          <ol className="mt-8 space-y-5">
            {steps.map(({ step, title, desc }) => (
              <li key={step} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                  {step}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{title}</div>
                  <div className="text-gray-600 text-sm">{desc}</div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8">
            <Link to="/create-trip">
              <button className="px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black transition">
                Start planning
              </button>
            </Link>
          </div>
        </div>

        <div>
          {/* mock “planner” card */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="font-semibold">Rome weekend • 3 days</div>
              <div className="text-xs text-gray-500">Auto-optimized</div>
            </div>
            <ul className="divide-y">
              {[
                ["09:00", "Espresso & cornetto near hotel"],
                ["10:30", "Colosseum skip-the-line"],
                ["13:00", "Trastevere lunch stroll"],
                ["15:00", "Vatican Museums & Sistine Chapel"],
                ["19:30", "Trastevere trattoria dinner"],
              ].map(([time, title]) => (
                <li key={time} className="px-4 py-3 flex items-start gap-3">
                  <span className="text-xs font-mono text-gray-500 w-14">
                    {time}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{title}</div>
                    <div className="text-xs text-gray-500">
                      ~12 min walk • Tickets saved
                    </div>
                  </div>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Drag to reorder"
                    title="Drag to reorder"
                  >
                    <Icon className="w-5 h-5" path="M10 4h4v2h-4V4zm0 14h4v2h-4v-2zM4 10h2v4H4v-4zm14 0h2v4h-2v-4z" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600">
              Conflicts resolved • Travel time accounted • Weather-aware
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/** ------------ DESTINATIONS GRID ------------ */
function Destinations() {
  const cards = [
    {
      city: "Kyoto, Japan",
      img: "https://images.unsplash.com/photo-1545569341-9eb8b30979d0?q=80&w=1400&auto=format&fit=crop",
    },
    {
      city: "Paris, France",
      img: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=1400&auto=format&fit=crop",
    },
    {
      city: "Bali, Indonesia",
      img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop",
    },
    {
      city: "Reykjavík, Iceland",
      img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1400&auto=format&fit=crop",
    },
    {
      city: "New York, USA",
      img: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=1400&auto=format&fit=crop",
    },
    {
      city: "Rome, Italy",
      img: "https://images.unsplash.com/photo-1526481280698-8fcc13fd1d33?q=80&w=1400&auto=format&fit=crop",
    },
  ];
  return (
    <Section id="destinations" className="py-20">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Popular destinations
          </h2>
          <p className="mt-2 text-gray-600">
            Hand-picked places with ready-to-go templates.
          </p>
        </div>
        <Link to="/create-trip">
          <button className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50">
            Build my plan
          </button>
        </Link>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(({ city, img }) => (
          <article
            key={city}
            className="group relative overflow-hidden rounded-2xl shadow-sm border border-gray-200"
          >
            <img
              src={img}
              alt={city}
              className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg drop-shadow">
                {city}
              </h3>
              <Link to="/create-trip">
                <button className="text-sm px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white">
                  Plan
                </button>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

/** ------------ TESTIMONIALS ------------ */
function Testimonials() {
  const quotes = [
    {
      name: "Aarav S.",
      role: "Solo traveler",
      text:
        "I had a 48-hour layover in Rome. This gave me a perfect route and saved me from lines.",
    },
    {
      name: "Maya & Rohan",
      role: "Couple",
      text:
        "We set a ₹50k budget and still did everything we wanted. The auto-reflow is magic.",
    },
    {
      name: "Karan P.",
      role: "Remote worker",
      text:
        "Loved the offline export. My plan worked even with spotty internet up in the mountains.",
    },
  ];
  return (
    <Section className="py-20 bg-gray-50">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Loved by travelers everywhere
        </h2>
        <p className="mt-2 text-gray-600">
          Real stories from people who planned better and traveled happier.
        </p>
      </div>

      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {quotes.map((q) => (
          <figure
            key={q.name}
            className="rounded-2xl border border-gray-200 bg-white p-6"
          >
            <blockquote className="text-gray-700">“{q.text}”</blockquote>
            <figcaption className="mt-4 text-sm text-gray-500">
              <span className="font-semibold text-gray-900">{q.name}</span> •{" "}
              {q.role}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

/** ------------ FAQ ------------ */
function FAQ() {
  const faqs = [
    [
      "Can I customize the itinerary?",
      "Yes. Reorder, add or remove places; we update timings and travel automatically.",
    ],
    [
      "Do you handle bookings?",
      "We surface bookable links for hotels, tours, and transport. You choose where to book.",
    ],
    [
      "Will it work offline?",
      "You can save or export your plan to use offline during your trip.",
    ],
    [
      "Is it free?",
      "You can plan unlimited trips. Premium includes real-time weather & crowd avoidance.",
    ],
  ];
  return (
    <Section id="faq" className="py-20">
      <div className="max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Frequently asked questions
        </h2>
        <dl className="mt-8 divide-y rounded-2xl border border-gray-200 bg-white">
          {faqs.map(([q, a], i) => (
            <div key={i} className="p-6">
              <dt className="font-semibold text-gray-900">{q}</dt>
              <dd className="mt-2 text-gray-600 text-sm">{a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

/** ------------ NEWSLETTER / CTA ------------ */
function NewsletterCTA() {
  return (
    <Section className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50 rounded-t-[2.5rem]">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <Badge>Be the first to know</Badge>
          <h3 className="mt-4 text-2xl md:text-3xl font-extrabold text-gray-900">
            New destinations & smart features every week
          </h3>
          <p className="mt-3 text-gray-600">
            Join our newsletter for curated city templates, hidden gems, and
            seasonal guides.
          </p>
        </div>
        <form
          className="flex flex-col sm:flex-row gap-3"
          onSubmit={(e) => e.preventDefault()}
          aria-label="Subscribe to newsletter"
        >
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Email address"
          />
          <button className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">
            Subscribe
          </button>
        </form>
      </div>
    </Section>
  );
}

/** ------------ FOOTER ------------ */
function Footer() {
  const links = {
    Product: [
      ["Features", "#features"],
      ["How it works", "#how-it-works"],
      ["Destinations", "#destinations"],
      ["Pricing", "/pricing"],
    ],
    Company: [
      ["About", "/about"],
      ["Blog", "/blog"],
      ["Careers", "/careers"],
      ["Contact", "/contact"],
    ],
    Legal: [
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
      ["Cookies", "/cookies"],
    ],
  };
  return (
    <footer className="border-t border-gray-200 mt-20">
      <Section className="py-12">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="text-xl font-extrabold">TripSmart</div>
            <p className="mt-3 text-sm text-gray-600">
              Plan fast. Travel better. Your AI copilot for stress-free trips.
            </p>
            <div className="mt-4 flex gap-3">
              {["M10 2a8 8 0 100 16 8 8 0 000-16z", "M4 12l16 0", "M12 4l0 16"].map(
                (p, i) => (
                  <a
                    key={i}
                    href="#"
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                    aria-label="Social link"
                  >
                    <Icon className="w-5 h-5 text-gray-600" path={p} />
                  </a>
                )
              )}
            </div>
          </div>

          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <div className="font-semibold text-gray-900">{group}</div>
              <ul className="mt-3 space-y-2 text-sm">
                {items.map(([label, href]) => (
                  href.startsWith("#") ? (
                    <li key={label}>
                      <a href={href} className="text-gray-600 hover:text-gray-900">
                        {label}
                      </a>
                    </li>
                  ) : (
                    <li key={label}>
                      <Link to={href} className="text-gray-600 hover:text-gray-900">
                        {label}
                      </Link>
                    </li>
                  )
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 text-xs text-gray-500">
          © {new Date().getFullYear()} TripSmart, Inc. All rights reserved.
        </div>
      </Section>
    </footer>
  );
}

/** ------------ PAGE COMPOSITION ------------ */
export default function LandingPage() {
  return (
    <main className="bg-white">
      <Hero />
      <TrustBar />
      <Features />
      <HowItWorks />
      <Destinations />
      <Testimonials />
      <FAQ />
      <NewsletterCTA />
      <Footer />
    </main>
  );
}
