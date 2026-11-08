import test from 'node:test';
import assert from 'node:assert/strict';
import { dayPhase, cajamarcaNow } from './dayPhase';

test('dayPhase cubre las 24 horas con los cortes esperados', () => {
  assert.equal(dayPhase(0), 'noche');
  assert.equal(dayPhase(4), 'noche');
  assert.equal(dayPhase(5), 'amanecer');
  assert.equal(dayPhase(7), 'amanecer');
  assert.equal(dayPhase(8), 'dia');
  assert.equal(dayPhase(16), 'dia');
  assert.equal(dayPhase(17), 'atardecer');
  assert.equal(dayPhase(18), 'atardecer');
  assert.equal(dayPhase(19), 'noche');
  assert.equal(dayPhase(23), 'noche');
});

test('cajamarcaNow usa la hora de Lima (UTC-5), no la del equipo', () => {
  // 2026-11-08 03:30 UTC = 2026-11-07 22:30 en Cajamarca
  const { hour, label } = cajamarcaNow(new Date('2026-11-08T03:30:00Z'));
  assert.equal(hour, 22);
  assert.ok(label.includes('10:30'));
  // 2026-11-08 12:00 UTC = 07:00 en Cajamarca (amanecer)
  assert.equal(dayPhase(cajamarcaNow(new Date('2026-11-08T12:00:00Z')).hour), 'amanecer');
});
