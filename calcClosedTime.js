var fetch = require('node-fetch')
var fs    = require('fs-extra')
var _     = require('lodash')
var $q    = require('q')

function median(data) {
  data = data.sort( function(a,b) {return a - b;} );
  // var half = Math.floor(data.length/2);
  // if(data.length % 2)
  //     return data[half];
  // else
  //     return (data[half-1] + data[half]) / 2.0;

  var l = data.length;
  var low = Math.round(l * 0.025);
  var high = l - low;
  var data2 = data.slice(low,high);

  var total = 0;
  for(var i = 0; i < data2.length; i++) {
    total += data2[i];
  }
  return total / data2.length;
}

function addMonths (date, x) {
  var CurrentDate = new Date(date);
  CurrentDate.setMonth(CurrentDate.getMonth() + x);
  return CurrentDate
}

function dateInMonths(x) {
  if(x.state ==="closed") {
    let createDate = addMonths(x.created_at, 5)
    let closeDate  = new Date(x.closed_at)
    return createDate >= closeDate
  }
  return false
}

var chain = $q.when().then(() => []);
for (var i = 0; i < 212; i++) {
  let index = i
  chain = chain.then(x => {
    return fs.readJson(`./github-issue-template-data/bar.${index}.json`).then(obj => {
        var iafter = obj.issues_after.filter(xx => {
          return dateInMonths(xx) && xx.labels.filter(y => y.name.search(/bug/i) >= 0).length > 0
        })

        var ibefore = obj.issues_before.filter(xx => {
          return dateInMonths(xx) && xx.labels.filter(y => y.name.search(/bug/i) >= 0).length > 0
        })

        if (iafter.length == 0 || ibefore.length == 0) {
          return x
        }

        let before = median(ibefore.map((xxx) => {
          let createDate = new Date(xxx.created_at).getTime()
          let closeDate  = new Date(xxx.closed_at).getTime()
          return (closeDate - createDate)
        }))

        let after = median(iafter.map((xxx) => {
          let createDate = new Date(xxx.created_at).getTime()
          let closeDate  = new Date(xxx.closed_at).getTime()
          return (closeDate - createDate)
        }))
        
        let cmt_percentage = (after - before) / before * 100;
        console.log(index)

      if (after !== 0 && before !== 0 && cmt_percentage !== 0 && !isNaN(cmt_percentage)) {
        x.push(cmt_percentage)
      }
      return x
    }).catch(x => console.log(x))
  })
}
chain
  .then(data => {
    return fs.writeJson('./closed-bugs-time.json', data).then(() => data)
  })
  .then(x => console.log(median(x), x.length))

