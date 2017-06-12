'use strict';

const db = require('sqlite');
const sinon = require('sinon');
const { expect } = require('chai');

const { createItem, updateItem, deleteItem } = require('./items');

const sandbox = sinon.sandbox.create();

describe('item queries', () => {
  beforeEach(() => sandbox.stub(db, 'run'));
  afterEach(() => sandbox.restore());

  it('#createItem', () => {
    db.run.returns({ stmt: { lastID: 42 } });

    return createItem(1, { name: 'Test-created item' }).then(() => {
      sinon.assert.calledOnce(db.run);
      expect(db.run.firstCall.args[0]).to.have.string('insert into items');
      expect(db.run.firstCall.args[1]).to.contain({
        $listId: 1,
        $name: 'Test-created item',
      });
    });
  });

  it('#updateItem', () => {
    return updateItem(1, 1, { checked: true }).then(() => {
      sinon.assert.calledOnce(db.run);
      expect(db.run.firstCall.args[0]).to.have.string('update items set');
      expect(db.run.firstCall.args[1]).to.contain({
        $listId: 1,
        $itemId: 1,
        $checked: true,
      });
    });
  });

  it('#deleteItem', () => {
    return deleteItem(1, 1).then(() => {
      sinon.assert.calledOnce(db.run);
      expect(db.run.firstCall.args[0]).to.have.string('delete from items');
      expect(db.run.firstCall.args[1]).to.contain({
        $listId: 1,
        $itemId: 1,
      });
    });
  });
});
