import { Division, getDivisions } from '@/utils/divisions'

export interface League {
  id: string
  name: string,
  divisions: Division[]
}

export function getLeagues (): League[] {
  return [
    { id: '1', name: 'House', divisions: getDivisions('House') },
    { id: '2', name: 'Rep', divisions: getDivisions('Rep') }
  ]
}
