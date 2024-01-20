//Imports the Google Cloud client library
const {google} = require('googleapis');

//Creates a cache for the tasks
let cache = {};

//Fetches the tasks from the Google Tasks API and stores them in the cache
async function fetchTasks(auth) {
  //Creates a new Google Tasks client
  const service = google.tasks({version: 'v1', auth});
  //Gets the task lists from the Google Tasks API
  const res = await service.tasklists.list();
  //Gets the task lists from the response
  const taskLists = res.data.items;
  if (taskLists && taskLists.length) {
    //Iterates through the task lists
    for (const taskList of taskLists) {
      //Gets the tasks from the Google Tasks API
      const tasksRes = await service.tasks.list({tasklist: taskList.id, showHidden: true});
      //Gets the tasks from the response
      const tasks = tasksRes.data.items;
      if (tasks && tasks.length) {
        //Adds the tasks to the cache by task list name as the key and the tasks as the value
        cache[taskList.title] = tasks;
      }
    }
  } else {
    //Throws an error if no task lists are found
    throw new Error('No task lists found');
  }
  //Returns the cache
  return cache;
}

//Exports the fetchTasks function
module.exports = fetchTasks;