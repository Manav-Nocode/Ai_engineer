interface inputType {
  sha: string;
  url: string;
  tree: [
    {
      path: string;
      mode: string;
      type: string;
      sha: string;
      size: number;
      url: string;
    },
  ];
}

const extensionMap: Record<string, string> = {
  tsx: "typescript",
  ts: "typescript",
  js: "javascript",
  jsx: "javascript",
  py: "python",
};

async function bring() {
  const resp = await fetch(
    "https://api.github.com/repos/Manav-Nocode/Ai_engineer/git/trees/main?recursive=1",
  );
  const data = await resp.json();
  return data;
}

function defineStack(data: inputType) {
  const detectedLanguage = data.tree.reduce<string[]>((acc, item) => {
    const extract = item.path.split(".").pop()?.toLocaleLowerCase();

    if (extract && extensionMap[extract]) {
      acc.push(extensionMap[extract]);
    }
    return acc;
  }, []);

  return [...new Set(detectedLanguage)];
}
async function main() {
  const data = await bring();
  const ans = defineStack(data);
  console.log(ans);
}
main();
