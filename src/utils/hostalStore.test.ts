import test from 'node:test';
import assert from 'node:assert/strict';
import { fixLegacyPaths } from './hostalStore';

test('fixLegacyPaths cambia las rutas viejas de fotos por /images', () => {
  const rooms = [
    { id: 'simple', image: '/src/assets/images/a.jpg', gallery: ['/src/assets/images/a.jpg', '/images/b.jpg'] }
  ];
  const fixed = fixLegacyPaths(rooms);
  assert.equal(fixed[0].image, '/images/a.jpg');
  assert.deepEqual(fixed[0].gallery, ['/images/a.jpg', '/images/b.jpg']);
});

test('fixLegacyPaths deja intacto lo que ya está bien', () => {
  const info = { facadeImage: '/assets/aistudio/fachada.jpg', name: 'Hostal Aguilar' };
  assert.equal(fixLegacyPaths(info), info);
});
