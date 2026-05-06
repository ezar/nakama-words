export interface Rank {
  rank: number
  label: string
  berries: number
}

export const RANKS: Rank[] = [
  { rank: 1, label: 'Cabin Boy',   berries: 0 },
  { rank: 2, label: 'Sailor',      berries: 500 },
  { rank: 3, label: 'Pirate',      berries: 1500 },
  { rank: 4, label: 'First Mate',  berries: 3500 },
  { rank: 5, label: 'Captain',     berries: 7000 },
  { rank: 6, label: 'Warlord',     berries: 15000 },
  { rank: 7, label: 'Emperor',     berries: 30000 },
  { rank: 8, label: 'Pirate King', berries: 60000 },
]
