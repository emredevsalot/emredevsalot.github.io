type Props = {};

const Homepage = (props: Props) => {
  return (
    // Hero section
    <section>
      <div className="mx-28 flex h-screen">
        {/* Hero text ---------------------------------------------- */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <h1>
            hey, i'm <span className="text-primary">emre</span>
            <br />i build <span className="text-primary">things.</span>
          </h1>
          <p className="mt-4">
            Graphic designah, UI/UX designah & front-end web developah
          </p>
        </div>
        {/* Hero image ---------------------------------------------- */}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex h-3/4 rounded-full bg-primary p-8">
            <img
              className="hero-image rounded-full object-cover"
              src="./selfie1.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Homepage;
