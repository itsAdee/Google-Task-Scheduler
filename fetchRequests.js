const {google} = require('googleapis');

let cache = {};

async function fetchTasks(auth) {
  const service = google.tasks({version: 'v1', auth});
  const res = await service.tasklists.list();
  const taskLists = res.data.items;
  if (taskLists && taskLists.length) {
    for (const taskList of taskLists) {
      const tasksRes = await service.tasks.list({tasklist: taskList.id, showHidden: true});
      const tasks = tasksRes.data.items;
      if (tasks && tasks.length) {
        cache[taskList.title] = tasks;
      }
    }
  } else {
    throw new Error('No task lists found');
  }
  return cache;
}

module.exports = fetchTasks;