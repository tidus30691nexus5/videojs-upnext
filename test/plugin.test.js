import document from 'global/document';

import QUnit from 'qunit';
import sinon from 'sinon';
import videojs from 'video.js';

import plugin from '../src/plugin';

const Player = videojs.getComponent('Player');

QUnit.test('the environment is sane', function(assert) {
  assert.strictEqual(typeof Array.isArray, 'function', 'es5 exists');
  assert.strictEqual(typeof sinon, 'object', 'sinon exists');
  assert.strictEqual(typeof videojs, 'function', 'videojs exists');
  assert.strictEqual(typeof plugin, 'function', 'plugin is a function');
});

QUnit.module('videojs-upnext', {

  beforeEach() {
    this.fixture = document.getElementById('qunit-fixture');
    this.video = document.createElement('video');
    this.fixture.appendChild(this.video);
    this.player = videojs(this.video);

    // Mock the environment's timers because certain things - particularly
    // player readiness - are asynchronous in video.js 5.
    this.clock = sinon.useFakeTimers();
  },

  afterEach() {

    // The clock _must_ be restored before disposing the player; otherwise,
    // certain timeout listeners that happen inside video.js may throw errors.
    this.clock.restore();
    this.player.dispose();
  }
});

QUnit.test('registers itself with video.js', function(assert) {

  assert.strictEqual(
    typeof Player.prototype.upnext,
    'function',
    'videojs-upnext plugin was registered'
  );

  this.player.upnext();

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);
});
