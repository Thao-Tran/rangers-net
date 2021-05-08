import faker from 'faker'

interface EvaluationCategory {
  field: string
  label: string
  help: string
}

export function getEvaluationCategories (): EvaluationCategory[] {
  return [
    { label: 'Agility', field: 'agility', help: 'Help text' },
    { label: 'Angles', field: 'angles', help: 'Help text' },
    { label: 'Team Play', field: 'teamPlay', help: 'Help text' },
    { label: 'Glove', field: 'glove', help: 'Help text' },
    { label: 'Challenge', field: 'challenge', help: 'Help text' },
    { label: 'Effectiveness', field: 'effectiveness', help: 'Help text' },
    { label: 'Stick', field: 'stick', help: 'Help text' },
    { label: 'Clear rebounds', field: 'clearRebounds', help: 'Help text' },
    { label: 'Blocker', field: 'blocker', help: 'Help text' },
    { label: 'Puck control', field: 'puckControl', help: 'Help text' }
  ]
}

export interface Evaluation extends Record<string, any> {
  total?: string
  comments?: string
  completed?: boolean
}

export function getEvaluation (): Evaluation {
  const fields = getEvaluationCategories().map(({ field }) => field)
  const evaluation: Record<string, string> = fields.reduce((evaluation, field) => {
    const value = faker.datatype.number({ min: 1, max: 10 })
    return {
      ...evaluation,
      [field]: (value < 10 ? value + faker.random.arrayElement([0, 0.5]) : value).toFixed(1)
    }
  }, {})

  return {
    ...evaluation,
    total: Object.values(evaluation).reduce((total, score) => total + parseInt(score), 0).toFixed(1),
    comments: faker.lorem.paragraph(),
    completed: true
  }
}
