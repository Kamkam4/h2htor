import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Map DB row (snake_case) to Frontend model (camelCase)
export const mapRowToMatch = (row) => ({
  id: row.id,
  tournament: row.tournament,
  date: row.date,
  time: row.time || null,
  game: row.game,
  status: row.status || 'completed',
  loozolloScore: row.loozollo_score !== null ? Number(row.loozollo_score) : null,
  kamkamaScore: row.kamkama_score !== null ? Number(row.kamkama_score) : null,
  winner: row.winner || null,
  notes: row.notes || '',
  mvp: row.mvp || null,
  featured: Boolean(row.featured),
  createdAt: row.created_at,
});

// Map Frontend model (camelCase) to DB row (snake_case)
export const mapMatchToRow = (match) => ({
  id: match.id,
  tournament: match.tournament,
  date: match.date,
  time: match.time || null,
  game: match.game,
  status: match.status || 'completed',
  loozollo_score: match.loozolloScore !== null && match.loozolloScore !== undefined ? Number(match.loozolloScore) : null,
  kamkama_score: match.kamkamaScore !== null && match.kamkamaScore !== undefined ? Number(match.kamkamaScore) : null,
  winner: match.winner || null,
  notes: match.notes || '',
  mvp: match.mvp || null,
  featured: Boolean(match.featured),
});

export const dbService = {
  // Fetch all matches from Supabase
  async getMatches() {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching matches from Supabase:', error);
      return null;
    }

    return (data || []).map(mapRowToMatch);
  },

  // Save or update a match
  async saveMatch(match) {
    if (!isSupabaseConfigured || !supabase) return false;
    const row = mapMatchToRow(match);
    const { error } = await supabase
      .from('matches')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.error('Error saving match to Supabase:', error);
      return false;
    }
    return true;
  },

  // Delete a match
  async deleteMatch(id) {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting match from Supabase:', error);
      return false;
    }
    return true;
  },

  // Seed initial matches if DB table is empty
  async seedIfEmpty(initialMatches) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data, count, error } = await supabase
        .from('matches')
        .select('id', { count: 'exact', head: true });

      if (!error && (count === 0 || count === null)) {
        const rows = initialMatches.map(mapMatchToRow);
        await supabase.from('matches').insert(rows);
      }
    } catch (e) {
      console.warn('Could not seed Supabase matches:', e);
    }
  },

  // Subscribe to real-time updates
  subscribe(onUpdate) {
    if (!isSupabaseConfigured || !supabase) return () => {};

    const channel = supabase
      .channel('public:matches')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matches' },
        (payload) => {
          onUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
