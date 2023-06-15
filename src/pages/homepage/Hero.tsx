import Button from "../../components/Button";

type Props = {};

const Hero = (props: Props) => {
  return (
    <>
      <section
        className={`flex min-h-screen flex-col items-center gap-8 py-[clamp(3rem,6vw,5rem)] md:flex-row`}
      >
        {/* Hero text ---------------------------------------------- */}
        <div className="flex w-full flex-col items-center justify-center md:w-1/2">
          <h1 className="text-center">
            hey, i'm <span className="text-primary">emre</span>
            <br />i build <span className="text-primary">things.</span>
          </h1>
          <p className="mb-12 mt-4 text-center">
            Frontend developer who likes to develop fun little projects with
            various libraries in order to deepen my knowledge in the field.
          </p>
          <a href="/Emre_Ergul_Resume.pdf" target="_blank">
            <Button children="My Resume" />
          </a>
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
    </>
  );
};

export default Hero;
