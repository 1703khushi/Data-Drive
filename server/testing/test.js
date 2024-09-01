import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server.js';

chai.use(chaiHttp);
chai.should();


// Some errors during manual testing
// The rest of the routes behave similarly

/**
 * Tests Authentication error on routes
 * The server code utilises same auth middleware
 * Without Authentication, no Route is accessible
*/
describe('GET /files', () => {
  it('should return "Invalid Token!"', (done) => {
    const params = {
        parent: '413423rfr3r34341414',
        parent_name: 'Rhythm',
      };
  
    const headers = {
      'authorization': 'Bearer ' + '312343423424244525',
    };
    chai.request(app)
      .get('/files')
      .query(params)
      .set(headers)
      .end((err, res) => {
        res = JSON.parse(res.text)
        res.should.have.status(401);
        res.error.should.equal(true)
        done();
      });
  });
});

/**
 * Tests when the parent folder id is invalid
 * Sometimes due to incorrect DB update, a record may change
 * Thus the code should notify the client about this possible error
*/
describe('GET /files', () => {
  it('should return "Invalid parent id!"', (done) => {
    const params = {
        parent: '413423rfr3r34341414',
        parent_name: 'Rhythm',
      };
  
    const headers = {
      'authorization': 'Bearer ' + "5d6c3da1-502a-4ac3-93af-24bd8de5590a"
      ,
    };
    chai.request(app)
      .get('/files')
      .query(params)
      .set(headers)
      .end((err, res) => {
        res = JSON.parse(res.text)
        res.should.have.status(402);
        done();
      });
  });
});

/**
 * Tests Invalidity of the bucket Name
 * With constant refresh of the Cloud storage and schema change
 * Information may loose. Hence the code should return error and
 * update the DB simoultaneouly when bucket Name is not found correct
*/
describe('POST /files', () => {
  it('should return "BucketName doesnt Exist!"', (done) => {
    const params = {
        parent: '',
      };
  
    const headers = {
      'authorization': 'Bearer ' + "5d6c3da1-502a-4ac3-93af-24bd8de5590a"
      ,
    };
    chai.request(app)
      .post('/files')
      .query(params)
      .attach('file','./upload_test.txt', 'file content')
      .set(headers)
      .end((err, res) => {
        res = JSON.parse(res.text)
        res.should.have.status(402);
        res.error.should.equal(true)
        res.message.should.equal('BucketName doesnt Exist')
        done();
      });
  });
});

/**
 * Tests if Upload is 0, then the code shoudl simply
 * return unauthorized to upload
 * Same checks have been implemented multiple routes and thus
 * its important to check for this case
*/
describe('POST /myshared', () => {
  it('should return "Unauthorized to Upload!"', (done) => {
    const params = {
        parent: '',
        Upload: 0,
        creater: 'ameykudaristudentsiiitacin',
      };
  
    const headers = {
      'authorization': 'Bearer ' + "5d6c3da1-502a-4ac3-93af-24bd8de5590a"
      ,
    };
    chai.request(app)
      .post('/myshared')
      .query(params)
      .attach('file','./upload_test.txt', 'file content')
      .set(headers)
      .end((err, res) => {
        res = JSON.parse(res.text)
        res.should.have.status(402);
        res.error.should.equal(true)
        res.message.should.equal('Unauthorized to Upload')
        done();
      });
  });
});

// The rest queries are similar in nature and thus didnt need testing

