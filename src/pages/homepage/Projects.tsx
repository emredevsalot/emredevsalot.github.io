type Props = {};

const Projects = (props: Props) => {
  return (
    <>
      {[
        "/project-example.png",
        "/project-example.png",
        "/project-example.png",
      ].map((item, index) => (
        // Project Card Component
        <div
          key={index}
          className="project-card border-4 border-primary opacity-[99%]"
        >
          {/* Project Card Image */}
          <div className="relative">
            <img className="project-card-bg-image object-cover" src={item} />
            {/* Project Card Image - Focus - Front */}
            <img
              src="/project-example-top.png"
              className="project-card-focus-image absolute inset-0 z-10 m-auto"
            />
            {/* Project Card Image - Focus - Behind */}
            <img
              src="/project-example-top.png"
              className="project-card-focus-image outline-3 absolute inset-0 -z-10 m-auto"
            />
          </div>
          {/* Project Card Name */}
          <div>{item}</div>
          <div>{item}</div>
          {/* Get the data */}
          {/* Smoother animation values */}
        </div>
      ))}
    </>
  );
};

export default Projects;
