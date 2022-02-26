const { assert } = require('chai');

const { fetchUserInformation } = require('../helpers/userHelper.js');

const testUsers = {
  "random1": {
    id: "random1",
    email: "user@test.com",
    password: "testing"
  },
  "testID": {
    id: "testID",
    email: "user2@test.com",
    password: "testing-2"
  }
};

describe('Testing fetchUserInformation Function: ', function() {
  it('It should return a valid user email based on userID', function() {
    const user = fetchUserInformation(testUsers, "testID")
    const expectedUserEmail = "user2@test.com";
    // Write your assert statement here
    assert.deepEqual(user.email, expectedUserEmail);
  });

  it('It should return undefined for an invalid user email', function() {
    const user = fetchUserInformation(testUsers, "invalidID")
    const expectedUserEmail = undefined;
    // Write your assert statement here
    assert.deepEqual(user.email, expectedUserEmail);
  });
});