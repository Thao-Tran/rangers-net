import faker from 'faker'

export interface Team {
  id: string
  name: string
}

export function getTeams (division: string, subDivision: string): Team[] {
  return Array(faker.datatype.number({ min: 5, max: 10 })).fill('').map((_, i) => {
    const id = `${division}${subDivision.split(' ').map(word => word.charAt(0)).join('')}${String.fromCharCode(i + 65)}`
    return {
      id,
      name: `${id} - ${faker.name.lastName().toUpperCase()}`
    }
  })
}
