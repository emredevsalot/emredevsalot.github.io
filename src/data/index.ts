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
      "Welcome to the world of unusual buildings! Step into a captivating journey through a collection of the most remarkable and unconventional buildings from around the globe.",
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
      "Welcome to Scene Struggle! Fun games about your favorite Youtube channel to see if you're a real fan.",
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
      "Gigachad Maker helps you create a 'Gigachad Meme' gif by using the Remotion library for React framework.",
    backgroundImageUrl: "/project-example.png",
    focusImageUrl: "/project-example-top.png",
    liveSiteUrl: "",
    githubUrl: "https://github.com/emredevsalot/gigachad-maker",
    usedTech: ["React", "Typescript", "Tailwind", "Remotion"],
  },
];
