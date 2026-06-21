import React, { useState } from "react";
import { LuFile } from "react-icons/lu";
import useFile from "../../../../hooks/fileEdit";
import type { datatype } from "../../../../pages/CodeEditor";
import { useFileContext } from "../../../../contexts/workingFIles";
interface Props {
  name: string;
  path: string;
}

const Fileicon = ({ name, path }: Props) => {
  const [send, setSend] = useState("");
  const { data, refetch } = useFile(path);
  const { setCurrentlyWorkingFiles, currentlyWorkingFiles } = useFileContext();
  async function handlePress() {
    try {
      const result = await refetch();

      if (result.data) {
        const targetFile: datatype = {
          name: result.data.name,
          content: result.data.content || "",
          encoding: result.data.encoding || "base64",
        };

        const alreadyExists = currentlyWorkingFiles.find(
          (f) => f.name === targetFile.name,
        );
        if (!alreadyExists) {
          setCurrentlyWorkingFiles((prev) => [targetFile, ...prev]);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div
      className="flex mb-1.5 hover:cursor-pointer hover:bg-amber-200 border-2 w-full"
      onClick={() => handlePress()}
    >
      <div className="pr-2">
        <LuFile size={22} />
      </div>
      <p>{name}</p>
    </div>
  );
};

export default Fileicon;
