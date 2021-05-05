import { getTeams, Team } from '@/utils/teams'
import faker from 'faker'

export interface SubDivision {
  id: string
  name: string
  teams: Team[]
}

export function getSubDivisions (league: string, division: string): SubDivision[] {
  return Array(faker.datatype.number({ min: 1, max: 4 })).fill({}).map((_value, i) => {
    const name = `Tier ${(league === 'Rep' ? 1 : 5) + i}`
    return {
      id: `${division}${i}`,
      name,
      teams: getTeams(division, name)
    }
  })
}
