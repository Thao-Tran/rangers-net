import { Evaluation, getEvaluation } from '@/utils/evaluations'
import { getSuspensions, Suspension } from '@/utils/suspensions'
import faker from 'faker'

export enum Position {
  Player = 'Player',
  Goalie = 'Goalie'
}

enum Hand {
  Left = 'L',
  Right = 'R'
}

export interface Stats {
  season: string
  team: string
  position: Position
  hand: Hand
  rank?: number
  rating?: string
  gamesPlayed: number
  goals: number
  assists: number
  points: number
  penaltyMinutes: number
  evaluation: Evaluation,
  suspensions: Suspension[]
}

export function getPlayerStats (team: string): Stats[] {
  return Array(faker.datatype.number({ min: 1, max: 10 })).fill({}).map((_value, i) => {
    return {
      season: `${new Date().getFullYear() - i}/${new Date().getFullYear() - i - 1}`,
      team,
      position: Position.Player,
      hand: faker.random.arrayElement(Object.values(Hand)),
      rank: i === 0 ? undefined : faker.datatype.number(200),
      rating: i === 0 ? undefined : faker.datatype.number(100).toString(),
      gamesPlayed: faker.datatype.number(20),
      goals: faker.datatype.number(20),
      assists: faker.datatype.number(20),
      points: faker.datatype.number(20),
      penaltyMinutes: faker.datatype.number(5),
      evaluation: getEvaluation(),
      suspensions: getSuspensions()
    }
  })
}
