const {google} = require('googleapis');
const TASK_LIST_NAME = process.env.TASK_LIST_NAME;

let cache = {};

async function fetchTasks(auth) {
  const service = google.tasks({version: 'v1', auth});
  const res = await service.tasklists.list();
  const taskLists = res.data.items;
  if (taskLists && taskLists.length) {
    const taskList = taskLists.find(taskList => taskList.title === TASK_LIST_NAME);
    if (taskList) {
      const tasksRes = await service.tasks.list({tasklist: taskList.id, showHidden: true});
      const tasks = tasksRes.data.items;
      if (tasks && tasks.length) {
        cache = tasks;
      }
    }
  }
  return cache;
}

module.exports = fetchTasks;