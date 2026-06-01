import { useState } from "react";

// GitHubConnect.jsx
function GitHubConnect() {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [contents, setContents] = useState(null);

  // Step 1: Redirect to backend auth endpoint
  const connectGitHub = () => {
    window.location.href =
      "https://your-tunnel.trycloudflare.com/api/auth/github";
  };

  // Step 2: Fetch repos after connection
  const fetchRepos = async (userId: any) => {
    const response = await fetch(
      `https://your-tunnel.trycloudflare.com/api/repos?user_id=${userId}`,
    );
    const data = await response.json();
    setRepos(data.repositories);
  };

  // Step 3: Select a repo
  const selectRepo = async (userId: any, repoFullName: any) => {
    await fetch("https://your-tunnel.trycloudflare.com/api/repos/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, repo_full_name: repoFullName }),
    });
    setSelectedRepo(repoFullName);
  };

  // Step 4: Read repo contents
  const fetchContents = async (path = "") => {};

  return (
    <div>
      <button onClick={connectGitHub}>Connect GitHub</button>
    </div>
  );
}
