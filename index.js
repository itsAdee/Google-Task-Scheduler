require('dotenv').config();
const authorize = require('./Googleauth');
const fetchTasks = require('./fetchRequests');

authorize()
  .then(fetchTasks)
  .then(tasks => {
    console.log(`Tasks in ${process.env.TASK_LIST_NAME}:`);
    tasks.forEach((task) => {
      console.log(task); // Log the entire task object
    });
  })
  .catch(console.error);