export interface ProjectType {
  title: string;
  description: string;
  backgroundImageUrl: string;
  focusImageUrl: string;
  liveSiteUrl: string;
  githubUrl: string;
  usedTech: string[];
}

export const projects: Array<ProjectType> = [
  {
    title: "Unusual Buildings",
    description:
      "Unusual Buildings is a showcase of extraordinary and unique architectural wonders from around the world. I wanted to show my skills in creating a multi-page application with smooth animations.",
    backgroundImageUrl: "/unusual-buildings.png",
    focusImageUrl: "/unusual-buildings-top.png",
    liveSiteUrl: "https://emredevsalot.github.io/unusual-buildings/",
    githubUrl: "https://github.com/emredevsalot/unusual-buildings",
    usedTech: [
      "React",
      "Typescript",
      "SASS",
      "React-Router-Dom",
      "Framer Motion",
    ],
  },
  {
    title: "Scene Struggle",
    description:
      "Scene Struggle allows users to play mini-games based on their favorite YouTube channels. Allowed me to explore the YouTube API and integrate it into a web application.",
    backgroundImageUrl: "/project-example.png",
    focusImageUrl: "/project-example-top.png",
    liveSiteUrl: "https://emredevsalot.github.io/scene-struggle/",
    githubUrl: "https://github.com/emredevsalot/scene-struggle",
    usedTech: [
      "React",
      "Typescript",
      "Tailwind",
      "React-Router-Dom",
      "Youtube API",
    ],
  },
  {
    title: "Gigachad Maker",
    description:
      "Gigachad Maker allows you to create a 'Gigachad Meme' GIF by leveraging the power of the Remotion framework for React.",
    backgroundImageUrl: "/project-example.png",
    focusImageUrl: "/project-example-top.png",
    liveSiteUrl: "",
    githubUrl: "https://github.com/emredevsalot/gigachad-maker",
    usedTech: ["React", "Typescript", "Tailwind", "Remotion"],
  },
];
