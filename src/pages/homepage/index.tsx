import styles from "../../styles";

type Props = {};

const Homepage = (props: Props) => {
  return (
    <>
      {/* Hero section */}
      <section className={`${styles.sectionClass}`}>
        {/* Hero text ---------------------------------------------- */}
        <div className="flex w-full flex-col items-center justify-center md:w-1/2">
          <h1 className="text-center">
            hey, i'm <span className="text-primary">emre</span>
            <br />i build <span className="text-primary">things.</span>
          </h1>
          <p className="mt-4 text-center">
            Graphic designah, UI/UX designah & front-end web developah
          </p>
        </div>
        {/* Hero image ---------------------------------------------- */}
        <div className="flex w-full items-center justify-center md:w-1/2">
          <div className="flex w-full items-center rounded-full bg-primary p-4 md:h-2/3 md:w-2/3">
            <img
              className="hero-image rounded-full object-cover"
              src="./selfie1.png"
              alt=""
            />
          </div>
        </div>
      </section>
      {/* Projects section */}
      <section className={`${styles.sectionClass}`}>
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
      </section>
    </>
  );
};

export default Homepage;
