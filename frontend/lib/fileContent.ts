import { useApp, type repoDetailedTypes } from "../contexts/repoContext";
export interface GitHubFileType {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: "file";
  content: string;
  encoding: string;
}
export async function getFileContent(path: string) {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  try {
    const response = await fetch(
      `https://api.github.com/repos/Manav-Nocode/Visual_Repo/contents/${path}`,
      {
        headers,
      },
    );
    const data: GitHubFileType = await response.json();
    console.log(data);

    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}
