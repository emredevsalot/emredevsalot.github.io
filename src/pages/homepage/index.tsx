import styles from "../../styles";
import Hero from "./Hero";
import Projects from "./Projects";

type Props = {};

const Homepage = (props: Props) => {
  return (
    <div className="container mx-auto">
      <Hero />
      <Projects />
    </div>
  );
};

export default Homepage;
