import User from "../models/user.js";
import * as authController from "../controllers/auth.js";

import sinon from "sinon";
import chai from "chai";
const expect = chai.expect;

describe("Auth Controller - Login", function () {
  it("should throws an error with code 500 if accessing the database fails", function (done) {
    sinon.stub(User, "findOne");
    User.findOne.throws();
    const req = {
      body: {
        email: "test@test.com",
        password: "tester",
      },
    };

    authController
      .login(req, {}, () => {})
      .then((result) => {
        expect(result).to.be.an("error");
        expect(result).to.have.property("statusCode", 500);
        done(); // wait the async call
      });
    User.findOne.restore();
  });
});
