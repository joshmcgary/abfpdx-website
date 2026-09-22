import { useEffect, useRef, useState } from 'react'
import { beliefs, ministries, staff, sundays } from './content.js'

const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
const Arrow = () => <span aria-hidden="true">↗</span>

const staffGroupDetails = {
  Pastors: { title: 'Pastors', subtitle: 'Elders · Overseers' },
  Deacons: { title: 'Deacons', subtitle: 'Managers · Helpers' },
  'Interns & Staff': { title: 'Interns & Staff', subtitle: 'Teachers · Volunteers' },
}

function MinistryIcon({ type }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }
  return <div className={`ministry-icon icon-${type.toLowerCase()}`} aria-hidden="true">
    <svg viewBox="0 0 48 48" role="img">
      <circle cx="24" cy="24" r="22" {...common}/>
      {type === 'Education' && <g {...common}><path className="book-page page-left" d="M13 16.5h7.5c2 0 3.5.8 3.5 2.5v14c0-1.7-1.5-2.5-3.5-2.5H13z"/><path className="book-page page-right" d="M35 16.5h-7.5c-2 0-3.5.8-3.5 2.5v14c0-1.7 1.5-2.5 3.5-2.5H35z"/></g>}
      {type === 'Wellness' && <g {...common}><path className="health-pulse" pathLength="100" d="M11 25h7l3-7 5.5 13 3.5-8 2 2h5"/></g>}
      {type === 'Arts' && <g {...common}><path className="art-star star-main" d="m24 11 2.7 8.3L35 22l-8.3 2.7L24 33l-2.7-8.3L13 22l8.3-2.7z"/><path className="art-star star-small" d="m34.5 31 .9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9z"/></g>}
      {type === 'Community' && <g className="community-network" {...common}><circle cx="24" cy="16" r="4"/><circle cx="14.5" cy="29" r="4"/><circle cx="33.5" cy="29" r="4"/><path d="m21.5 19.5-4.5 6M26.5 19.5l4.5 6M18.5 29h11"/></g>}
    </svg>
  </div>
}

function TiltMedia({ children }) {
  const tilt = (event) => {
    const element = event.currentTarget
    const bounds = element.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    element.style.setProperty('--tilt-x', `${(-y * 8).toFixed(2)}deg`)
    element.style.setProperty('--tilt-y', `${(x * 10).toFixed(2)}deg`)
    element.style.setProperty('--shine-x', `${((x + 0.5) * 100).toFixed(0)}%`)
    element.style.setProperty('--shine-y', `${((y + 0.5) * 100).toFixed(0)}%`)
  }

  const reset = (event) => {
    const element = event.currentTarget
    element.style.setProperty('--tilt-x', '0deg')
    element.style.setProperty('--tilt-y', '0deg')
    element.style.setProperty('--shine-x', '50%')
    element.style.setProperty('--shine-y', '50%')
  }

  return <div className="tilt-media" onPointerMove={tilt} onPointerLeave={reset} onPointerUp={reset} onPointerCancel={reset}>{children}</div>
}

function StatementVideo() {
  const videoRef = useRef(null)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    const begin = () => video.play().catch(() => {})
    begin()
    video.addEventListener('canplay', begin)
    document.addEventListener('visibilitychange', begin)
    return () => { video.removeEventListener('canplay', begin); document.removeEventListener('visibilitychange', begin) }
  }, [])
  return <video ref={videoRef} className="statement-video" autoPlay muted loop playsInline preload="auto" aria-hidden="true"><source src={asset('video/statement-loop-sdr.mp4')} type="video/mp4"/></video>
}

function UpcomingSunday() {
  const today = new Date()
  const upcoming = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  upcoming.setDate(upcoming.getDate() + ((7 - upcoming.getDay()) % 7))
  const week = Math.ceil(upcoming.getDate() / 7)
  const sunday = week === 1 ? sundays[0] : week === 2 ? sundays[1] : week <= 4 ? sundays[2] : sundays[3]
  const date = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(upcoming)

  return <aside className="upcoming-sunday" aria-label="Upcoming Sunday">
    <div><span className="status-dot"/><p>Coming up next</p></div>
    <strong>{sunday.title}</strong>
    <time dateTime={upcoming.toISOString().slice(0, 10)}>{date}</time>
    <small>{sunday.text}</small>
  </aside>
}

const aboutPrinciples = [
  { title: 'The Bible', text: `Aletheia Bible Fellowship is a Bible-believing church. We believe that the Bible in its original language and its translations are subject to the hermeneutical context in which it was written. All translations which produce an accurate transmission of this context are honest and true. We adhere to the tenets therein as absolutely authoritative, immutable, and complete in their application to the worldview of our fellowship and Christianity at large.` },
  { title: 'Doctrine', text: `We believe in the Bible as informative of all aspects of life. We believe that the Bible is God’s divine revelation into creation in order to create tenants by which man may live in right harmony with his creator.` },
  { title: 'Affiliations', text: `We do not knowingly involve ourselves with ideas, goals, actions or persons that violate, seek to circumvent, diminish or exclude these tenants as a matter of partnership.` },
  { title: 'Interpretations of Interaction', text: `The tenets of scripture are interpreted by the congregationally affirmed and biblically qualified Eldership of Aletheia Bible Fellowship in light of the accountability of the church universal in its most inclusive sense, from the largest whole to its smallest member. It is interpreted against the weight of previous interpretations, including the wealth of orthodox theology as well as the canon of scripture affirmed in the council of Nicea.\n\nIt is measured against the Old Testament canon endorsed by the voice of Jesus Christ in his ownership of the Septuagint. It is weighed against the evidence of God witnessed in the breadth of his creation including the heart of men, the psychology of men, and nature itself. It is measured against established historical data.` },
  { title: 'Responsibility of the Eldership', text: `Wherein these weights do not create a substantial ruling as to the ideas, goals, actions or persons which these weights seek to inform, the Eldership of Aletheia Bible Fellowship determines these factors with the weight of their own experience in transparent and accountable congress as extra-biblical principles useful for specific hermeneutical truths not necessarily connected to the general overarching narrative of God’s plan for humanity found within scripture.` },
  { title: 'Additional Specific Core Presuppositions', text: `The Eldership of Aletheia Bible Fellowship in matters of social principles endorses with prejudice:\n\n-the familial relationship found in a naturally occuring, genetically xx and xy partnership, defined in monogamy of heart, mind, and soul before God and man and following his hierarchy of submission, demonstrated by the polity of the Trinity and outlined in the heteronormativity of the Bible.\n\n-the people of Israel as the chosen people of God to convey his narrative for mankind.\n\n-we affirm the sovereign state of Israel as an outworking of God’s plan for his people and a fulfillment of biblical prophecy.\n\n-the sanctity of mankind as made in God’s image, created for a purpose and intrinsically connected to God.\n\n-the sovereignty of God in all matters and the holiness of his people in matters of partnerships.\n\nThe Eldership of Aletheia Bible Fellowship in matters of social principles will not endorse:\n\n-glorification of ideas which violate as a matter of principle, those things which seek to usurp the biblical tenants on any level. This includes but is not limited to the: spiritual, mental, physical, or psychological level.\n\n-this may include things which outside of the biblical context and extra-biblical context include things that:\n\n-glorify spirituality, demons, angels or the metaphysical\n\n-diminish the station of human beings on a physical, mental or psychological level\n\n-glorify inappropriate relationships between God’s creation on a physical, mental or psychological level\n\n-promote a contrary doctrine as a matter of intent, indifference or ignorance` }
]

const communityResources = [
  { id: 'outsiders', label: 'Outsiders', eyebrow: 'Ages 13+', title: 'Outsiders', image: 'outsiders.jpg', text: 'A weekly time of chosen family for those learning what it means to be a person made in God’s image.' },
  { id: 'lum', label: 'Lūm', eyebrow: 'Ages 16+', title: 'Lūm', image: 'brand', text: 'A bi-monthly gathering of young adults learning to take care of others and find their place in the greater church.' },
  { id: 'studios', label: 'ABF Studios', eyebrow: 'Daily content', title: 'ABF Studios', image: 'abf-media.jpg', text: 'Various podcasts by members of our congregation providing daily trusted content for our fast paced world.', links: [['Explore ABF on YouTube', 'https://www.youtube.com/@abfpdx']] },
  { id: 'academy', label: 'Elders’ Academy', eyebrow: 'Age 18+', title: 'The Elders’ Academy', image: 'elders-academy.jpg', text: 'A seven year course where men can learn how to shepherd the church, with hands on guidance through church history, Doctrinal studies and church administration.' },
  { id: 'ravens', label: 'Feast With Ravens', eyebrow: 'Age 10+', title: 'Feast With Ravens', image: 'feast-with-ravens.jpg', text: 'The house band of ABF that takes musicians of all skill levels and helps them to develop their craft for worship in songwriting, performance and production.', links: [['YouTube', 'https://www.youtube.com/channel/UConebLzSvXXhpbQiwFWZNHw'], ['Spotify', 'https://open.spotify.com/artist/4EM8Zeuhi8k624BUmhR0A7']] },
  { id: 'insight', label: 'ABF Care', eyebrow: 'Counseling resource', title: 'ABF Care', image: 'insight-counseling.jpg', text: 'ABF’s biblical counseling resource that uses their proprietary ADAC system in submission to biblical principles for help with loving God with our whole self.', links: [['Contact a chaplain', 'mailto:counseling@abfpdx.org']] },
  { id: 'lamplighter', label: 'Lamplighter', eyebrow: 'Active project', title: 'Project Lamplighter', image: 'project-lamplighter.jpg', text: 'A way to teach the church about the world around them by having real conversations while we fill out a survey. The lamplighter survey is updated each month and is offered in person every 2nd and 3rd Sunday in the community.', links: [['Explore live findings', 'https://metasurvey-app.lucidknight.chatgpt.site/showroom'], ['Take the anonymous survey', 'https://public.getmetasurvey.com/survey/6671e4dec876b70012bc942d']] }
]

function CommunityResourcesSection() {
  const [activeId, setActiveId] = useState('lamplighter')
  const resource = communityResources.find(item => item.id === activeId)
  return <section className={`community-resources resource-${activeId}`} aria-labelledby="resources-title">
    <header className="resources-heading"><div><p className="section-label">Created and shared by ABF</p><h2 id="resources-title">Community<br/>resources.</h2></div><p>Programs, gatherings, care, teaching, and creative work designed to help people grow and participate in the life of the church.</p></header>
    <nav className="resource-switch" aria-label="Choose a community resource">{communityResources.map(item => <button type="button" className={activeId === item.id ? 'is-active' : ''} aria-pressed={activeId === item.id} onClick={() => setActiveId(item.id)} key={item.id}>{item.label}</button>)}</nav>
    <div className="resource-stage" key={activeId}><article className="resource-spotlight"><div className={`resource-visual${resource.image === 'brand' ? ' is-brand' : ''}`}>{resource.image === 'brand' ? <img src={asset('brand/abf-logo-light.png')} alt="Aletheia Bible Fellowship"/> : <img src={asset(`resources/${resource.image}`)} alt={`${resource.title} at ABF`}/>}</div><div className="resource-copy"><p className="section-label">{resource.eyebrow}</p><h3>{resource.title}</h3><p>{resource.text}</p><div className="resource-links">{resource.links?.map(([label, href]) => <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined} key={label}>{label} <Arrow /></a>) || <a href="mailto:connect@abfpdx.org">Ask ABF about this resource <Arrow /></a>}</div></div></article></div>
  </section>
}

function StaffCard({ person }) {
  const [flipped, setFlipped] = useState(false)
  return <div className={`staff-card${flipped ? ' is-flipped' : ''}`}>
    <div className="staff-card-inner">
      <button className="staff-face staff-front" type="button" aria-label={`Show biography and links for ${person.name}`} onClick={() => setFlipped(true)} tabIndex={flipped ? -1 : 0}>
        <img src={asset(`staff/${person.image}.jpg`)} alt={`Portrait of ${person.name}`} loading="lazy"/>
        <span className="staff-copy"><strong>{person.name}</strong><small>{person.role}</small>{person.meta && <em>{person.meta}</em>}<i>Click to read bio ↗</i></span>
      </button>
      <div className="staff-face staff-back" onClick={(event) => { if (!event.target.closest('a, button, iframe')) setFlipped(false) }}>
        <span className="staff-back-heading"><span className="staff-back-mark" aria-hidden="true">ABF</span><span><small>{person.role}</small><strong>{person.name}</strong></span></span>
        {person.playlist && flipped && <span className="staff-video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/videoseries?list=${person.playlist}&autoplay=1&mute=1&playsinline=1&controls=0&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1&rel=0`} title={`${person.name} YouTube playlist`} allow="autoplay; encrypted-media; picture-in-picture" loading="lazy" tabIndex="-1"/></span>} 
        <p>{person.bio}</p>
        <span className="staff-actions">{person.email && <a href={`mailto:${person.email}`} tabIndex={flipped ? 0 : -1} aria-label={`Email ${person.name}`}>Email <Arrow /></a>}{person.playlist && <a href={`https://www.youtube.com/playlist?list=${person.playlist}`} target="_blank" rel="noreferrer" tabIndex={flipped ? 0 : -1}>YouTube <Arrow /></a>}{person.website && <a href={person.website} target="_blank" rel="noreferrer" tabIndex={flipped ? 0 : -1}>Website <Arrow /></a>}{person.spotify && <a href={person.spotify} target="_blank" rel="noreferrer" tabIndex={flipped ? 0 : -1}>Spotify <Arrow /></a>}<button className="staff-return" type="button" onClick={() => setFlipped(false)} tabIndex={flipped ? 0 : -1}>Return ↙</button></span>
      </div>
    </div>
  </div>
}

function BeliefsSection() {
  const [page, setPage] = useState('truths')
  const [activeIndex, setActiveIndex] = useState(0)
  const [readerHeight, setReaderHeight] = useState(0)
  const readerRef = useRef(null)
  const summaryRef = useRef(null)
  useEffect(() => {
    const summary = summaryRef.current
    if (!summary) return
    const syncHeight = () => setReaderHeight(summary.offsetHeight)
    syncHeight()
    const observer = new ResizeObserver(syncHeight)
    observer.observe(summary)
    return () => observer.disconnect()
  }, [page])
  const syncSummary = () => {
    const reader = readerRef.current
    if (!reader) return
    const sections = [...reader.querySelectorAll('.belief-source-section')]
    if (reader.scrollTop + reader.clientHeight >= reader.scrollHeight - 4) {
      setActiveIndex(sections.length - 1)
      return
    }
    const marker = reader.scrollTop + reader.clientHeight * .25
    let current = 0
    sections.forEach((section, index) => { if (section.offsetTop - reader.offsetTop <= marker) current = index })
    setActiveIndex(current)
  }
  const goToBelief = (index) => {
    const reader = readerRef.current
    const section = reader?.querySelectorAll('.belief-source-section')[index]
    if (reader && section) reader.scrollTo({ top: section.offsetTop - reader.offsetTop - 24, behavior: 'smooth' })
    setActiveIndex(index)
  }
  return <section className="beliefs" id="beliefs">
    <div className="beliefs-top"><div className="section-heading"><p className="section-label">Truths we know</p><h2>What grounds us.</h2></div><div className={`belief-page-switch is-${page}`} role="group" aria-label="Choose beliefs page"><span aria-hidden="true"/><button type="button" className={page === 'truths' ? 'is-active' : ''} aria-pressed={page === 'truths'} onClick={() => setPage('truths')}>Truths we know</button><button type="button" className={page === 'approach' ? 'is-active' : ''} aria-pressed={page === 'approach'} onClick={() => setPage('approach')}>Our approach</button><button type="button" className={page === 'scripture' ? 'is-active' : ''} aria-pressed={page === 'scripture'} onClick={() => setPage('scripture')}>Scripture</button></div></div>
    <div className={`belief-panel slide-from-${page}`} key={page}>{page === 'truths' ? <><div className="belief-page-intro"><p className="belief-declaration">ABF knows these things to be true for everyone.</p><p>These convictions shape our teaching, our relationships, and our life in the community.</p></div><div className="belief-body"><nav className="belief-summary-list" ref={summaryRef} aria-label="Belief summaries">{beliefs.map((belief, index) => <button type="button" className={activeIndex === index ? 'is-active' : ''} aria-current={activeIndex === index ? 'true' : undefined} onClick={() => goToBelief(index)} key={belief.title}><span>0{index + 1}</span><span><strong>{belief.title}</strong><small>{belief.short}</small></span></button>)}</nav><div className="belief-source" ref={readerRef} style={readerHeight ? { height: `${readerHeight}px` } : undefined} onScroll={syncSummary} tabIndex="0" aria-label="Complete original belief statements">{beliefs.map((belief, index) => <article className="belief-source-section" key={belief.title}><span>0{index + 1} · Complete original text</span><h3>{belief.title}</h3>{belief.full.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</article>)}</div></div></> : page === 'approach' ? <div className="about-reader beliefs-approach"><div><p className="section-label">Our approach</p><h3>How ABF approaches Scripture and doctrine.</h3><p>The following material is preserved from ABF’s original About page.</p></div><div className="about-details">{aboutPrinciples.map((item, index) => <details key={item.title}><summary><span>{String(index + 1).padStart(2, '0')}</span>{item.title}<b aria-hidden="true">+</b></summary>{item.text.split('\n\n').map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</details>)}</div></div> : <div className="scripture-page"><div><p className="section-label">Begin with Scripture</p><h3>A path to the Bible.</h3><p>Whether you are returning to faith, exploring it for the first time, or walking alongside someone else, begin with the words themselves.</p><a className="button" href="https://www.bible.com/" target="_blank" rel="noreferrer">Read the Bible <Arrow /></a></div><div><p className="section-label">Bring your questions</p><h3>What are you carrying?</h3><p>Search for a biblical response to a question you are already asking.</p><form className="question-search" action="https://www.gotquestions.org/search-results.html" method="get" target="_blank"><label className="sr-only" htmlFor="belief-bible-question">Ask a Bible question</label><span><input id="belief-bible-question" name="q" type="search" placeholder="What does the Bible say about…" required/><button type="submit" aria-label="Search GotQuestions.org">Search <Arrow /></button></span><small>Opens your question on GotQuestions.org.</small></form></div></div>}</div>
  </section>
}

function SermonDiscovery() {
  const [topics, setTopics] = useState(null)
  const [coverage, setCoverage] = useState(null)
  const [filter, setFilter] = useState('')
  const [error, setError] = useState(false)
  const [indexOpen, setIndexOpen] = useState(false)
  const toggleIndex = () => {
    setIndexOpen(open => !open)
    if (indexOpen || topics || error) return
    Promise.all(['teaching/topics.json', 'teaching/topic-coverage.json'].map(path => fetch(asset(path))
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Index unavailable')))))
      .then(([data, counts]) => { setTopics(data.entries || []); setCoverage(counts) })
      .catch(() => setError(true))
  }
  const visibleTopics = topics?.filter(item => item.label.toLowerCase().includes(filter.trim().toLowerCase())) || []
  const requestedSubject = filter.trim()
  const recordingCount = coverage?.[requestedSubject.toLowerCase()]

  return <section className="sermon-discovery" aria-labelledby="sermon-discovery-title">
    <div className="sermon-discovery-inner">
      <div className="sermon-discovery-heading"><p className="section-label">Explore the teaching archive</p><h2 id="sermon-discovery-title">Find a sermon.</h2><p>Search the teaching by a theme, Scripture passage, question, or phrase.</p></div>
      <div className={`sermon-search-combo${indexOpen ? ' is-open' : ''}`}>
        <div className="sermon-search-bar"><form className="studios-sermon-search" role="search" action="https://teachings.abfpdx.org/" method="get"><input id="home-sermon-search" name="q" type="search" aria-label="Search ABF sermons" placeholder="Search sermons by theme, Scripture, or question" required/><button type="submit" aria-label="Search sermons" title="Search sermons">⌕</button></form><button className="sermon-index-toggle" type="button" aria-label={indexOpen ? 'Collapse theme and subject index' : 'Expand theme and subject index'} aria-expanded={indexOpen} aria-controls="home-topic-content" onClick={toggleIndex} title={indexOpen ? 'Collapse subject index' : 'Expand subject index'}><span aria-hidden="true">⌄</span></button></div>
        {indexOpen && <div className="home-topic-content" id="home-topic-content"><div className="home-topic-heading"><strong>Browse themes &amp; subjects</strong><span>{topics ? `${topics.length} curated wiki labels` : 'Loading index'}</span></div><label htmlFor="home-topic-filter">Filter the subject index</label><input id="home-topic-filter" type="search" value={filter} onChange={event => setFilter(event.target.value)} placeholder="Find a theme or subject"/>{error ? <p>The index could not load. <a href="https://teachings.abfpdx.org/">Browse it in the teaching archive.</a></p> : topics ? <>{requestedSubject && <a className="home-topic-search-all" href={`https://teachings.abfpdx.org/?q=${encodeURIComponent(requestedSubject)}`}><strong>Search all sermons for “{requestedSubject}”</strong><span>{recordingCount ? `${recordingCount} recordings contain this word in catalogue text or transcripts` : 'Search wiki entries and transcripts, not just index labels'} ↗</span></a>}<p>{visibleTopics.length} curated {visibleTopics.length === 1 ? 'label' : 'labels'} match{visibleTopics.length === 1 ? 'es' : ''}. The subject index is not the full sermon search.</p><div className="home-topic-list">{visibleTopics.map(item => <a key={item.label} href={`https://teachings.abfpdx.org/?q=${encodeURIComponent(item.label)}`}>{item.label}<small>{item.count}</small></a>)}</div></> : <p>Loading the subject index…</p>}</div>}
      </div>
    </div>
  </section>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [installPrompt, setInstallPrompt] = useState(null)

  useEffect(() => {
    const handler = (event) => { event.preventDefault(); setInstallPrompt(event) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    await installPrompt?.prompt()
    setInstallPrompt(null)
  }

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Aletheia Bible Fellowship home"><img src={asset('brand/abf-logo-dark.png')} alt=""/><small>Aletheia Bible Fellowship</small></a>
      <button className="menu-button" aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close' : 'Menu'}</button>
      <nav id="main-nav" className={menuOpen ? 'open' : ''} aria-label="Main navigation">
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#beliefs" onClick={() => setMenuOpen(false)}>Beliefs</a>
        <a href="#people" onClick={() => setMenuOpen(false)}>People</a>
        <a href="https://teachings.abfpdx.org/" onClick={() => setMenuOpen(false)}>Teachings</a>
        <a href="#connect" onClick={() => setMenuOpen(false)}>Connect</a>
        <a className="nav-feature" href="https://www.youtube.com/@abfpdx" target="_blank" rel="noreferrer">Watch ABF <Arrow /></a>
      </nav>
    </header>

    <main id="main">
      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Damascus, Oregon · Since 2004</p>
          <h1>Faith lived<br/>in community.</h1>
          <p className="hero-lede">Rooted in scripture. Expressed through service. A church beyond Sunday mornings.</p>
          <div className="hero-actions"><a className="button" href="#connect">Connect with us</a><a className="text-link" href="#about">Discover ABF <span>↓</span></a></div>
        </div>
        <div className="hero-art" aria-label="Four paths representing ABF's ministries">
          <video className="hero-video" autoPlay muted loop playsInline preload="metadata" poster={asset('video/abf-hero-poster.jpg')} aria-label="Scenes from life at Aletheia Bible Fellowship"><source src={asset('video/abf-hero.mp4')} type="video/mp4"/></video>
          <div className="hero-video-shade" aria-hidden="true"/>
          <p>Education<br/>Wellness<br/>Arts<br/>Community</p>
        </div>
      </section>

      <section className="intro" id="about">
        <p className="section-label">What is ABF?</p>
        <div><h2>A church-in-community.</h2><p>Aletheia Bible Fellowship is a Bible-believing church with a congregationally affirmed eldership. We have no traditional place of worship or standard service. Our primary form of worship is lived in the community through service, counsel, learning, creativity, and shared life.</p></div>
      </section>

      <section className="studios">
        <div className="studios-video-wall" aria-hidden="true">
          {[
            { list: 'PLQS-i3Q5bGv-yIjRUZjEtAwJzTrsJlPon', video: 'o-eSndDv2Js' },
            { list: 'PL5Iolp8FyArQz6C08G-O7s948NcjXco8t', video: 'gQs4oSzVfNU' },
            { list: 'PL5Iolp8FyArTr1Oe7zjMJvkgKWm6vOB-A', video: '-7mPP0rLFjo' },
            { list: 'PLQS-i3Q5bGv_uUrNXoxB6B4xPFrJSJ1Fj', video: 'ITCWnvQWoZk' },
            { list: 'PLFziZME_iayEggoNF_nRX75XjYyEzyXBD', video: 'C7cqDKumREc' },
          ].map(({ list, video }, index) => <div className="video-column" key={list}><iframe src={video ? `https://www.youtube-nocookie.com/embed/${video}?list=${list}&autoplay=1&mute=1&controls=0&loop=1&playsinline=1&rel=0&modestbranding=1` : `https://www.youtube-nocookie.com/embed/videoseries?list=${list}&autoplay=1&mute=1&controls=0&loop=1&playsinline=1&rel=0&modestbranding=1&index=${index}`} title={`ABF playlist background ${index + 1}`} allow="autoplay; encrypted-media; picture-in-picture" tabIndex="-1"/></div>)}
        </div>
        <div className="studios-shade" aria-hidden="true"/>
        <div className="studios-content"><p className="section-label">Watch · Learn · Explore</p><h2>Faith for the whole week.</h2><p>Watch sermons, teaching, commentary, and original video from the ABF community on our official YouTube channel.</p><a className="button dark" href="https://www.youtube.com/@abfpdx" target="_blank" rel="noreferrer">Explore ABF on YouTube <Arrow /></a></div>
      </section>

      <SermonDiscovery />

      <section className="sundays" aria-labelledby="sundays-title">
        <div className="section-heading"><p className="section-label">Our monthly rhythm</p><h2 id="sundays-title">What are Sundays like?</h2><p>ABF does not follow one standard service format. Each part of the month creates a different way to worship, learn, serve, and connect.</p></div>
        <div className="sunday-grid">{sundays.map((item, index) => <article key={item.week} className={`sunday-${index + 1}`}><span>{item.week}</span><TiltMedia>{item.image ? <img src={asset(`sundays/${item.image}.jpg`)} alt={`${item.title} at ABF`} loading="lazy"/> : <div className="sunday-mark"><img src={asset('brand/abf-logo-dark.png')} alt=""/></div>}</TiltMedia><h3>{item.title}</h3><p>{item.text}</p>{item.note && <small>{item.note}</small>}</article>)}</div>
        <UpcomingSunday />
      </section>

      <section className="ministries" aria-labelledby="ministries-title">
        <div className="section-heading"><p className="section-label">How we serve</p><h2 id="ministries-title">One Gospel.<br/>Four expressions.</h2></div>
        <div className="ministry-grid">{ministries.map(item => <article key={item.name}><span>{item.number}</span><MinistryIcon type={item.name}/><h3>{item.name}</h3><p>{item.text}</p><small>{item.items}</small></article>)}</div>
      </section>

      <section className="statement">
        <StatementVideo />
        <div className="statement-yellow" aria-hidden="true"/>
        <div className="statement-copy"><p>“Our members learn and grow through weekly experiences in apostolic acts and online resources.”</p><span>About our life together</span></div>
      </section>

      <BeliefsSection />

      <CommunityResourcesSection />

      <section className="people" id="people">
        <div className="section-heading light"><p className="section-label">Our people</p><h2>Leadership that<br/>lives alongside you.</h2></div>
        <nav className="staff-sequence" aria-label="Leadership groups">{Object.keys(staff).map((group, index) => <a href={`#staff-group-${index + 1}`} key={group}><span>{String(index + 1).padStart(2, '0')}</span><strong>{staffGroupDetails[group]?.title || group}</strong><small>{staff[group].length} people</small></a>)}</nav>
        <div className="staff-groups">{Object.entries(staff).map(([group, people], index) => <section id={`staff-group-${index + 1}`} key={group}><header className="staff-group-header"><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{staffGroupDetails[group]?.title || group}</h3><p>{staffGroupDetails[group]?.subtitle}</p></div><small>{people.length} people</small></header><div className="staff-grid">{people.map(person => <StaffCard person={person} key={person.name}/>)}</div></section>)}</div>
      </section>

      <section className="connect" id="connect">
        <div><p className="section-label">Stay connected</p><h2>There’s a place<br/>for you here.</h2></div>
        <div className="contact-card"><p>Whether you want to ask a question, join a volunteer day, support the ministry, or simply learn more, we’d love to hear from you.</p><a href="mailto:connect@abfpdx.org">Email ABF <Arrow /></a><a href="tel:+15038521701">Call or text <Arrow /></a><div className="giving-links" id="support"><strong>Support our work</strong><div className="giving-icons"><a className="giving-icon venmo-icon" href="https://venmo.com/abfpdx" target="_blank" rel="noreferrer" aria-label="Give to ABF with Venmo"><span aria-hidden="true">V</span><small>Venmo</small></a><a className="giving-icon paypal-icon" href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7PVSKFAVEE3LG&source=url" target="_blank" rel="noreferrer" aria-label="Give to ABF with PayPal"><span aria-hidden="true"><i>P</i><b>P</b></span><small>PayPal</small></a></div></div>{installPrompt && <button onClick={install}>Install the ABF app</button>}</div>
      </section>
    </main>

    <footer><div className="brand footer-brand"><img src={asset('brand/abf-logo-light.png')} alt=""/><small>Aletheia Bible Fellowship<br/>Damascus, Oregon</small></div><div><a href="https://www.instagram.com/abfpdx/">Instagram</a><a href="https://www.facebook.com/abfpdx/">Facebook</a><a href="https://www.youtube.com/@abfpdx">YouTube</a></div><p>© {new Date().getFullYear()} Aletheia Bible Fellowship</p></footer>
  </>
}

export default App
