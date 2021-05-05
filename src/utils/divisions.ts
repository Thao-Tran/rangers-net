import { getSubDivisions, SubDivision } from '@/utils/sub-divisions'

export interface Division {
  id: string
  name: string
  subDivisions: SubDivision[]
}

export function getDivisions (league: string): Division[] {
  return [
    { id: `${league}U5`, name: 'U5', subDivisions: getSubDivisions(league, 'U5') },
    { id: `${league}U7`, name: 'U7', subDivisions: getSubDivisions(league, 'U7') },
    { id: `${league}U8`, name: 'U8', subDivisions: getSubDivisions(league, 'U8') },
    { id: `${league}U9`, name: 'U9', subDivisions: getSubDivisions(league, 'U9') },
    { id: `${league}U10`, name: 'U10', subDivisions: getSubDivisions(league, 'U10') },
    { id: `${league}U11`, name: 'U11', subDivisions: getSubDivisions(league, 'U11') },
    { id: `${league}U12`, name: 'U12', subDivisions: getSubDivisions(league, 'U12') },
    { id: `${league}U13`, name: 'U13', subDivisions: getSubDivisions(league, 'U13') },
    { id: `${league}U14`, name: 'U14', subDivisions: getSubDivisions(league, 'U14') },
    { id: `${league}U15`, name: 'U15', subDivisions: getSubDivisions(league, 'U15') },
    { id: `${league}U16`, name: 'U16', subDivisions: getSubDivisions(league, 'U16') },
    { id: `${league}U18`, name: 'U18', subDivisions: getSubDivisions(league, 'U18') },
    { id: `${league}U21`, name: 'U21', subDivisions: getSubDivisions(league, 'U21') }
  ]
}
