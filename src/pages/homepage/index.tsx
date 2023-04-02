import styles from "../../styles";
import Hero from "./Hero";
import Projects from "./Projects";

type Props = {};

const Homepage = (props: Props) => {
  return (
    <>
      <section className={`${styles.sectionClass}`}>
        <Hero />
      </section>
      <section className={`${styles.sectionClass}`}>
        <Projects />
      </section>
    </>
  );
};

export default Homepage;
