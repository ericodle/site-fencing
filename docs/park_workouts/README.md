# Park cross-training sessions

Internal. Started 18 September 2026.

Six 60-minute sessions that need a public park and nothing else. They are
calisthenics, agility, plyometric and fencing-footwork work in one hour, broken
down to the minute so that a session can be run by whoever turns up first
without waiting on a coach to invent it.

These are conditioning sessions, not lessons. They exist because floor time is
the club's scarcest resource: when we cannot secure a hall, the physical pillar
still has to happen somewhere, and a park is free and always open.

## The six sessions

| File | Theme | Bias | Cost to the nervous system |
| --- | --- | --- | --- |
| `01_explosivity.md` | Explosivity | Plyometric | High |
| `02_core_and_upper_body.md` | Core stability and upper body | Calisthenics | Moderate |
| `03_foot_speed.md` | Foot speed | Footwork | High |
| `04_change_of_direction.md` | Change of direction and reaction | Agility | High |
| `05_bout_endurance.md` | Bout-length repeat effort | Conditioning | Moderate |
| `06_single_leg_control.md` | Single-leg strength and landing control | Strength | Low |

Every session has the same skeleton, so the shape is familiar even when the
content is not:

    warm-up and mobility  →  activation  →  three or four work blocks
    →  a fencing-transfer block  →  a finisher  →  cool-down

Each work block mixes at least two of the four disciplines. That is deliberate:
a session that is forty minutes of one thing is a session people stop coming to.

## Printing, and reading the bars

Every session exists twice: the `.md` file is the source, and the `.pdf` beside
it is the sheet to take to the park — A4, black ink on white, three or four
pages. Rebuild the PDFs after any edit:

    python3 tools/workout_pdfs.py          # all of them
    python3 tools/workout_pdfs.py 03       # only names matching "03"

The last phrase of every timetable row states that block's pattern — `60 s work
/ 60 s rest`, `easy throughout`, `continuous work`, `rest` — and the PDF turns
that phrase into bars: one running across the whole hour, one under every block
heading, one inside every timetable row. Solid black is work, gold is warm-up,
mobility and cool-down, and white hatching is rest.

The rest is drawn at full size rather than tucked into a footnote because in
sessions 1, 3 and 4 the rest is doing as much of the training as the work is.
Cutting it to save time turns a speed session into a conditioning session.

## Ordering them in a week

Sessions 1, 3 and 4 are the ones that tax the nervous system. Leave at least 48
hours between any two of them, and put them on days when the fencer is fresh —
speed work done tired trains slowness. Two workable weeks:

    Three days a week    Mon 1 · Wed 3 · Sat 5
                         Mon 4 · Wed 2 · Sat 6

    Four days a week     Mon 1 · Tue 2 · Thu 3 · Sat 6
                         Mon 4 · Tue 2 · Thu 5 · Sat 6

Session 6 is the lightest and the one to keep when everything else is cut. It is
also the one to run the day after a competition.

## What the park has to provide

- A flat strip of at least 12 m with no gravel, roots or drainage grates.
- A bench at roughly knee height, sound enough to stand on.
- A bar to hang from. A low bar for inverted rows is a bonus, not a given.
- A post, wall or tree trunk to anchor a band to, carrying some small feature at
  chest height — a bolt, a knot, the corner of a sign — to aim a point at.

## What to bring

Eight cones, a 5 m tape measure, one long resistance band, a jump rope, a phone
with a timer and a random-number app, water, and a notebook. A folded towel
stands in for a mat. Two full water bottles stand in for weights.

Nothing is marked on the ground. The cones are visual references and nothing
else — a start line, a gate to stop inside, a rung to step between, the distance
a lunge has to cover — so every session sets up in under a minute and leaves the
park exactly as it found it. Where a session needs a measurement, a cone goes
down at the landing and the tape does the rest.

Blades, masks and jackets are not needed for any of this. If someone wants to
hold a weapon for the point-control work, that is fine, but check the park's
posted rules first and never fence — this is footwork, and a park is full of
people who did not agree to be in a fencing club.

## Rules that are not optional

1. **No flèche on concrete or asphalt.** Ever. If a session offers a flèche,
   either move that rep onto grass or substitute a balestra-lunge. The flèche is
   in any case illegal in saber, so saber fencers substitute by default.
2. **Land quietly.** A loud landing is force going through a joint instead of
   into a muscle. If the landings start getting loud, the power block is over,
   whatever the plan says.
3. **Stop the block, not the session.** The stop rules in each session are real.
   Missing a marker is information, not a failure — record it and move to the
   next block.
4. **Heat.** Taipei summer afternoons are not a training environment. Move to
   06:30 or after 18:00 from May to September, drink before you are thirsty, and
   cut the conditioning blocks first when it is humid.
5. **Under-18s train in sight of a guardian or a second adult**, in line with
   Part B of `docs/minor_safeguarding_consent.txt`. That applies in a park
   exactly as it applies in a hall.
6. **No filming without a signed media release**, including in a public park.
   See `docs/mission_statement.txt`.

## Scaling

Each session lists an easier and a harder version of its hardest movements. The
default rule when a movement is out of reach: keep the tempo, shorten the range.
A half-depth split squat done well beats a full one done badly, and a 4-second
plank hold repeated eight times beats a 32-second hold that sags at 12.

For fencers under about 14, halve the plyometric contact counts in sessions 1
and 3 and keep the rest as written.

## Logging

One line per session in a notebook or a shared sheet, because a training claim
we cannot evidence is a training claim we should stop making:

    date · session · who · surface · the marker the session asks for · how it felt 1-10

The markers are chosen to be measurable with a tape measure and a couple of
cones: a jump distance, a rep count inside a fixed time, a left-right
difference. Six weeks of those lines is the first real evidence the physical
pillar has.
