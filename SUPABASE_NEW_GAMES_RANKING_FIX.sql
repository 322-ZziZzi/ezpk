-- EZPK new-game ranking ID normalization fix
-- Run once in Supabase SQL Editor.

-- Preserve existing rows while normalizing page-slug IDs to the same underscore
-- convention already used by drone_hunter, tank_battle and missile_defense.
update public.game_scores set game_id='treasure_hunter' where game_id='treasure-hunter';
update public.game_scores set game_id='zombie_defense' where game_id='zombie-defense';
update public.game_scores set game_id='portal_escape' where game_id='portal-escape';
update public.game_scores set game_id='hero_merge' where game_id='hero-merge';

alter table public.game_scores enable row level security;

drop policy if exists "Anyone can read game scores" on public.game_scores;
create policy "Anyone can read game scores" on public.game_scores
  for select to anon, authenticated using (true);

drop policy if exists "Anyone can submit game scores" on public.game_scores;
create policy "Anyone can submit game scores" on public.game_scores
  for insert to anon, authenticated with check (
    char_length(trim(nickname)) between 1 and 16
    and score between 0 and 3600000
    and game_id in (
      'survival',
      'drone_hunter',
      'tank_battle',
      'missile_defense',
      'treasure_hunter',
      'zombie_defense',
      'portal_escape',
      'hero_merge'
    )
  );
