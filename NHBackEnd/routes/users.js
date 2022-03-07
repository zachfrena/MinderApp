var express = require('express')
var router = express.Router()
const db = require('../data/index')
let mysql = require('mysql')
let bodyparser = require('body-parser')
let app = express()
app.use(bodyparser.json())

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
  res.status(200);
});

router.post('/login', async function (req, res, next) {
  
  // Response values
  let resNum, status, user, message;
  console.log(req.body);
  // GET USER
  let sql = 'SELECT * FROM APPUSER WHERE Username = ?'
  const results = await db.promise().query(sql, [req.body.username])
  

  // User not found
  if(!results[0][0]){
    resNum = 200;
    status = "DENIED"
    message = "User not found";
    user = null;
  }
  // Password Incorrect
  else if(results[0][0].PWord != req.body.password){
    resNum = 200;
    status = "DENIED"
    message = "Password incorrect";
    user = null;
  }
  // Valid Username / Password
  else {
    resNum = 200;
    status = "APPROVED";
    message = "Welcome";
    user = results[0][0];

    // Check if patient
    let patientSQL = 'SELECT * FROM DEPENDENT WHERE PatientID = ?'
    const patientResults = await db.promise().query(patientSQL, [user.UID])
    if(patientResults[0][0]){
      user.role = "patient"
    }
    
    //if not patient check if caregiver
    else {
      let caregiverSQL = 'SELECT * FROM CAREGIVER WHERE CaregiverID = ?'
      const caregiverResults = await db.promise().query(caregiverSQL, [user.UID])
      if(caregiverResults[0][0]){
        user.role = "caregiver"
      }
    }
  }

  res.status(resNum).send({ status, user, message })
})

module.exports = router;
