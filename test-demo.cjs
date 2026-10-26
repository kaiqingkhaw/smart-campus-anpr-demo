const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
let model;
if (fs.existsSync(path.join(__dirname, 'demo.js'))) {
  model = require('./demo.js');
} else {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];
  const source = scripts.find(m => m[1].includes('function createState()'));
  assert.ok(source, 'The published page must contain the demo model');
  const sandbox = {module: {exports: {}}};
  vm.runInNewContext(source[1], sandbox);
  model = sandbox.module.exports;
}
const {createState, available, scan, unregisteredPlate} = model;

test('an entry and exit restore the same category capacity', () => {
  const state = createState();
  assert.equal(scan(state, 'DEMO101').status, 'GRANTED');
  assert.equal(available(state, 'Staff'), 5);
  assert.equal(scan(state, 'DEMO101').status, 'GRANTED');
  assert.equal(available(state, 'Staff'), 6);
});
test('full parking, unknown and unreadable plates preserve occupancy', () => {
  const state = createState();
  const before = JSON.stringify(state.parked);
  assert.equal(scan(state, 'DEMO203').status, 'PARKING_FULL');
  assert.equal(scan(state, 'UNKNOWN999').status, 'DENIED');
  assert.equal(scan(state, 'DEMO101', false).status, 'DENIED');
  assert.equal(JSON.stringify(state.parked), before);
});
test('inactive records are denied', () => {
  const state = createState();
  state.vehicles[0].active = false;
  assert.equal(scan(state, 'DEMO101').status, 'DENIED');
  assert.equal(available(state, 'Staff'), 6);
});
test('exit releases the original category after a registry edit', () => {
  const state = createState();
  state.vehicles[1].category = 'Staff';
  scan(state, 'DEMO102');
  assert.equal(available(state, 'Students'), 8);
  assert.equal(available(state, 'Staff'), 6);
});
test('unregistered scenario remains denied if its default plate is registered', () => {
  const state = createState();
  state.vehicles.push({plate:'DEMO999', category:'Staff', active:true});
  state.vehicles.push({plate:'DEMO1000', category:'Staff', active:true});
  assert.equal(scan(state, unregisteredPlate(state)).status, 'DENIED');
});
test('repeated entries and exits keep occupancy within capacity', () => {
  const state = createState();
  for (let i=0; i<100; i++) {
    scan(state, 'DEMO101');
    assert.equal(state.parked.filter(v => v.plate === 'DEMO101').length, (i+1)%2);
    assert.ok(available(state, 'Staff') >= 0 && available(state, 'Staff') <= 6);
  }
});
test('reset creates independent records, logs and parking state', () => {
  const first = createState();
  first.vehicles[0].active = false;
  first.capacity.Staff = 0;
  first.parked.pop();
  scan(first, 'UNKNOWN999');
  const fresh = createState();
  assert.equal(fresh.vehicles[0].active, true);
  assert.equal(fresh.capacity.Staff, 6);
  assert.equal(fresh.logs.length, 0);
  assert.equal(fresh.parked.length, 3);
});
