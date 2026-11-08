import test from 'node:test';
import assert from 'node:assert/strict';
import { getGoogleMapsNavigationUrl, getGoogleMapsEmbedUrl, estimateTravel } from './location';

test('getGoogleMapsNavigationUrl formats walking route correctly', () => {
  const url = getGoogleMapsNavigationUrl('Hostal Aguilar', 'Av. San Martín, Cajamarca', 'walking');
  assert.ok(url.includes('destination=Hostal%20Aguilar'));
  assert.ok(url.includes('origin=Av.%20San%20Mart%C3%ADn%2C%20Cajamarca'));
  assert.ok(url.includes('travelmode=walking'));
});

test('getGoogleMapsEmbedUrl formats embed query with zoom', () => {
  const url = getGoogleMapsEmbedUrl('Jr. Los Andes 115, Cajamarca', 17);
  assert.ok(url.includes('maps.google.com/maps'));
  assert.ok(url.includes('output=embed'));
  assert.ok(url.includes('z=17'));
});

test('estimateTravel handles close distances (< 300m)', () => {
  const res = estimateTravel(150);
  assert.equal(res.meters, 150);
  assert.equal(res.walkingMinutes, 2);
  assert.ok(res.displayText.includes('150 m (2 min a pie)'));
});

test('estimateTravel handles medium and city center distances', () => {
  const res = estimateTravel(1100);
  assert.equal(res.meters, 1100);
  assert.ok(res.displayText.includes('1.1 km'));
  assert.ok(res.displayText.includes('min en taxi'));
});
