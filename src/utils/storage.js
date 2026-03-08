import { supabase } from './supabase';

/**
 * Saves or updates a quiz in the Supabase cloud.
 */
export const saveQuiz = async (quizData) => {
  try {
    const { id, authorId, ...data } = quizData;

    const payload = {
      title: data.title,
      description: data.description,
      time: data.time,
      questions: data.questions,
      author_id: authorId,
      plays: quizData.plays || 0,
      rating: quizData.rating || 0
    };

    let result;
    if (id && id.length > 20) { // Check if it's a valid UUID (local IDs are timestamps)
      result = await supabase
        .from('quizzes')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('quizzes')
        .insert([payload])
        .select()
        .single();
    }

    if (result.error) throw result.error;
    return result.data;
  } catch (error) {
    console.error('Failed to save to Cloud Vault:', error);
    return null;
  }
};

/**
 * Retrieves all quizzes from the cloud.
 */
export const getQuizzes = async () => {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to access Cloud Vault:', error);
    return [];
  }
};

/**
 * Retrieves a single quiz by ID.
 */
export const getQuizById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to retrieve Artifact from cloud:', error);
    return null;
  }
};

/**
 * Increments the play count for a quiz.
 */
export const incrementQuizPlays = async (id) => {
  try {
    // Current Supabase logic: we need to get current, then update
    const { data: quiz } = await supabase
      .from('quizzes')
      .select('plays')
      .eq('id', id)
      .single();

    if (quiz) {
      await supabase
        .from('quizzes')
        .update({ plays: (quiz.plays || 0) + 1 })
        .eq('id', id);
    }
  } catch (error) {
    console.error('Failed to increment plays in cloud:', error);
  }
};

/**
 * Saves a score to the quiz leaderboard.
 */
export const saveScore = async (quizId, scoreData) => {
  try {
    const { error } = await supabase
      .from('leaderboards')
      .insert([
        {
          quiz_id: quizId,
          user_id: scoreData.userId,
          username: scoreData.username,
          score: scoreData.score,
          percentage: scoreData.percentage,
          rank: scoreData.rank
        }
      ]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to save cloud score:', error);
    return false;
  }
};

/**
 * Retrieves the leaderboard for a specific quiz.
 */
export const getLeaderboard = async (quizId) => {
  try {
    const { data, error } = await supabase
      .from('leaderboards')
      .select('*')
      .eq('quiz_id', quizId)
      .order('score', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to get cloud leaderboard:', error);
    return [];
  }
};
