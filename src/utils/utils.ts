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

/**
 * Decodes a label from kebab-case to title case
 * @param label - The label to decode (e.g., "split-text")
 * @returns The decoded label (e.g., "Split Text")
 */
export const decodeLabel = (label: string): string => {
  if (!label) return "";

  return label
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
