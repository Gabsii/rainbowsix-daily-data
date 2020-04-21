require('./db');
const Stat = require('./models/Stat')
require('./models/Operator') //necessary because Operator model isn't defined otherwise for the cross references
const sub = require('date-fns/sub');

const now = new Date();

const latestStats = Stat.findOne().sort({createdAt: -1}).populate('attackers').populate('defenders').exec((err, docs) => {
  if(err) throw err;
  console.log(docs.length);
  return docs;
});

const yesterdaysStats = Stat.find({createdAt: { $gte: sub(now, {days: 1}), $lte: now }}).sort({createdAt: -1}).populate('attackers').populate('defenders').exec((err, docs) => {
  if(err) throw err;
  console.log(docs.length);
  return docs[1];
})

const weeksStats = Stat.find({createdAt: { $gte: sub(now, {weeks: 1}), $lte: now }}).sort({createdAt: -1}).populate('attackers').populate('defenders').exec((err, docs) => {
  if(err) throw err;
  console.log(docs.length);
  return docs;
})

const monthsStats = Stat.find({createdAt: { $gte: sub(now, {months: 1}), $lte: now }}).sort({createdAt: -1}).populate('attackers').populate('defenders').exec((err, docs) => {
  if(err) throw err;
  console.log(docs.length);
  return docs;
});

module.exports = {
  latestStats,
  yesterdaysStats,
  weeksStats,
  monthsStats,
}