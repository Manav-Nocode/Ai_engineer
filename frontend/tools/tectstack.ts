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

interface op {
  file: string;
}
const result: op[] = [];

async function bring() {
  const resp = await fetch(
    "https://api.github.com/repos/Manav-Nocode/Ai_engineer/git/trees/main?recursive=1",
  );
  const data = await resp.json();
  return data;
}
const data = bring();
async function decidetechstack(data: inputType) {
  data.tree.forEach((f) => {
    const apend = { file: f.path };
    result.push(apend);
  });
  console.log(result);
}

async function main() {
  const data = await bring();
  await decidetechstack(data);
}
main();
