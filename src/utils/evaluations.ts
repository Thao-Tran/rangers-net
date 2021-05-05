import faker from 'faker'

interface EvaluationCategory {
  field: string
  label: string
}

export function getEvaluationCategories (): EvaluationCategory[] {
  return [
    { label: 'Agility', field: 'agility' },
    { label: 'Angles', field: 'angles' },
    { label: 'Team Play', field: 'teamPlay' },
    { label: 'Glove', field: 'glove' },
    { label: 'Challenge', field: 'challenge' },
    { label: 'Effectiveness', field: 'effectiveness' },
    { label: 'Stick', field: 'stick' },
    { label: 'Clear rebounds', field: 'clearRebounds' },
    { label: 'Blocker', field: 'blocker' },
    { label: 'Puck control', field: 'puckControl' }
  ]
}

export function getEvaluation (): Record<string, string> {
  const fields = getEvaluationCategories().map(({ field }) => field)
  const evaluation: Record<string, string> = fields.reduce((evaluation, field) => {
    return {
      ...evaluation,
      [field]: (faker.datatype.number(10) + faker.random.arrayElement([0, 0.5])).toFixed(1)
    }
  }, {})

  return {
    ...evaluation,
    total: Object.values(evaluation).reduce((total, score) => total + parseInt(score), 0).toFixed(1),
    comments: faker.lorem.paragraph()
  }
}
