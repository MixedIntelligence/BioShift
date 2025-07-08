// Utility to ensure all user profile fields are non-null and safe for rendering
export function sanitizeUser(user) {
  if (!user || typeof user !== 'object') return {};
  return {
    id: user.id || '',
    email: user.email || '',
    role: user.role || '',
    created_at: user.created_at || '',
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    phone: user.phone || '',
    bio: user.bio || '',
    location: user.location || '',
    years_experience: user.years_experience || null,
    current_position: user.current_position || '',
    company_name: user.company_name || '',
    website: user.website || '',
    linkedin_url: user.linkedin_url || '',
    github_url: user.github_url || '',
    avatar_url: user.avatar_url || '',
    profile_completed: !!user.profile_completed,
    onboarding_completed: !!user.onboarding_completed
  };
}
