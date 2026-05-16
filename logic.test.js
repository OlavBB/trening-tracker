import { describe, it, expect } from 'vitest';
import { daysSince, badgeInfo, sorted } from './logic.js';

describe('daysSince', () => {
  it('returnerer null for null', () => {
    expect(daysSince(null)).toBe(null);
  });

  it('returnerer null for tom streng', () => {
    expect(daysSince('')).toBe(null);
  });

  it('returnerer 0 for dagens dato', () => {
    expect(daysSince(new Date().toISOString())).toBe(0);
  });

  it('returnerer 1 for i går', () => {
    const igaar = new Date(Date.now() - 86400000).toISOString();
    expect(daysSince(igaar)).toBe(1);
  });

  it('returnerer 7 for en uke siden', () => {
    const enUke = new Date(Date.now() - 7 * 86400000).toISOString();
    expect(daysSince(enUke)).toBe(7);
  });
});

describe('sorted', () => {
  const exercises = [
    { id: 'a' },
    { id: 'b' },
    { id: 'c' },
  ];

  it('øvelser aldri gjort havner øverst', () => {
    const state = {};
    const result = sorted(exercises, state);
    expect(result.map(e => e.id)).toEqual(['a', 'b', 'c']);
  });

  it('eldst gjort øverst, nyligst gjort nederst', () => {
    const state = {
      a: { date: new Date(Date.now() - 2 * 86400000).toISOString() },
      b: { date: new Date(Date.now() - 6 * 86400000).toISOString() },
      c: { date: new Date(Date.now() - 1 * 86400000).toISOString() },
    };
    const result = sorted(exercises, state);
    expect(result.map(e => e.id)).toEqual(['b', 'a', 'c']);
  });

  it('aldri-gjort øvelse vises før gjorte øvelser', () => {
    const state = {
      a: { date: new Date(Date.now() - 10 * 86400000).toISOString() },
      c: { date: new Date(Date.now() - 1 * 86400000).toISOString() },
    };
    const result = sorted(exercises, state);
    expect(result[0].id).toBe('b');
  });
});

describe('badgeInfo', () => {
  it('null → badge-never / Aldri', () => {
    expect(badgeInfo(null)).toEqual({ cls: 'badge-never', label: 'Aldri' });
  });

  it('0 → badge-fresh / I dag', () => {
    expect(badgeInfo(0)).toEqual({ cls: 'badge-fresh', label: 'I dag' });
  });

  it('1 → badge-fresh / 1 dag siden', () => {
    expect(badgeInfo(1)).toEqual({ cls: 'badge-fresh', label: '1 dag siden' });
  });

  it('4 → badge-fresh (øvre grense for grønn)', () => {
    expect(badgeInfo(4)).toEqual({ cls: 'badge-fresh', label: '4 dager siden' });
  });

  it('5 → badge-soon (nedre grense for oransje)', () => {
    expect(badgeInfo(5)).toEqual({ cls: 'badge-soon', label: '5 dager siden' });
  });

  it('7 → badge-soon (øvre grense for oransje)', () => {
    expect(badgeInfo(7)).toEqual({ cls: 'badge-soon', label: '7 dager siden' });
  });

  it('8 → badge-due (rød)', () => {
    expect(badgeInfo(8)).toEqual({ cls: 'badge-due', label: '8 dager siden' });
  });
});
