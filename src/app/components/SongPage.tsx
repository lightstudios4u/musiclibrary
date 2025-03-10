import React from "react";
import PageTemplate from "./PageTemplate";

const SongPage: React.FC = () => {
  const song = {
    title: "Wanderlust Heart",
    description: "A soulful journey through sound.",
    creator: "Holden Reed",
    content: <audio controls src="/path-to-song.mp3" />,
    comments: [
      { user: "Alex", text: "This song is amazing!" },
      { user: "Jordan", text: "Great vibe!" },
    ],
    relatedItems: [
      {
        title: "Another Song",
        link: "/song/another-song",
        creator: "Holden Reed",
      },
      {
        title: "Dreams and Dust",
        link: "/song/dreams-and-dust",
        creator: "Holden Reed",
      },
    ],
  };

  return <PageTemplate {...song} />;
};

export default SongPage;
