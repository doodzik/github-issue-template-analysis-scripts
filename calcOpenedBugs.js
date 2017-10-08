var fetch = require('node-fetch')
var fs    = require('fs-extra')
var _     = require('lodash')
var $q    = require('q')
var jStat = require('jstat')

function median(data) {
  // values.sort( function(a,b) {return a - b;} );
  // var half = Math.floor(values.length/2);
  // if(values.length % 2)
  //     return values[half];
  // else
  //     return (values[half-1] + values[half]) / 2.0;
  // fs.writeJson(`./barYY.json`, data, {spaces: 2})

  data = data.sort( function(a,b) {return a - b;} );

  var l = data.length;
  var low = Math.round(l * 0.025);
  var high = l - low;
  var data2 = data.slice(low,high);

  var sum=0;     // stores sum of elements
  var sumsq = 0; // stores sum of squares
  for(var i=0;i<data.length;++i) {
    sum+=data[i];
    sumsq+=data[i]*data[i];
  }


  var mean = sum/l; 
  var varience = sumsq / l - mean*mean;
  var sd = Math.sqrt(varience);
  var data3 = new Array(); // uses for data which is 3 standard deviations from the mean
  for(var i=0;i<data.length;++i) {
    if(data[i]> mean - 3 *sd && data[i] < mean + 3 *sd)
      data3.push(data[i]);
  } 

  var total = 0;
  for(var i = 0; i < data2.length; i++) {
    total += data2[i];
  }
  return total / data2.length;
} 

var chain = $q.when().then(() => []);
for (var i = 0; i < 212; i++) {
  let index = i
  chain = chain.then(x => {
    // return fs.readJson(`./barYY.json`)
    return fs.readJson(`./github-issue-template-data/bar.${index}.json`).then(obj => {
      let after = obj.issues_after.filter(x => x.labels.filter(y => y.name.search(/bug/i) >= 0)).length
      let before = obj.issues_before.filter(x => x.labels.filter(y => y.name.search(/bug/i) >= 0)).length

      let issues_percentage = (after - before) / before * 100;
      if (after !== 0 && before !== 0 && issues_percentage !== 0) {
        // console.log(after, before, issues_percentage)
        x.push(issues_percentage)
      }
      return x
    })
  })
}
chain.then(x => {
  // let l = x.filter(y => y < 0)
  // let ll = l.reduce((a,b) => { return a + b}, 0)
  // console.log('+', ll / l.length)
  return x
  // console.log('-', x.length - l)
})
.then(data => {
  return fs.writeJson('./opend-issues.json', data).then(() => data)
})
chain.then(x => console.log(median(x)))

