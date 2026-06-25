interface inputType {
  tree: [
    {
      path: string;
      type: string;
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
