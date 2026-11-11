import json
import re
import sys
from datetime import datetime
from pathlib import Path
from urllib.request import urlopen

from bs4 import BeautifulSoup

page = Path(sys.argv[1])
soup = BeautifulSoup(page.read_text(), 'html.parser')
section = soup.select_one('#fixtures')
cards = {re.search(r'Week\s+(\d+)', card.get_text(' ', strip=True))[1]: card
         for card in section.select('li[class*="_card_"]')}
with urlopen('https://www.uaefa.ae/api/matches?lang=en&club_id=961', timeout=20) as response:
    feed = json.loads(response.read(1_000_000))
assert feed['error'] is False and feed['active_season'] == '59'
matches = [match for group in feed['matches'] for match in group['items']
           if match['competition_id'] == '2574']
weeks = [match['week_no'] for match in matches]
assert len(weeks) == len(cards) == len(set(weeks)) and set(weeks) == set(cards)
past, upcoming = [], []
names = {'Phoenix United': 'Phoenix United FC', 'IRISH': 'Dubai Irish', 'Desert Falcon': 'Desert Falcons'}
for match in matches:
    card = cards[match['week_no']]
    teams = ' versus '.join(names.get(match[key], match[key]) for key in ('club1', 'club2'))
    assert card.select_one('[aria-label*=" versus "]')['aria-label'] == teams
    kickoff = datetime.strptime(match['time'], '%Y-%m-%d %I:%M %p')
    card.time['datetime'] = kickoff.isoformat() + '+04:00'
    card.time.string = kickoff.strftime('%a, %d %b %Y')
    for item in card.select('dl div'):
        if item.dt.get_text(strip=True) == 'Kick-off':
            item.dd.string = kickoff.strftime('%H:%M') + ' GST'
        if item.dt.get_text(strip=True) == 'Venue':
            item.dd.string = match['playground']
    score = card.select_one('[class*="_versus_"]')
    if match['status_id'] == '6':
        score.string = f"{int(match['team1_score'])} – {int(match['team2_score'])}"
        score['aria-label'] = f'Final score {score.string}'
        past.append((kickoff, card))
    else:
        score.string = 'VS' if match['status_id'] == '2' else 'Status pending'
        score.attrs.pop('aria-label', None)
        upcoming.append((kickoff, card))

from copy import deepcopy
main, results = section.select('ol')
main.clear()
results.clear()
past.sort(key=lambda pair: pair[0], reverse=True)
if past:
    main.append(deepcopy(past[0][1]))
for _, card in sorted(upcoming, key=lambda pair: pair[0]):
    main.append(card)
for _, card in past:
    results.append(card)
section.summary.string = f'View past matches ({len(past)})'
section.select_one('p:last-child').string = (
    'UAEFA fixtures checked · ' + datetime.now().astimezone().strftime('%d %B %Y, %H:%M %Z')
)
page.write_text(str(soup))
print(f'Rendered {len(upcoming)} upcoming fixtures and {len(past)} results')
