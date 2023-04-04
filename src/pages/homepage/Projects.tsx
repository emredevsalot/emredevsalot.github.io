import { projects } from "../../data";

type Props = {};

const Projects = (props: Props) => {
  return (
    <>
      {projects.map((item, index) => (
        // Project Card Component
        <div
          key={index}
          className="project-card cursor-pointer border-4 border-primary opacity-[99%]"
        >
          {/* Project Card Image */}
          <div className="relative border-b-4 border-primary">
            <img
              className="project-card-bg-image h-48 w-full object-cover"
              src={item.backgroundImageUrl}
            />
            {/* Project Card Image - Focus - Front */}
            <img
              src={item.focusImageUrl}
              className="project-card-focus-image absolute inset-0 z-10 m-auto h-48 "
            />
            {/* Project Card Image - Focus - Behind */}
            <img
              src={item.focusImageUrl}
              className="project-card-focus-image outline-3 absolute inset-0 -z-10 m-auto h-48 "
            />
          </div>

          {/* Project Card Info */}
          <div
            className="
          flex
          flex-col
          gap-4
          p-5"
          >
            <div className="font-primary text-3xl">{item.title}</div>
            <div className="text-gray-400">{item.description}</div>
            <div className="flex flex-wrap gap-2">
              {item.usedTech.map((tech) => (
                <span
                  className="
                inline-flex
                items-center
                bg-primary
                px-2.5
                py-1
                font-primary
                text-xs
                uppercase
                text-secondary"
                >
                  {/* <span className="inline-flex items-center border px-2.5 py-1.5"> */}
                  <svg className="mr-1 h-5 w-5 fill-current" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3"></circle>
                  </svg>
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="border-t-4 border-primary px-5 py-2  text-primary">
            <div className="inline-flex">
              <p className="pr-1">{"GITHUB"}</p>
              <p className="project-card-link">{"> > > > > > > > >"}</p>
            </div>
          </div>
          {/* Smoother animation values */}
        </div>
      ))}
    </>
  );
};

export default Projects;
