'use strict';

const db = require('sqlite');
const sinon = require('sinon');
const { expect } = require('chai');

const { getAllLists, getList } = require('./lists');

const sandbox = sinon.sandbox.create();

describe('list queries', () => {
  beforeEach(() => {
    sandbox.stub(db, 'all');
    sandbox.stub(db, 'get');
  });

  afterEach(() => sandbox.restore());

  it('#getAllLists', () => {
    return getAllLists().then(() => {
      sinon.assert.calledOnce(db.all);
      expect(db.all.firstCall.args[0]).to.have.string('select');
    });
  });

  it('#getList', () => {
    return getList(1).then(() => {
      // select ... from lists
      sinon.assert.calledOnce(db.get);
      expect(db.get.firstCall.args[0]).to.have.string('select');
      expect(db.get.firstCall.args[1]).to.contain({
        $listId: 1,
      });

      // select ... from items where item.listId = list.id
      sinon.assert.calledOnce(db.all);
      expect(db.all.firstCall.args[0]).to.have.string('select');
      expect(db.all.firstCall.args[1]).to.contain({
        $listId: 1,
      });
    });
  });
});
