/**
 * Fetches the star count for a GitHub repository
 * @param repo - Repository in format "owner/repo"
 * @returns Promise<number> - The star count
 */
export const getStarsCount = async (repo: string = "BlackCat-lqk/vue-mix"): Promise<number> => {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return data.stargazers_count || 0;
  } catch (error) {
    console.error("Error fetching GitHub stars:", error);
    throw error;
  }
};
