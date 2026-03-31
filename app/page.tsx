export default function Home() {
  const stats = [
    { label: "Aktivni oglasi", value: "1.240+" },
    { label: "Povprečen čas odziva", value: "2 uri" },
    { label: "Oddane ponudbe", value: "4.800+" },
  ];

  const ownerFeatures = [
    {
      title: "Preprosta objava",
      description:
        "Dodajte fotografije, lokacijo, opis in osnovne podatke v manj kot 5 minutah.",
    },
    {
      title: "Urejanje oglasov",
      description:
        "Posodabljajte cene, status in dodatke, brez čakanja na posrednike.",
    },
    {
      title: "Analitika zanimanja",
      description:
        "Spremljajte oglede, shranjene oglase in prejete ponudbe v enem pogledu.",
    },
  ];

  const buyerFeatures = [
    {
      title: "Pametni filtri",
      description:
        "Lokacija, cena, kvadratura in posebnosti so vedno pri roki.",
    },
    {
      title: "Neposredna komunikacija",
      description:
        "Vprašajte lastnika in prejmite odgovor brez posrednikov.",
    },
    {
      title: "Ponudbe z enim klikom",
      description:
        "Pošljite ponudbo z izbranim zneskom in rokom za odgovor.",
    },
  ];

  const listings = [
    {
      title: "Loft v starem mestnem jedru",
      location: "Ljubljana, Center",
      price: "€ 385.000",
      meta: "82 m² • 3 sobe • Balkon",
    },
    {
      title: "Družinska hiša z vrtom",
      location: "Maribor, Tabor",
      price: "€ 420.000",
      meta: "185 m² • 5 sob • Garaža",
    },
    {
      title: "Sončno stanovanje ob parku",
      location: "Koper, Semedela",
      price: "€ 289.000",
      meta: "68 m² • 2 sobi • Pogled na morje",
    },
  ];

  return (
    <div className="min-h-screen text-[#1f2933]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0f6e68] text-sm font-semibold text-white">
            EH
          </div>
          <div>
            <p className="font-display text-lg font-semibold tracking-tight">
              EstateHub
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-[#5f6b73]">
              nepremičnine
            </p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium text-[#3a434a] md:flex">
          <a className="transition hover:text-[#0f6e68]" href="#oglasi">
            Oglasi
          </a>
          <a className="transition hover:text-[#0f6e68]" href="#lastniki">
            Za lastnike
          </a>
          <a className="transition hover:text-[#0f6e68]" href="#kupci">
            Za kupce
          </a>
          <a className="transition hover:text-[#0f6e68]" href="#ponudbe">
            Ponudbe
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <button className="hidden rounded-full border border-[rgba(31,41,51,0.2)] px-4 py-2 text-sm font-semibold text-[#1f2933] transition hover:border-[#0f6e68] hover:text-[#0f6e68] md:inline-flex">
            Prijava
          </button>
          <button className="rounded-full bg-[#0f6e68] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#0f6e68]/30 transition hover:-translate-y-0.5 hover:bg-[#0b4f4b]">
            Ustvari račun
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-24 pt-16">
        <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] animate-fade-up">
          <div className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-3 rounded-full border border-[#0f6e68]/30 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f6e68]">
              Nepremičnine brez posrednikov
            </div>
            <h1 className="font-display text-4xl font-semibold leading-tight text-[#1f2933] sm:text-5xl">
              Objavite, najdite in prodajte nepremičnino z občutkom zaupanja.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-[#5f6b73]">
              EstateHub je prostor, kjer lastniki hitro objavijo oglase, kupci pa
              iščejo z naprednimi filtri, pošiljajo ponudbe in komunicirajo brez
              zamud.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="rounded-full bg-[#0f6e68] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0f6e68]/30 transition hover:-translate-y-0.5 hover:bg-[#0b4f4b]">
                Objavi nepremičnino
              </button>
              <button className="rounded-full border border-[#0f6e68]/40 px-6 py-3 text-sm font-semibold text-[#0f6e68] transition hover:bg-[#0f6e68]/10">
                Razišči oglase
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[rgba(31,41,51,0.12)] bg-white/80 px-4 py-3"
                >
                  <p className="text-2xl font-semibold text-[#1f2933]">
                    {stat.value}
                  </p>
                  <p className="text-xs uppercase tracking-[0.25em] text-[#5f6b73]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel flex flex-col gap-6 rounded-3xl p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#5f6b73]">
                Iskalni filter
              </p>
              <h2 className="font-display text-2xl font-semibold text-[#1f2933]">
                Najdite pravo nepremičnino
              </h2>
            </div>
            <div className="grid gap-4">
              <div className="rounded-2xl border border-[rgba(31,41,51,0.15)] bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[#5f6b73]">
                  Lokacija
                </p>
                <p className="text-sm font-semibold text-[#1f2933]">
                  Ljubljana, okolica
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[rgba(31,41,51,0.15)] bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#5f6b73]">
                    Cena do
                  </p>
                  <p className="text-sm font-semibold text-[#1f2933]">
                    € 450.000
                  </p>
                </div>
                <div className="rounded-2xl border border-[rgba(31,41,51,0.15)] bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#5f6b73]">
                    Kvadratura
                  </p>
                  <p className="text-sm font-semibold text-[#1f2933]">
                    60 - 120 m²
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-[rgba(31,41,51,0.15)] bg-white px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#5f6b73]">
                  Posebnosti
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-[#0f6e68]">
                  <span className="rounded-full bg-[#0f6e68]/10 px-3 py-1">
                    Balkon
                  </span>
                  <span className="rounded-full bg-[#0f6e68]/10 px-3 py-1">
                    Dvigalo
                  </span>
                  <span className="rounded-full bg-[#0f6e68]/10 px-3 py-1">
                    Parkirišče
                  </span>
                </div>
              </div>
            </div>
            <button className="rounded-2xl bg-[#1f2933] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0f6e68]">
              Prikaži rezultate
            </button>
          </div>
        </section>

        <section id="oglasi" className="flex flex-col gap-10 animate-fade-up-slow">
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.3em] text-[#5f6b73]">
              Oglasi
            </p>
            <h2 className="font-display text-3xl font-semibold text-[#1f2933]">
              Trenutno izpostavljene nepremičnine
            </h2>
            <p className="max-w-2xl text-base leading-7 text-[#5f6b73]">
              Pregledno oblikovani oglasi z vsemi ključnimi podatki in prostorom
              za hitro pošiljanje vprašanj ali ponudb.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {listings.map((listing) => (
              <article
                key={listing.title}
                className="flex h-full flex-col justify-between rounded-3xl border border-[rgba(31,41,51,0.12)] bg-white/90 p-6 shadow-[0_18px_30px_rgba(31,41,51,0.08)] transition hover:-translate-y-1"
              >
                <div className="flex flex-col gap-4">
                  <div className="h-40 rounded-2xl bg-[linear-gradient(130deg,#f6d6b8_0%,#e8efe9_50%,#d4efe9_100%)]" />
                  <div>
                    <h3 className="text-lg font-semibold text-[#1f2933]">
                      {listing.title}
                    </h3>
                    <p className="text-sm text-[#5f6b73]">{listing.location}</p>
                  </div>
                  <p className="text-2xl font-semibold text-[#0f6e68]">
                    {listing.price}
                  </p>
                  <p className="text-sm text-[#5f6b73]">{listing.meta}</p>
                </div>
                <div className="mt-6 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-[#5f6b73]">
                  <span>Objavljeno danes</span>
                  <span className="text-[#0f6e68]">Podrobnosti</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-2">
          <div id="lastniki" className="flex flex-col gap-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#5f6b73]">
              Za lastnike
            </p>
            <h2 className="font-display text-3xl font-semibold text-[#1f2933]">
              Vse za objavo nepremičnine na enem mestu
            </h2>
            <p className="text-base leading-7 text-[#5f6b73]">
              Dodajte fotografije, opise in ključne podatke ter oglas urejajte
              kadarkoli. EstateHub poskrbi, da je vaša ponudba vidna pravim
              kupcem.
            </p>
            <div className="gradient-divider h-px w-full" />
            <div className="grid gap-4">
              {ownerFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-[rgba(31,41,51,0.12)] bg-white/80 p-5"
                >
                  <h3 className="text-base font-semibold text-[#1f2933]">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-6 text-[#5f6b73]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div id="kupci" className="glass-panel flex flex-col gap-6 rounded-3xl p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[#5f6b73]">
              Za kupce
            </p>
            <h2 className="font-display text-3xl font-semibold text-[#1f2933]">
              Osredotočeni filtri in jasna komunikacija
            </h2>
            <p className="text-base leading-7 text-[#5f6b73]">
              Filtri vam omogočajo, da najdete popolno nepremičnino, nato pa
              z lastnikom nadaljujete pogovor v varnem prostoru EstateHub.
            </p>
            <div className="grid gap-4">
              {buyerFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-[rgba(31,41,51,0.12)] bg-white/90 p-5"
                >
                  <h3 className="text-base font-semibold text-[#1f2933]">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-6 text-[#5f6b73]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
            <button className="mt-2 w-full rounded-2xl bg-[#0f6e68] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0f6e68]/30 transition hover:-translate-y-0.5 hover:bg-[#0b4f4b]">
              Ustvari iskalni profil
            </button>
          </div>
        </section>

        <section id="ponudbe" className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-panel flex flex-col gap-6 rounded-3xl p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[#5f6b73]">
              Sporočila in ponudbe
            </p>
            <h2 className="font-display text-3xl font-semibold text-[#1f2933]">
              Vse komunikacije ostanejo urejene
            </h2>
            <p className="text-base leading-7 text-[#5f6b73]">
              Prejemajte ponudbe, odgovarjajte na vprašanja in spremljajte
              interes skozi pregledno časovnico.
            </p>
            <div className="rounded-2xl border border-[rgba(31,41,51,0.12)] bg-white/90 p-5 text-sm text-[#3a434a]">
              <p className="font-semibold text-[#1f2933]">
                Nova ponudba za &quot;Loft v starem mestnem jedru&quot;
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#5f6b73]">
                Rok za odgovor
              </p>
              <p className="text-base font-semibold text-[#0f6e68]">
                48 ur
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-6 rounded-3xl border border-[rgba(31,41,51,0.12)] bg-white/85 p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[#5f6b73]">
              Postopek
            </p>
            <h3 className="font-display text-2xl font-semibold text-[#1f2933]">
              Preprost proces od objave do prodaje
            </h3>
            <div className="grid gap-4">
              {[
                "Ustvarite račun in potrdite svojo identiteto.",
                "Objavite oglas in dodajte fotografije ter podrobnosti.",
                "Prejmite ponudbe, se dogovorite in zaključite prodajo.",
              ].map((step) => (
                <div
                  key={step}
                  className="rounded-2xl border border-[rgba(31,41,51,0.12)] bg-[#fef7ec] p-5 text-sm font-semibold text-[#1f2933]"
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-[#0f6e68] px-8 py-12 text-white shadow-[0_30px_60px_rgba(15,110,104,0.35)] animate-fade-up">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                Pripravljeni?
              </p>
              <h2 className="font-display text-3xl font-semibold">
                Zgradimo zaupanje med lastniki in kupci.
              </h2>
              <p className="mt-3 text-base leading-7 text-white/80">
                EstateHub nudi jasno komunikacijo, pregledne ponudbe in hitro
                objavo oglasov. Vse, kar potrebujete za prodajo ali nakup.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0f6e68] transition hover:-translate-y-0.5 hover:bg-[#fef7ec]">
                Ustvari račun
              </button>
              <button className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Kontaktiraj nas
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[rgba(31,41,51,0.12)] bg-white/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-[#5f6b73] md:flex-row md:items-center md:justify-between">
          <p>© 2026 EstateHub. Vse pravice pridržane.</p>
          <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em]">
            <span>Pravila uporabe</span>
            <span>Zasebnost</span>
            <span>Pomoč</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
