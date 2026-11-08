import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validatePasswordChange,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
  AdminAmenity
} from './adminAuth';

test('validatePasswordChange validates required fields and rules', () => {
  const emptyCurrent = validatePasswordChange('', 'NuevaClave2026', 'NuevaClave2026');
  assert.equal(emptyCurrent.success, false);

  const shortNew = validatePasswordChange('ClaveActual1', '1234567', '1234567');
  assert.equal(shortNew.success, false);
  assert.ok(shortNew.error?.includes('al menos 8'));

  const sameNew = validatePasswordChange('ClaveActual1', 'ClaveActual1', 'ClaveActual1');
  assert.equal(sameNew.success, false);
  assert.ok(sameNew.error?.includes('diferente a la actual'));

  const mismatch = validatePasswordChange('ClaveActual1', 'NuevaClave2026', 'OtraClave2026');
  assert.equal(mismatch.success, false);
  assert.ok(mismatch.error?.includes('no coincide'));

  const valid = validatePasswordChange('ClaveActual1', 'NuevaClave2026', 'NuevaClave2026');
  assert.equal(valid.success, true);
});

test('createService, updateService, toggleServiceStatus, deleteService work correctly', () => {
  const initialServices: AdminAmenity[] = [
    { id: '1', title: 'Wi-Fi', description: 'Alta velocidad', iconName: 'wifi', active: true }
  ];

  // Create
  const createRes = createService(
    { title: 'Desayuno Andino', description: 'Café cajamarquino y pan caliente', iconName: 'coffee' },
    initialServices
  );
  assert.equal(createRes.success, true);
  assert.equal(createRes.services.length, 2);
  const createdId = createRes.services[1].id;

  // Toggle status
  const toggled = toggleServiceStatus(createdId, createRes.services);
  assert.equal(toggled[1].active, false);

  // Update
  const updateRes = updateService(
    { ...toggled[1], title: 'Desayuno Buffet' },
    toggled
  );
  assert.equal(updateRes.success, true);
  assert.equal(updateRes.services[1].title, 'Desayuno Buffet');

  // Delete
  const delRes = deleteService(createdId, updateRes.services);
  assert.equal(delRes.success, true);
  assert.equal(delRes.services.length, 1);
  assert.equal(delRes.services[0].id, '1');
});
