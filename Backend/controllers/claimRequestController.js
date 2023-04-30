const MyData = require('../models/claimRequestModel');

exports.getData = function(req, res) {
  MyData.find()
  .then((data) => {
    res.status(200).json(data);
  })
  .catch((err) => {
    res.status(400).send('Error retrieving data');
  });
};

exports.addData = function(req, res) {
  const myData = new MyData(req.body);
  myData
    .save()
    .then(myData => {
      res.status(200).json({ myData: 'Data added successfully' });
    })
    .catch(err => {
      res.status(400).send('Adding new data failed');
    });
};

exports.updateData = function(req, res) {
  MyData.findById(req.params.id, (err, myData) => {
    if (!myData) {
      res.status(404).send('Data not found');
    } else {
      myData.name = req.body.name;
      myData.age = req.body.age;
      myData.email = req.body.email;

      myData
        .save()
        .then(myData => {
          res.json('Data updated successfully');
        })
        .catch(err => {
          res.status(400).send('Data update failed');
        });
    }
  });
};

exports.deleteData = function(req, res) {
  MyData.findByIdAndRemove(req.params.id)
    .exec()
    .then((myData) => {
      if (!myData) {
        res.status(404).send('Data not found');
      } else {
        res.json('Data deleted successfully');
      }
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
};
