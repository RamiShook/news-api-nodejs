import authMiddleware from "../middleware/is-auth.js";
import jwt from "jsonwebtoken";

import sinon from "sinon";
import chai from "chai";
const expect = chai.expect;

describe("Auth middleware", function () {
  it("should throw an error if no authorization header is present", function () {
    const req = {
      get: function (headerName) {
        return null;
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "Not authenticated."
    );
  });

  it("should throw an error if the token cannot be verified", function () {
    const req = {
      get: function () {
        return "xyz";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("should yield an userId after decoding the token", function () {
    const req = {
      get: function () {
        return "xyz";
      },
    };
    sinon.stub(jwt, "verify"); // register a empty function
    jwt.verify.returns({ userId: "abc" });
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("userId");
    expect(jwt.verify.called).to.be.true; // true because we called in authMiddleware
    jwt.verify.restore();
  });
});
