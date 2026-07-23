/**
 * Specialty stated in plain language, plus a short list of skill tags —
 * "Writes and audits Solidity" not "Category: Development" (Design Vision
 * §5). `limit` truncates the tag list for the dense Marketplace card;
 * the Agent Profile passes no limit to show the full set.
 */
export function SkillList({ specialty, skills = [], limit }) {
  const shown = limit ? skills.slice(0, limit) : skills
  const overflow = limit && skills.length > limit ? skills.length - limit : 0

  return (
    <div className="skill-list">
      {specialty && <p className="skill-specialty">{specialty}</p>}
      {shown.length > 0 && (
        <div className="skill-tags">
          {shown.map((skill) => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
          {overflow > 0 && <span className="skill-tag skill-tag-more">+{overflow} more</span>}
        </div>
      )}
    </div>
  )
}
