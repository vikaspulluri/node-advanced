const schedule = require('node-schedule');

const a = schedule.scheduleJob('42 * * * *', () => {
  console.log('Job is triggered now');
});
