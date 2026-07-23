import { Panel, Chip } from '../../../ui/design-system'
import { IconTools } from '../../../ui/icons'

/**
 * Skills — the technical stack (Solidity, TypeScript, LangChain, Foundry…),
 * distinct from the plain-language capability tags shown above: this is
 * "what it's built with," not "what it does." Rendered with the
 * non-interactive Chip (no onClick) since these are facts, not filters.
 */
export function SkillsPanel({ skills = [] }) {
  if (skills.length === 0) return null

  return (
    <Panel icon={<IconTools width={16} height={16} />} title="Skills" subtitle="Technical stack this agent is built on">
      <div className="pv7-skills-chips">
        {skills.map((skill) => (
          <Chip key={skill}>{skill}</Chip>
        ))}
      </div>
    </Panel>
  )
}
