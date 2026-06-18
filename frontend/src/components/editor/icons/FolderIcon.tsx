import React, { useState } from "react";
import { TiFolderOpen } from "react-icons/ti";
import Fileicon from "./Fileicon";

export type linksType = {
  self: string;
  git: string;
  html: string;
};
export type repoDetailedTypes = {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: string;
  _links: linksType;
};

interface Props {
  name: string;
  onpress: string;
  path: string;
}
const FolderIcon = ({ name, onpress, path }: Props) => {
  const [subdata, setsubdata] = useState<repoDetailedTypes[]>([]);

  async function handlePress(url: string) {
    const response = await fetch(url);
    const data = await response.json();
    setsubdata(data);
    console.log(data);
  }
  return (
    <main className="flex items-baseline flex-col">
      <div
        id="contains: img+file_name"
        className="flex justify-center items-center mb-1.5 hover:cursor-pointer hover:bg-amber-200"
        onClick={() => handlePress(onpress)}
      >
        <div className="pr-2">
          <TiFolderOpen size={25} />
        </div>
        <p>{name}</p>
      </div>
      <div className="flex flex-col pl-2 items-baseline  border-l-1 ">
        {subdata?.map((item, idx) => {
          if (item.type == "file") {
            return (
              <div className="" key={idx}>
                <Fileicon name={item.name} path={item.path} />
              </div>
            );
          } else {
            return (
              <div key={idx}>
                <FolderIcon
                  name={item.name}
                  path={item.path}
                  onpress={item.url}
                />
              </div>
            );
          }
        })}
      </div>
    </main>
  );
};

export default FolderIcon;
