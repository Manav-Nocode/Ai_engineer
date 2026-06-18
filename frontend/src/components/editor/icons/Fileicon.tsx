import React from "react";
import { LuFile } from "react-icons/lu";
interface Props {
  name: string;
  path: string;
}

const Fileicon = ({ name, path }: Props) => {
  async function handlePress() {
    // window.open(url, "_blank");
    // console.log(url.replace("?ref=main", ""));
    try {
      const res = await fetch(
        `https://api.github.com/repos/Manav-Nocode/Visual_Repo/contents/${name}`,
      );
      const data = await res.json();
      // console.log(data);
      // if (data && data.content) {
      //   const cleanedBase64 = data.content.replace(/\s/g, "");

      //   const decodedData = decodeURIComponent(escape(atob(cleanedBase64)));

      //   setFileContent(decodedData);
      // }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div
      className="flex justify-center items-center mb-1.5 hover:cursor-pointer hover:bg-amber-200"
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
