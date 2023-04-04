export interface ProjectType {
  title: string;
  description: string;
  backgroundImageUrl: string;
  focusImageUrl: string;
  usedTech: string[];
}

export const projects: Array<ProjectType> = [
  {
    title: "Project 1",
    description:
      "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, ",
    backgroundImageUrl: "/project-example.png",
    focusImageUrl: "/project-example-top.png",
    usedTech: ["React", "Tailwind", "Next", "API"],
  },
  {
    title: "Project 2",
    description:
      "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, ",
    backgroundImageUrl: "/project-example.png",
    focusImageUrl: "/project-example-top.png",
    usedTech: ["React", "Tailwind", "Next"],
  },
  {
    title: "Project 3",
    description:
      "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, ",
    backgroundImageUrl: "/project-example.png",
    focusImageUrl: "/project-example-top.png",
    usedTech: ["React", "Tailwind", "Next", "Yet Another Tech"],
  },
];
