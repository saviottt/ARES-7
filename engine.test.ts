import { describe, expect, it } from 'vitest'
import { CAMPAIGN } from './scenarios'
import { executeSol, INITIAL_STATE, missionStars, planBudget, doseFor, type Allocation, type MissionState } from './engine'

const PLANS: Record<string, Allocation[]> = {
  EVEN: [[30, 30, 30], [30, 30, 30], [25, 25, 25], [30, 30, 30], [20, 20, 20], [30, 30, 30], [30, 30, 30]].map(([shield, bio, hab]) => ({ shield, bio, hab })),
  HEUR: [[20, 40, 40], [25, 40, 35], [20, 30, 25], [20, 40, 35], [15, 25, 25], [45, 30, 25], [25, 35, 30]].map(([shield, bio, hab]) => ({ shield, bio, hab })),
  NOSHIELD: Array.from({ length: 7 }, () => ({ shield: 0, bio: 40, hab: 40 })),
  SHARP: [[10, 40, 55], [45, 40, 20], [0, 35, 40], [0, 40, 60], [5, 50, 10], [35, 60, 20], [25, 10, 55]].map(([shield, bio, hab]) => ({ shield, bio, hab })),
}
const EXPECTED = {
  EVEN: [25, 42, 6, 4.62, 1],
  HEUR: [61.25, 62, 60.43, 4.50, 2],
  NOSHIELD: [100, 80, 40.26, 11.71, 1],
  SHARP: [87.75, 77.75, 77.04, 5.30, 3],
} as const

function play(plan: Allocation[]): MissionState {
  return plan.reduce((state, allocation, index) => executeSol(state, CAMPAIGN[index], allocation).state, { ...INITIAL_STATE })
}

describe('ARES-7 campaign engine', () => {
  it.each(Object.keys(PLANS))('matches PDF reference plan %s within 0.1', key => {
    const final = play(PLANS[key])
    const expected = EXPECTED[key as keyof typeof EXPECTED]
    expect(final.o2Water).toBeCloseTo(expected[0], 1)
    expect(final.food).toBeCloseTo(expected[1], 1)
    expect(final.crewHealth).toBeCloseTo(expected[2], 1)
    expect(final.cumRad).toBeCloseTo(expected[3], 1)
    expect(missionStars(final)).toBe(expected[4])
  })

  it('matches the two reference radiation calculations', () => {
    expect(doseFor(7.5, 50)).toBeCloseTo(0.97, 2)
    expect(doseFor(3.8, 25)).toBeCloseTo(1.09, 2)
  })

  it('rejects power outside 5 kW increments and plans beyond battery', () => {
    expect(planBudget(INITIAL_STATE, CAMPAIGN[0], { shield: 10, bio: 12, hab: 30 }).legal).toBe(false)
    const emptyBattery = { ...INITIAL_STATE, battery: 0 }
    expect(planBudget(emptyBattery, CAMPAIGN[4], { shield: 25, bio: 25, hab: 25 }).legal).toBe(false)
  })

  it('uses the low-health supply penalty and returns a full ordered trace', () => {
    const tired = { ...INITIAL_STATE, crewHealth: 60 }
    const plan = planBudget(tired, CAMPAIGN[0], { shield: 30, bio: 40, hab: 40 })
    expect(plan.available).toBe(90)
    const result = executeSol(INITIAL_STATE, CAMPAIGN[0], { shield: 30, bio: 40, hab: 40 })
    expect(result.trace.map(step => step.key)).toEqual(['power', 'dose', 'cumRad', 'food', 'bioBonus', 'o2Water', 'penalties', 'crewHealth', 'battery'])
  })
})
