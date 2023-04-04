import styles from "../../styles";
import Hero from "./Hero";
import Projects from "./Projects";

type Props = {};

const Homepage = (props: Props) => {
  return (
    <>
      <section
        className={`flex flex-col items-center gap-8 py-[clamp(3rem,6vw,5rem)] md:flex-row`}
      >
        <Hero />
      </section>
      <section
        className={`flex flex-col items-start gap-8 py-[clamp(3rem,6vw,5rem)] md:flex-row`}
      >
        <Projects />
      </section>
    </>
  );
};

export default Homepage;
