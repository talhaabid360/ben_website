"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Episode = {
  number: string;
  guest: string;
  title: string;
  theme: string;
  image: string;
  url: string;
};

const episodes: Episode[] = [
  { number: "01", guest: "Phil Daru", title: "From Fighting to Coaching Seven World Champions", theme: "Purpose", image: "/media/episodes/episode-01.webp", url: "https://www.youtube.com/watch?v=VoAk3qxwHpQ" },
  { number: "02", guest: "Caitlin Sinclair", title: "The Toxic Overload Ruining America", theme: "Culture", image: "/media/episodes/episode-02.webp", url: "https://www.youtube.com/watch?v=DKvJ8cqLeSE" },
  { number: "03", guest: "The Lollis", title: "The Truth About Parenting in Modern Society", theme: "Family", image: "/media/episodes/episode-03.webp", url: "https://www.youtube.com/watch?v=Q28jL8bfVeU" },
  { number: "04", guest: "Olivia Audrey", title: "Your Body Is Listening to Everything You Think and Feel", theme: "Wellness", image: "/media/episodes/episode-04.webp", url: "https://www.youtube.com/watch?v=nCkQ1NJHCew" },
  { number: "05", guest: "Denis & Marianne Beausejour", title: "How Forgiveness Saved a Marriage and Built a Legacy", theme: "Marriage", image: "/media/episodes/episode-05.webp", url: "https://www.youtube.com/watch?v=8vqpUurOfKA" },
  { number: "06", guest: "John Kiriakou", title: "Truth, Betrayal and the Cost of Speaking Out", theme: "Truth", image: "/media/episodes/episode-06.webp", url: "https://www.youtube.com/watch?v=yJVUqlEZ2zQ" },
  { number: "07", guest: "Dr. Gina Loudon", title: "The Spiritual Battle for Our Children, Families and Future", theme: "Faith", image: "/media/episodes/episode-07.webp", url: "https://www.youtube.com/watch?v=nLbDrhzeyac" },
];

const themes = ["All", "Purpose", "Culture", "Family", "Wellness", "Marriage", "Truth", "Faith"];

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [activeTheme, setActiveTheme] = useState("All");
  const [query, setQuery] = useState("");
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [guestSent, setGuestSent] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setReady(true), reducedMotion ? 50 : 2700);

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12 },
    );

    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let cleanup = () => {};

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      const gsap = gsapModule.default;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !heroRef.current) return;

      const context = gsap.context(() => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
          gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom bottom", scrub: 1.05, invalidateOnRefresh: true },
          })
            .to(".hero__grid", { yPercent: 10, scale: 1.08, duration: 1 }, 0)
            .to(".hero__halo", { yPercent: -10, scale: 1.35, opacity: 0.12, duration: 1 }, 0)
            .to(".hero__scroll-cue", { autoAlpha: 0, duration: 0.1 }, 0.14)
            .to(".hero__back-title", { yPercent: -42, scale: 0.96, autoAlpha: 0, duration: 0.18 }, 0.2)
            .to(".hero__subject--primary", { yPercent: 28, scale: 1.03, autoAlpha: 0, duration: 0.2 }, 0.2)
            .fromTo(".hero__copy", { y: 80, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.27, ease: "power2.out" }, 0.39)
            .to(".hero__copy", { yPercent: -20, autoAlpha: 0, duration: 0.12 }, 0.75)
            .fromTo(".hero__interlude", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.2 }, 0.8)
            .fromTo(".hero__interlude-copy", { y: 90, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.12, ease: "power2.out" }, 0.88);
        });

        mm.add("(max-width: 767px)", () => {
          gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true },
          })
            .to(".hero__grid", { yPercent: 6, scale: 1.05, duration: 1 }, 0)
            .to(".hero__halo", { yPercent: -7, scale: 1.18, opacity: 0.1, duration: 1 }, 0)
            .to(".hero__scroll-cue", { autoAlpha: 0, duration: 0.1 }, 0.14)
            .to(".hero__back-title", { yPercent: -30, autoAlpha: 0, duration: 0.18 }, 0.2)
            .to(".hero__subject--primary", { yPercent: 30, scale: 1.02, autoAlpha: 0, duration: 0.2 }, 0.2)
            .fromTo(".hero__copy", { y: 45, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.27, ease: "power2.out" }, 0.39)
            .to(".hero__copy", { yPercent: -16, autoAlpha: 0, duration: 0.12 }, 0.75)
            .fromTo(".hero__interlude", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.2 }, 0.8)
            .fromTo(".hero__interlude-copy", { y: 45, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.12, ease: "power2.out" }, 0.88);
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
          const distance = Number(element.dataset.parallax ?? 8);
          gsap.fromTo(element, { yPercent: distance }, {
            yPercent: -distance,
            ease: "none",
            scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: 1.1 },
          });
        });

        cleanup = () => mm.revert();
      });

      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad, { once: true });
      ScrollTrigger.refresh();
      cleanup = () => {
        window.removeEventListener("load", onLoad);
        context.revert();
      };
    });

    return () => cleanup();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const filteredEpisodes = useMemo(() => {
    const search = query.trim().toLowerCase();
    return episodes.filter((episode) => {
      const matchesTheme = activeTheme === "All" || episode.theme === activeTheme;
      const matchesSearch = !search || `${episode.guest} ${episode.title} ${episode.theme}`.toLowerCase().includes(search);
      return matchesTheme && matchesSearch;
    });
  }, [activeTheme, query]);

  const handleNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterSent(true);
  };

  const handleGuest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGuestSent(true);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className={ready ? "site-ready" : ""}>
      <div className={`intro ${ready ? "intro--complete" : ""}`} aria-hidden="true">
        <div className="intro__panel intro__panel--top" />
        <div className="intro__panel intro__panel--bottom" />
        <div className="intro__content">
          <img src="/media/tmsd-logo.svg" alt="" />
          <p>Preserving what must not be lost</p>
        </div>
      </div>

      <div className="grain" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#home" aria-label="To My Sons and Daughters home">
          <img className="brand__logo" src="/media/tmsd-logo.svg" alt="" />
          <span className="brand__name">To My Sons &amp; Daughters</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#purpose">Purpose</a>
          <a href="#archive">Podcast</a>
          <a href="#host">Ben Swann</a>
          <a href="#join">Join</a>
        </nav>
        <button className="menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="mobile-navigation">
          <span>{menuOpen ? "Close" : "Menu"}</span><i /><i />
        </button>
      </header>

      <div className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`} id="mobile-navigation" aria-hidden={!menuOpen}>
        <nav aria-label="Mobile navigation">
          <a href="#purpose" onClick={closeMenu}><span>01</span>Purpose</a>
          <a href="#archive" onClick={closeMenu}><span>02</span>Podcast</a>
          <a href="#host" onClick={closeMenu}><span>03</span>Ben Swann</a>
          <a href="#join" onClick={closeMenu}><span>04</span>Join</a>
        </nav>
        <p>A living library for future generations.</p>
      </div>

      <section className="hero-scroll" id="home" ref={heroRef}>
        <div className="hero">
          <div className="hero__grid" aria-hidden="true" />
          <div className="hero__halo" aria-hidden="true" />
          <div className="hero__title-stage" aria-hidden="true">
            <div className="hero__back-title"><span>To My</span><strong>Sons &amp;</strong><strong>Daughters</strong></div>
          </div>
          <div className="hero__portrait-stage">
            <img className="hero__subject hero__subject--primary" src="/media/ben-cutout.webp" alt="Ben Swann, host of To My Sons and Daughters" />
          </div>

          <div className="hero__copy">
            <p className="kicker">A podcast by Ben Swann</p>
            <h1>Truth worth<br />leaving behind.</h1>
            <p className="hero__lede">A living library of lessons, conversations and truth created for the moments future generations will need them most.</p>
            <div className="hero__actions">
              <a className="button button--light" href="#archive">Enter the archive <span>↓</span></a>
              <a className="text-link" href="https://www.youtube.com/@ToMySonsandDaughtersPodcast" target="_blank" rel="noreferrer">Watch on YouTube ↗</a>
            </div>
          </div>

          <div className="hero__scroll-cue" aria-hidden="true"><span>Scroll to enter</span><i /></div>

          <div className="hero__interlude" aria-hidden="true">
            <div className="hero__interlude-noise" />
            <div className="hero__interlude-copy"><span>The noise fades.</span><strong>The archive remains.</strong></div>
          </div>
        </div>
      </section>

      <section className="purpose" id="purpose">
        <div className="purpose__heading" data-reveal>
          <p className="section-label">01 — The Purpose</p>
          <h2>Not another<br />news cycle.</h2>
          <em>An inheritance.</em>
        </div>
        <p className="purpose__intro" data-reveal>The headlines disappear. Principles remain. This archive leaves the noise behind to preserve the failures, redemptions and hard-earned wisdom that can guide a family through generations.</p>
        <div className="principles">
          <article data-reveal><span>01</span><h3>Truth without varnish</h3><p>Conversations that refuse easy answers and fashionable narratives.</p></article>
          <article data-reveal><span>02</span><h3>Wisdom earned</h3><p>Lessons shaped by failure, responsibility, forgiveness and renewal.</p></article>
          <article data-reveal><span>03</span><h3>Legacy shared</h3><p>Stories built for children, parents and anyone searching for direction.</p></article>
        </div>
      </section>

      <section className="featured" aria-labelledby="featured-title">
        <a className="featured__visual" href={episodes[6].url} target="_blank" rel="noreferrer" aria-label={`Watch ${episodes[6].title} on YouTube`}>
          <div className="featured__image" data-parallax="5"><img src={episodes[6].image} alt={`Ben Swann with ${episodes[6].guest}`} /></div>
          <span className="play">Play</span>
          <span className="featured__entry">Latest entry · 07</span>
        </a>
        <div className="featured__copy" data-reveal>
          <p className="section-label">New in the archive</p>
          <h2 id="featured-title">The spiritual battle for our children, families and future.</h2>
          <p>Dr. Gina Loudon joins Ben Swann for a conversation on faith, adoption, homeschooling and protecting what is sacred.</p>
          <div className="featured__meta"><span>Dr. Gina Loudon</span><span>Faith · Family · Future</span></div>
          <a className="button button--outline" href={episodes[6].url} target="_blank" rel="noreferrer">Watch the conversation ↗</a>
        </div>
      </section>

      <section className="archive" id="archive">
        <div className="archive__heading" data-reveal>
          <div><p className="section-label">02 — The Living Library</p><h2>Join the<br />conversation.</h2></div>
          <p>Seven entries. Seven lives. One growing archive of ideas worth carrying forward.</p>
        </div>

        <div className="archive__tools">
          <div className="filters" aria-label="Filter episodes by theme">
            {themes.map((theme) => <button type="button" key={theme} className={activeTheme === theme ? "is-active" : ""} onClick={() => setActiveTheme(theme)}>{theme}</button>)}
          </div>
          <label className="search"><span className="sr-only">Search the archive</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the archive" /><span>⌕</span></label>
        </div>

        <div className="episode-grid">
          {filteredEpisodes.map((episode) => (
            <article className="episode-card" key={episode.number} data-reveal>
              <a href={episode.url} target="_blank" rel="noreferrer">
                <div className="episode-card__image"><img src={episode.image} alt={`${episode.guest} on To My Sons and Daughters`} /><span>Entry {episode.number}</span><i>Watch ↗</i></div>
                <div className="episode-card__copy"><span>{episode.theme}</span><div><h3>{episode.title}</h3><p>With {episode.guest}</p></div></div>
              </a>
            </article>
          ))}
        </div>
        {filteredEpisodes.length === 0 && <p className="empty">No entry matches that search. Try another name or theme.</p>}
      </section>

      <section className="host" id="host">
        <div className="host__media" data-reveal>
          <div className="host__halo" aria-hidden="true" />
          <img src="/media/ben-cover.webp" alt="Ben Swann, host of To My Sons and Daughters" data-parallax="6" />
          <span><strong>20+</strong> Years pursuing truth</span>
        </div>
        <div className="host__copy" data-reveal>
          <p className="section-label">03 — The Imperfect Messenger</p>
          <h2>Ben Swann spent decades reporting on the world. Then the most important story became legacy.</h2>
          <p>For more than twenty years, Ben built a career asking difficult questions and covering stories others would not touch. But as a father of five and grandfather of two, reporting was no longer enough.</p>
          <p>To My Sons and Daughters is his time capsule: an archive of principles that do not expire, built for his children and shared with every parent, son and daughter searching for deeper truth.</p>
          <a className="text-link text-link--dark" href="https://www.youtube.com/@ToMySonsandDaughtersPodcast" target="_blank" rel="noreferrer">Meet Ben through the conversations ↗</a>
        </div>
        <blockquote data-reveal>“The truth is not merely something we report. It is something we leave behind.”</blockquote>
      </section>

      <section className="voices" aria-labelledby="voices-title">
        <p className="section-label">04 — Voices in the Archive</p>
        <h2 id="voices-title" data-reveal>People who have<br />lived the lesson.</h2>
        <div className="marquee" aria-hidden="true">
          <div>PHIL DARU · CAITLIN SINCLAIR · THE LOLLIS · OLIVIA AUDREY · DENIS &amp; MARIANNE BEAUSEJOUR · JOHN KIRIAKOU · DR. GINA LOUDON ·&nbsp;</div>
          <div>PHIL DARU · CAITLIN SINCLAIR · THE LOLLIS · OLIVIA AUDREY · DENIS &amp; MARIANNE BEAUSEJOUR · JOHN KIRIAKOU · DR. GINA LOUDON ·&nbsp;</div>
        </div>
      </section>

      <section className="join" id="join">
        <div className="join__heading" data-reveal><p className="section-label">05 — Continue the Library</p><h2>Some conversations are meant to outlive us.</h2></div>
        <div className="join__grid">
          <article className="join-card" data-reveal>
            <span>01</span><h3>Receive the next entry.</h3><p>New conversations, selected lessons and notes from the archive—delivered without the noise.</p>
            {newsletterSent ? <p className="success">Your place in the archive is noted. Email delivery will be connected for launch.</p> : <form onSubmit={handleNewsletter}><label><span className="sr-only">Email address</span><input type="email" required placeholder="Your email address" /></label><button type="submit">Join the library →</button></form>}
          </article>
          <article className="join-card join-card--light" data-reveal>
            <span>02</span><h3>Bring a story worth preserving.</h3><p>Have you lived through failure, redemption or a lesson future generations need to hear?</p>
            {guestSent ? <p className="success">Your interest is noted. The full guest application will be connected for launch.</p> : <form onSubmit={handleGuest}><label><span className="sr-only">Your name</span><input type="text" required placeholder="Your name" /></label><button type="submit">Become a guest →</button></form>}
          </article>
        </div>
      </section>

      <footer className="footer">
        <img src="/media/brand-logo.webp" alt="To My Sons and Daughters Podcast" />
        <p>A living library for the people we love—and the future we may never see.</p>
        <div className="footer__links">
          <a href="https://www.youtube.com/@ToMySonsandDaughtersPodcast" target="_blank" rel="noreferrer">YouTube ↗</a>
          <span>Spotify — Coming soon</span><span>Apple Podcasts — Coming soon</span><a href="mailto:info@company.com">Contact</a>
        </div>
        <div className="footer__bottom"><span>© 2026 To My Sons &amp; Daughters</span><span>Built to endure.</span></div>
      </footer>
    </main>
  );
}
