import { describe, expect, it } from 'vitest';
import { parseDatabaseUrl, readPoolMax, requireLocalDatabase } from '../../src/infrastructure/db/config';
const local = 'postgresql://user:password@127.0.0.1:55433/my_goals_test';
describe('local database guard', () => {
  it('accepts only the explicitly designated isolated test database', () => {
    expect(requireLocalDatabase(local, 'test')).toBe(local);
    expect(() => requireLocalDatabase(local, 'development')).toThrow('my_goals_dev');
  });
  it.each([
    'postgresql://user:password@db.example.com/my_goals_test',
    'postgresql://user:password@127.0.0.1/production',
    'postgresql://user:password@127.0.0.1/my_goals_test?host=db.example.com',
    'https://127.0.0.1/my_goals_test',
    'not-a-url',
  ])('rejects nonlocal, wrong-database and connection-override inputs', value => {
    expect(() => requireLocalDatabase(value, 'test')).toThrow();
  });
  it('reports missing configuration without including credentials', () => {
    expect(() => parseDatabaseUrl(undefined)).toThrow('required');
  });
});
describe('bounded connection count', () => {
  it('uses a small default and accepts a configured positive integer', () => {
    expect(readPoolMax(undefined)).toBe(3);
    expect(readPoolMax('5')).toBe(5);
  });
  it.each(['0','11','1.5','NaN',''])('rejects invalid counts', value => {
    expect(() => readPoolMax(value)).toThrow();
  });
});
