import faker from 'faker'
import _ from 'lodash-es'

export interface Suspension {
  gameId: string
  time: string
  team: string
  infraction: string
  length: string
  served: string
}

export function getSuspensions (): Suspension[] {
  return Array(faker.datatype.number(6)).fill({}).map((): Suspension => {
    const length = faker.datatype.number(3)
    return {
      gameId: faker.datatype.number(20).toString(),
      time: faker.date.recent().toLocaleString(undefined, { timeStyle: 'short', dateStyle: 'short' }),
      team: faker.name.lastName(),
      infraction: _.startCase(faker.lorem.words()),
      length: `${length} Game${length > 1 ? 's' : ''}`,
      served: `${length} Game${length > 1 ? 's' : ''}`
    }
  })
}
