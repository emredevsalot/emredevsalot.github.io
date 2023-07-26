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
    title: "Prompt Filler",
    description:
      "Prompt Filler is a user-friendly app that simplifies the process of generating and completing prompts for ChatGPT, saving you time and effort in crafting engaging and effective prompts for various purposes.",
    backgroundImageUrl: "/prompt-filler.png",
    focusImageUrl: "/prompt-filler-top.png",
    liveSiteUrl: "https://emredevsalot.github.io/prompt-filler/",
    githubUrl: "https://github.com/emredevsalot/prompt-filler",
    usedTech: ["NextJS", "Typescript", "Tailwind", "React-Hook-Form"],
  },
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
    backgroundImageUrl: "/scene-struggle.png",
    focusImageUrl: "/scene-struggle-top.png",
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
    backgroundImageUrl: "/gigachad-maker.png",
    focusImageUrl: "/gigachad-maker-top.png",
    liveSiteUrl: "",
    githubUrl: "https://github.com/emredevsalot/gigachad-maker",
    usedTech: ["React", "Typescript", "Tailwind", "Remotion"],
  },
];
