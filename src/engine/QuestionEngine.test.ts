import { describe, it, expect } from 'vitest'
import { generateQuestion } from './QuestionEngine'
import { mulberry32 } from './rng'
import { WORLDS } from '../data/words'

const SAMPLES = 50

describe('QuestionEngine invariants', () => {
  for (const world of WORLDS) {
    describe(`World: ${world.label}`, () => {
      for (let i = 0; i < SAMPLES; i++) {
        it(`sample ${i}: all 4 invariants hold`, () => {
          const entry = world.words[i % world.words.length]!
          const rng = mulberry32(i * 7919 + world.words.length * 31)
          const question = generateQuestion(world, entry, rng)

          // Invariant 1: options has exactly 4 entries
          expect(question.options).toHaveLength(4)

          // Invariant 2: all 4 entries are unique strings
          const unique = new Set(question.options)
          expect(unique.size).toBe(4)

          // Invariant 3: correctAnswer is always present in options
          expect(question.options).toContain(question.correctAnswer)

          // Invariant 4: prompt is always the entry passed in
          expect(question.prompt).toBe(entry)
        })
      }
    })
  }
})
