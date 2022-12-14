import { TimePointSec } from "@greymass/eosio";
import { Blockchain } from "@proton/vert"
import { it, describe, beforeEach } from "node:test";
import assert from 'node:assert';

// Vert EOS VM
const blockchain = new Blockchain()

// contracts
const time = blockchain.createContract('eosio.time', 'eosio.time', true);

// one-time setup
beforeEach(async () => {
  blockchain.setTime(TimePointSec.from(new Date()));
});

describe('eosio.time', () => {
  it("check time in past", async () => {
    await time.actions.checktime(["2022-09-07T00:00:00.000"]).send();
    assert.ok(true)
  });

  it("error: check time in future", async () => {
    const action = time.actions.checktime(["2030-01-01T00:00:00.000"]).send();
    await expectToThrow(action, /the current time must be passed \[time\] timestamp/);
  });
});

/**
 * Expect a promise to throw an error with a specific message.
 * @param promise - The promise to await.
 * @param {string} errorMsg - The error message that we expect to see.
 */
const expectToThrow = async (promise, errorMsg) => {
  try {
    await promise
    assert.fail('Expected promise to throw an error');
  } catch (e) {
    if ( errorMsg ) assert.match(e.message, errorMsg);
    else assert.fail('Expected promise to throw an error');
  }
}