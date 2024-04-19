const fs = require('fs');
const express = require('express');

const app = express();

// setting up the middleware
app.use(express.json()); //express.json() function is actually the middleware

// Routing
// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side', app: 'Natours' });
// });
// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

const events = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/events-simple.json`)
);

// The route handler, events is the ressource now
app.get('/api/v1/events', (req, res) => { //the callback function is called the route handeler
  res.status(200).json({ //JSEND formatting
    status: 'success', 
    results: events.length,
    data: {
      events  //ES6 good tip : <===> events: events
    }
  })
});
  
// Writing off a route that  get an event by on the id specified in the URL
app.get('/api/v1/events/:id', (req, res) => { //the callback function is called the route handeler
  console.log(req.params);

  // Retrieving the event with the wanted id
  const id = req.params.id * 1;
  const event = events.find(elt => elt.id === id);

  // if (id > events.length) {
  if (!event) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
  }

  res.status(200).json({ //JSEND formatting
    status: 'success', 
    results: events.length,
    data: {
      event  //ES6 good tip : <===> events: events
    }
  })
});

app.post('/api/v1/events', (req, res) => {
  // console.log(req.body);
  const newId = events[events.length - 1].id + 1;
  const newEvent = Object.assign({ id: newId, }, req.body);

  events.push(newEvent);
 
  // it would overwrite what it is already in there
  fs.writeFile(`${__dirname}/dev-data/data/events-simple.json`, JSON.stringify(events), err => {
    res.status(201).json(
      {
        status: 'success',
        data: {
          event: newEvent
        }
      }
    )
  });
})







const port = 3000;
// to start a server
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
