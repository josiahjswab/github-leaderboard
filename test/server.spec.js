const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const app = require('../server/server');

var mock = [];

describe("server module", function() {
  this.timeout(6500);
  beforeEach(() => {
    mock = [];
  });

  it("GET /data", (done) => {
		chai.request(app)
  		.get('/data')
  		.end((err, res) => {
  			expect(res).to.have.status(200);
  			expect(err).to.be.null;
  			expect(res).to.be.json;
  			expect(res.body.status).to.be.string;
  			done();
  		})
  });

  it("GET /data should return two dimentional array", (done) => {
		chai.request(app)
  		.get('/data')
  		.end((err, res) => {
        console.log(res.body);
  			expect(res.body.length).to.equal(2);
  			expect(res.body[0].length).to.equal(3);
  			expect(res.body[1].length).to.equal(3);
  			done();
  		})
	});
});
