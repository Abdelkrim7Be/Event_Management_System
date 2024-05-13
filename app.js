const fs = require('fs');
const express = require('express');

const app = express();

// setting up the middleware
app.use(express.json()); //express.json() function is actually the middleware

const events = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/events-simple.json`)
);

// #################### Handeler functions #############################
const getAllEvents = (req, res) => {
  //the callback function is called the route handeler
  res.status(200).json({
    //JSEND formatting
    status: 'success',
    results: events.length,
    data: {
      events, //ES6 good tip : <===> events: events
    },
  });
};

const getEvent = (req, res) => {
  //the callback function is called the route handeler
  console.log(req.params);

  // Retrieving the event with the wanted id
  const id = req.params.id * 1;
  const event = events.find((elt) => elt.id === id);

  // if (id > events.length) {
  if (!event) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    //JSEND formatting
    status: 'success',
    results: events.length,
    data: {
      event, //ES6 good tip : <===> events: events
    },
  });
};

const createEvent = (req, res) => {
  // console.log(req.body);
  const newId = events[events.length - 1].id + 1;
  const newEvent = Object.assign({ id: newId }, req.body);

  events.push(newEvent);

  // it would overwrite what it is already in there
  fs.writeFile(
    `${__dirname}/dev-data/data/events-simple.json`,
    JSON.stringify(events),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          event: newEvent,
        },
      });
    }
  );
};

const updateEvent = (req, res) => {
  if (req.params.id * 1 > events.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      event: '<Updated event here>....',
    },
  });
};

const deleteEvent = (req, res) => {
  if (req.params.id * 1 > events.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
// ######################################################################

// Routes 

// app.get('/api/v1/events', getAllEvents);
// app.get('/api/v1/events/:id', getEvent);
// app.post('/api/v1/events', createEvent);
// app.patch('/api/v1/events/:id', updateEvent);
// app.delete('/api/v1/events/:id', deleteEvent);

app.route('/api/v1/events').get(getAllEvents).post(createEvent);
app
  .route('/api/v1/events/:id')
  .get(getEvent)
  .patch(updateEvent)
  .delete(deleteEvent);

const port = 3000;
// to start a server
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
