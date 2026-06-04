import { H1 } from "../../components/Typography";
import { createMeta } from "../../utils/Meta"
import { Link } from "react-router"
import { Timeline } from "./TimeLine"
import { CV_DATA } from "./cv"

export const meta = () => {
  return createMeta({
    title : "Curiculum Vitae — Aero",
    description:
      "My experiences.",
    url: "https://Aero/cv",
  })
}

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <Link id={title} to={`#${title}`}>
    <h3 className="tracking-widest  text-[1.9rem] leading-[1.9rem] font-extralight uppercase">
      {title}
    </h3>
  </Link>
);

export default function CVPage() {
    return (
      <div className="space-y-18">
        <H1 id="CuriculumVitae" className="scale-x-50">Curiculum Vitae</H1>
        <section>
          <SectionTitle title="Experience" />
        </section>

        <section>
          <Timeline timeline={CV_DATA.work} />
        </section>
      </div>
    )
}