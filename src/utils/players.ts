import { getPlayerStats, Stats } from '@/utils/stats'
import faker from 'faker'

interface Parent {
  name: string
  relationship: string
  phone: string
  email: string
}

export interface Player {
  id: string
  hcid: string
  name: string
  dob: string
  phone: string
  email: string
  address: string
  parents: Parent[],
  stats: Stats[]
}

export function getPlayers (team: string): Player[] {
  return Array(20).fill(0).map((_value, i) => {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()

    return {
      id: `${i}`,
      name: `${lastName}, ${firstName}`,
      hcid: faker.unique(faker.datatype.number, [{ min: 1000000000, max: 1000700000 }]).toString(),
      dob: faker.datatype.datetime({ min: new Date('2003-01-01').getTime(), max: new Date('2011-01-01').getTime() }).toLocaleDateString(),
      phone: faker.phone.phoneNumber(faker.phone.phoneNumberFormat(1)),
      email: faker.internet.email(firstName, lastName, 'gmail.com'),
      address: `${faker.address.streetAddress()}, Oakville, ON`,
      parents: Array(2).fill({}).map((_value, i) => {
        const firstName = faker.name.firstName()
        const lastName = faker.name.lastName()
        return {
          name: `${firstName} ${lastName}`,
          relationship: i === 0 ? 'Father' : 'Mother',
          phone: faker.phone.phoneNumber(faker.phone.phoneNumberFormat(1)),
          email: faker.internet.email(firstName, lastName, 'gmail.com')
        }
      }),
      stats: getPlayerStats(team)
    }
  })
}
