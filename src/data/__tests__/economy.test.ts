import { POINTS_PER_PESO, pointsToPeso, rewards, games, triviaQuestions } from '@/data';

test('every reward price is consistent with POINTS_PER_PESO', () => {
  for (const r of rewards) {
    expect([r.id, r.pointCost]).toEqual([r.id, r.pesoValue * POINTS_PER_PESO]);
  }
});

test('pointsToPeso inverts the point cost', () => {
  for (const r of rewards) {
    expect(pointsToPeso(r.pointCost)).toBeCloseTo(r.pesoValue, 6);
  }
});

test('trivia answers index into their own choices', () => {
  for (const q of triviaQuestions) {
    expect(q.choices[q.answerIndex]).toBeDefined();
  }
});

test('playable games have a sane reward range', () => {
  for (const g of games) {
    expect(g.maxReward).toBeGreaterThanOrEqual(g.minReward);
  }
});
