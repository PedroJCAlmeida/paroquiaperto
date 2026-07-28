import test from 'node:test';
import assert from 'node:assert/strict';
import { getExpiryDate, isExpired } from '../lib/auth';

test('getExpiryDate creates a date one hour in the future', () => {
  const before = Date.now();
  const expiry = getExpiryDate(1);
  const after = Date.now();

  assert.ok(expiry instanceof Date);
  assert.ok(expiry.getTime() >= before + 60 * 60 * 1000 - 1000);
  assert.ok(expiry.getTime() <= after + 60 * 60 * 1000 + 1000);
});

test('isExpired returns true for past and current expiry values', () => {
  const now = new Date('2026-01-01T12:00:00.000Z');
  assert.equal(isExpired(new Date('2025-12-31T11:59:59.000Z'), now), true);
  assert.equal(isExpired(new Date('2026-01-01T12:00:00.000Z'), now), true);
  assert.equal(isExpired(new Date('2026-01-01T12:00:01.000Z'), now), false);
});
