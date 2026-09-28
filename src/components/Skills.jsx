import { skills } from '../data/portfolio'

export default function Skills() {
  return (
    <section className="section" id="skills">
      <h2 className="section__title">Skills</h2>

      <div className="skills">
        {skills.map((group) => (
          <div className="skills__group" key={group.group}>
            <h3 className="skills__label">{group.group}</h3>
            <ul className="skills__items">
              {group.items.map((item) => (
                <li className="tag" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
