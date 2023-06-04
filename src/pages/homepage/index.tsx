import styles from "../../styles";
import Hero from "./Hero";
import Projects from "./Projects";

type Props = {};

const Homepage = (props: Props) => {
  return (
    <div className="container mx-auto">
      <section
        className={`flex flex-col items-center gap-8 py-[clamp(3rem,6vw,5rem)] md:flex-row`}
      >
        <Hero />
      </section>
      <section
        className={`grid grid-cols-1 gap-8 py-[clamp(3rem,6vw,5rem)] md:grid-cols-2 lg:grid-cols-3`}
      >
        <Projects />
      </section>
    </div>
  );
};

export default Homepage;
