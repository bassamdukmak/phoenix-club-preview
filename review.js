const photos = [
  {file:'DSC09915.jpg', title:'The club, together', folder:'Group Photos', alt:'Phoenix players in black away kits gathered around a sofa and football', why:'My first choice for a split hero. A small group feels like a club, the ball anchors the image, and the black kit sits naturally within Phoenix’s palette.', limit:'Keep the full portrait. A wide crop can lose the ball and the outer players.'},
  {file:'DSC00038.jpg', title:'The whole squad', folder:'Group Photos', alt:'The Phoenix squad standing together in mixed club kits', why:'The clearest proof that Phoenix is a real club. Best team-first alternative, with the entire squad and kit range in one photograph.', limit:'The squad sits low in a tall original. Use a deliberate lower wide crop; check every player and keep the headline clear of faces.'},
  {file:'DSC09898.jpg', title:'One club. Different roles.', folder:'Group Photos', alt:'Five Phoenix players gathered around a sofa, with a goalkeeper in the centre', why:'A relaxed group with home, away and goalkeeper kits. Strong personality and a human introduction to the club.', limit:'A split composition preserves everyone. Do not crop the players standing at the edges.'},
  {file:'DSC09938.jpg', title:'Confidence, without the fiction', folder:'Group Photos', alt:'Two Phoenix players in black kits, one resting a boot on a football', why:'A strong two-player composition with direct expressions, real kit and a visible ball. It carries the presence of the current hero using actual people.', limit:'Leave enough room for both heads and the ball. Best as a full-height photograph.'},
  {file:'DSC00155.jpg', title:'Football comes first', folder:'Freestyle Photos', alt:'A smiling Phoenix player in a black shirt holding a football', why:'The ball makes the subject immediate. Warm expression, clear crest and club colours make this a strong individual-led opening.', limit:'One player represents the whole club. Pair with the team photograph lower on the page.'},
  {file:'DSC00187.jpg', title:'The person before the player', folder:'Freestyle Photos', alt:'A smiling Phoenix player holding a club football against his chest', why:'The most approachable option: a real smile and a real football. It supports the existing people-first headline and pathway story.', limit:'Use a split hero to avoid cutting off the ball or squeezing text over the player.'},
  {file:'DSC00098.jpg', title:'Wearing the identity', folder:'Freestyle Photos', alt:'A Phoenix player in a cream home shirt holding the club crest', why:'Direct club identity, a clear face and the home shirt. The cream kit connects naturally to the site’s bone and gold surfaces.', limit:'More formal and individual than the group options. Keep the face and crest together in the crop.'},
  {file:'DSC09925.jpg', title:'A shared ambition', folder:'Group Photos', alt:'Three Phoenix players standing together with their hands joined around a football', why:'A clear team gesture, both kits and a football in one frame. A useful alternative when the club wants more energy than a seated portrait.', limit:'All three people matter to the photograph. Avoid a narrow crop that removes either outside player.'},
  {file:'DSC00102.jpg', title:'A new generation', folder:'Freestyle Photos', alt:'A Phoenix player in the cream home kit holding the shirt at the chest', why:'Simple, recognisable and confident. Clean face/crest separation makes it useful for the phone opening.', limit:'The source is a portrait. Use a separate composition instead of stretching it into a landscape banner.'},
  {file:'DSC08893.jpg', title:'The real shirt-back alternative', folder:'Classic Freestyle (Away Jersey)', alt:'A real Phoenix player seen from behind showing Hulley and number 8 on the black kit', why:'Closest to the current rear-shirt concept, using a real supplied photograph. A useful option if the club wants to keep that original idea.', limit:'White studio background and no visible face give it less club atmosphere. Better with a light photo panel; keep the real name and number unchanged.'},
];
const $ = selector => document.querySelector(selector);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const heroChoice = $('#hero-choice');
photos.forEach((photo, index) => {
  const option = document.createElement('option');
  option.value = String(index);
  option.textContent = `${String(index + 1).padStart(2, '0')} · ${photo.title}`;
  heroChoice.append(option);
});

function selectPhoto(index, scroll = false) {
  const photo = photos[index];
  heroChoice.value = String(index);
  $('#hero-photo').src = `media/${photo.file}`;
  $('#hero-photo').alt = photo.alt;
  $('#selected-caption').textContent = `Choice ${index + 1} · ${photo.file} · ${photo.folder}. ${photo.limit}`;
  if (scroll) $('#preview').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
}

function fullPhoto(index) {
  const photo = photos[index];
  $('#full-photo').src = `media/${photo.file}`;
  $('#full-photo').alt = photo.alt;
  $('#full-caption').textContent = `${photo.file} · ${photo.folder} · Uncropped supplied photograph`;
  $('#photo-dialog').showModal();
}

$('#photo-grid').innerHTML = photos.map((photo, index) => `<figure class="photo-choice"><button type="button" data-open="${index}" aria-label="View uncropped ${escapeHTML(photo.title)}"><img src="media/${photo.file}" alt="${escapeHTML(photo.alt)}" width="2048" height="2560" loading="lazy"></button><figcaption><div class="photo-rank">${String(index+1).padStart(2,'0')}</div><h3>${photo.title}</h3><p>${photo.why}</p><p>${photo.limit}</p><p class="filename">${photo.file}<br>${photo.folder}</p><button type="button" class="use-photo" data-use="${index}">Preview in hero</button><button type="button" class="view-original" data-open="${index}">View uncropped</button></figcaption></figure>`).join('');
$('#photo-grid').addEventListener('click', event => {
  const use = event.target.closest('[data-use]');
  const open = event.target.closest('[data-open]');
  if (use) selectPhoto(Number(use.dataset.use), true);
  else if (open) fullPhoto(Number(open.dataset.open));
});
heroChoice.addEventListener('change', () => selectPhoto(Number(heroChoice.value)));
$('#close-photo').addEventListener('click', () => $('#photo-dialog').close());
document.querySelectorAll('[data-layout]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-layout]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  $('#hero').className = `hero ${button.dataset.layout}`;
  $('#crop-control').hidden = button.dataset.layout !== 'wide';
}));
document.querySelectorAll('[data-size]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-size]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  $('#website-preview').classList.toggle('phone', button.dataset.size === 'phone');
}));
$('#crop').addEventListener('input', event => $('#hero').style.setProperty('--crop', `${event.target.value}%`));
selectPhoto(0);

const crestFiles = {'Phoenix United':'../phoenix-crest.svg', 'PASS':'pass.png', 'Arabian Falcons':'arabian-falcons.png', 'Al Wahda':'al-wahda.png', 'Al Jazira':'al-jazira.png', 'Red Castle':'red-castle.png', 'Stallions':'stallions.png', 'Stryx FC':'stryx-fc.png', 'ISE':'ise.png', 'Maracuja':'maracuja.png', 'Desert Falcon':'desert-falcon.png', 'IRISH':'dubai-irish.png', 'Circle Football':'circle-football.png', 'Al Fath FC':'al-fath.png', 'Al Madinah Wanderers':'al-madinah-wanderers.png', 'Olympic':'olympic.png', 'Alshahama':'alshahama.png'};
const teamName = name => ({'Phoenix United':'Phoenix United FC', 'IRISH':'Dubai Irish', 'Desert Falcon':'Desert Falcons'}[name] || name);
const dateFormat = new Intl.DateTimeFormat('en-GB', {day:'2-digit',month:'short',year:'numeric',timeZone:'Asia/Dubai'});
const timeFormat = new Intl.DateTimeFormat('en-GB', {hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Dubai'});
let feed = null;
let refreshTimer;
let loading = false;

function team(name) {
  const image = crestFiles[name];
  return `<div class="team">${image ? `<img src="assets/opponents/${image}" alt="" width="64" height="70">` : ''}<span>${escapeHTML(teamName(name))}</span></div>`;
}

function card(match, latest = false) {
  const kickoff = new Date(match.kickoff);
  const hasScore = Number.isInteger(match.homeScore) && Number.isInteger(match.awayScore);
  const confirmedLive = !feed.stale && match.status === 'live';
  const scoreline = hasScore ? `<div class="scoreline" aria-label="${escapeHTML(teamName(match.home))} ${match.homeScore}, ${escapeHTML(teamName(match.away))} ${match.awayScore}"><span>${match.homeScore}</span><span class="dash">–</span><span>${match.awayScore}</span></div>` : '<div class="scoreline unscheduled">VS</div>';
  let label = match.statusText;
  if (match.status === 'scheduled') label = kickoff < new Date() ? 'Awaiting source update' : `${timeFormat.format(kickoff)} GST`;
  if (feed.stale && match.status === 'live') label = 'Last reported score · updates delayed';
  const stateLabel = confirmedLive ? 'LIVE · UAEFA' : latest ? 'Latest result' : match.status === 'finished' ? 'Result' : match.status === 'scheduled' ? 'Upcoming' : feed.stale && match.status === 'live' ? 'Updates delayed' : 'Match update';
  return `<article class="match-card${latest ? ' latest' : ''}" data-match="${escapeHTML(match.id)}"><div class="match-top"><strong>${stateLabel}</strong><span>Week ${escapeHTML(match.week)}</span></div><time class="match-date" datetime="${escapeHTML(match.kickoff)}">${dateFormat.format(kickoff)}</time><div class="teams">${team(match.home)}${team(match.away)}</div>${scoreline}<p class="match-status${confirmedLive ? ' live-label' : ''}">${escapeHTML(label)}</p><p class="match-venue"><span>Venue</span>${escapeHTML(match.venue)}</p></article>`;
}

function renderFixtures() {
  const completed = feed.matches.filter(m => m.status === 'finished').sort((a,b) => b.kickoff.localeCompare(a.kickoff));
  const live = feed.matches.filter(m => m.status === 'live');
  const others = feed.matches.filter(m => m.status !== 'finished' && m.status !== 'live');
  const main = live.length ? [...live, ...others] : [...completed.slice(0,1), ...others];
  const mainScroll = $('#match-strip').scrollLeft;
  const pastScroll = $('#past-strip').scrollLeft;
  const focusId = document.activeElement?.closest?.('[data-match]')?.dataset.match;
  $('#match-strip').innerHTML = main.map(m => card(m, !live.length && m.id === completed[0]?.id)).join('') || '<p>No fixtures are currently listed.</p>';
  $('#past-strip').innerHTML = completed.map(m => card(m)).join('') || '<p>No completed matches yet this season.</p>';
  $('#match-strip').scrollLeft = mainScroll;
  $('#past-strip').scrollLeft = pastScroll;
  if (focusId) document.querySelector(`[data-match="${CSS.escape(focusId)}"]`)?.focus({preventScroll:true});
  $('#fixture-count').textContent = `${feed.matches.length} fixtures · ${completed.length} completed`;
  $('#past-count').textContent = `(${completed.length})`;
  const checked = new Date(feed.retrievedAt).toLocaleString('en-GB', {timeZone:'Asia/Dubai',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
  $('#feed-status').textContent = `${feed.stale ? 'Saved UAEFA snapshot' : 'Connected to UAEFA'} · Last checked ${checked} GST. ${feed.stale ? 'Static preview.' : 'Live match delay has not yet been measured.'}`;
}

async function refreshFixtures() {
  if (loading || document.hidden) return;
  loading = true;
  $('#refresh-feed').disabled = true;
  try {
    const response = await fetch('./fixtures.json', {signal:AbortSignal.timeout(20000),cache:'no-store'});
    if (!response.ok) throw new Error('The official source is temporarily unavailable.');
    const data = await response.json();
    if (!Array.isArray(data.matches) || !data.matches.length) throw new Error('No validated fixtures were returned.');
    feed = data;
    renderFixtures();
  } catch {
    if (feed) {
      feed = {...feed,stale:true};
      renderFixtures();
    } else {
      $('#feed-status').textContent = 'The source is unavailable. Please use Check now to retry.';
      $('#match-strip').innerHTML = '<p class="error-text">Official fixtures could not be loaded. No scores have been guessed.</p>';
    }
  } finally {
    loading = false;
    $('#refresh-feed').disabled = false;
    clearTimeout(refreshTimer);
    const nearMatch = feed?.matches.some(m => m.status !== 'finished' && Math.abs(Date.now() - Date.parse(m.kickoff)) < 4*3600000);
    
  }
}

$('#past-toggle').addEventListener('click', () => {
  const opening = $('#past-matches').hidden;
  $('#past-matches').hidden = !opening;
  $('#past-toggle').setAttribute('aria-expanded', String(opening));
});
$('#previous-fixture').addEventListener('click', () => $('#match-strip').scrollBy({left:-312,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}));
$('#next-fixture').addEventListener('click', () => $('#match-strip').scrollBy({left:312,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}));
$('#refresh-feed').addEventListener('click', refreshFixtures);
document.addEventListener('visibilitychange', () => {
  clearTimeout(refreshTimer);
  if (!document.hidden) refreshFixtures();
});
refreshFixtures();
