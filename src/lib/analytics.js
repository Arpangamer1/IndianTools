import { supabase } from './supabaseClient';

export async function logToolUsage(toolSlug) {
  try {
    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || null;

    // Fire-and-forget tool usage log
    supabase.from('tool_usage').insert([
      { tool_slug: toolSlug, user_id: userId }
    ]).then(({ error }) => {
      if (error) console.debug('Analytics insert note:', error.message);
    });

    // If logged in, log to user conversion history
    if (userId) {
      supabase.from('user_conversions').insert([
        { user_id: userId, tool_slug: toolSlug }
      ]).then(({ error }) => {
        if (error) console.debug('User history insert note:', error.message);
      });
    }
  } catch (err) {
    // Silent catch so conversions never fail due to analytics
    console.debug('Analytics exception caught:', err);
  }
}
