import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildLeadRow, validateLead } from './leads.js';

test('valid lead passes validation', () => {
  const errors = validateLead({ name: 'Ana Rivera', phone: '(787) 555-0123', consent: true });
  assert.deepEqual(errors, []);
});

test('missing name, short phone, and no consent are rejected', () => {
  const errors = validateLead({ name: ' ', phone: '123', consent: false });
  assert.equal(errors.length, 3);
});

test('bad email is rejected', () => {
  const errors = validateLead({ name: 'Ana', phone: '7875550123', email: 'not-an-email', consent: true });
  assert.ok(errors.some((e) => e.includes('Email')));
});

test('avatar-intake source skips the name/consent/phone requirement', () => {
  const errors = validateLead({ source: 'avatar-intake', caseType: 'car-accident' });
  assert.deepEqual(errors, []);
});

test('buildLeadRow normalizes language and source, maps to snake_case columns', () => {
  const row = buildLeadRow({ name: 'Ana', phone: '787', language: 'fr', source: 'hacked' });
  assert.equal(row.language, 'en');
  assert.equal(row.source, 'case-evaluation-form');
  assert.ok(row.id);
  assert.ok(row.received_at);
  assert.equal(row.name, 'Ana');
  assert.equal(row.consent, 0);
});
