const Pool = require('pg').Pool
require("dotenv").config();

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
  });


const query1=process.env.QUERY1;
const query2=process.env.QUERY2;
const query3=process.env.QUERY3;
const query4=process.env.QUERY4;
const query5=process.env.QUERY5;

const getBug = (req, res) => {
  pool.query(query1, (err, result) => {
    if (err) {
      throw err
    }
    res.send(result.rows);
  })
}


const getBugById = (req, res) => {
  const id = parseInt(req.params.id)
  const sum=req.params.id;
  const des=req.params.id;
  console.log("connected");

  pool.query(query2 , [id,sum,des], (err, result) => {
    if (err) {
      throw err
    }
    
    res.send(result.rows);
  })
}

const createBug = (req, res) => {
    var cope = req.body;
    console.log(cope);

  pool.query(query3,[cope.bug,cope.assign,cope.report,cope.summary,cope.product,cope.comp,cope.os,cope.hard,cope.version,cope.prior,cope.severity,cope.key,cope.changed,cope.opened,cope.desc], (err, result) => {
    if (err) {
      throw err
    }
    res.send(`Entry successfully stored with ID: ${cope.bug}`);
  })
}

      
const updateBug = (req, res) => {
  const id = parseInt(req.params.id);
  const {bugid,assign,report,summary,product,comp,os,hard,version,prior,severity,key,changed,opened,desc}=req.body;

  pool.query(query5, [assign,report,summary,product,comp,os,hard,version,prior,severity,key,changed,opened,desc,bugid],
    (err, result) => {
      if (err) {
        throw err
      }
      res.send(`Entry modified with ID: ${id}`);
    }
  )
}
    
const deleteBug = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(query4, [id], (err, result) => {
    if (err) {
      throw err
    }
    res.send(`Entry deleted with ID: ${id}`);
  })
}

module.exports = {
  getBug,
  getBugById,
  createBug,
  updateBug,
  deleteBug,
}