var fetch = require('node-fetch')
var fs    = require('fs-extra')
var _     = require('lodash')
var $q    = require('q')

function median(data) {
  data = data.sort( function(a,b) {return a - b;} );

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

var chain = $q.when().then(() => []);
for (var i = 0; i < 212; i++) {
  let index = i
  chain = chain.then(x => {
    return fs.readJson(`./github-issue-template-data/bar.${index}.json`).then(obj => {

      // var comments_after = obj.issues_after.filter(x => x.labels.filter(y => y.name.search(/bug/i) >= 0).length > 0 && x.state ==="closed")
      // var comments_after = obj.issues_after.filter(x => x.labels.filter(y => y.name.search(/bug/i) >= 0).length > 0 && x.state !=="closed")
      var comments_after = obj.issues_after.filter(x => x.labels.filter(y => y.name.search(/bug/i) >= 0).length > 0)

      var after = comments_after.reduce((a, issue) => {
        return a + issue.comments
      }, 0) / comments_after.length

      // var comments_before = obj.issues_before.filter(x => x.labels.filter(y => y.name.search(/bug/i) >= 0).length > 0 && x.state ==="closed")
      // var comments_before = obj.issues_before.filter(x => x.labels.filter(y => y.name.search(/bug/i) >= 0).length > 0 && x.state !== "closed")
      var comments_before = obj.issues_before.filter(x => x.labels.filter(y => y.name.search(/bug/i) >= 0).length > 0)

      var before = comments_before.reduce((a, issue) => {
        return a + issue.comments
      }, 0) / comments_before.length 

      cmt_percentage = (after - before) / before * 100;

      if (after !== 0 && before !== 0 && cmt_percentage !== 0 && !isNaN(cmt_percentage)) {
        x.push(cmt_percentage)
      }
      return x
    })
  })
}

chain
  .then(x => {
    console.log(median(x))
    return x
  })
  .then(data => {
    return fs.writeJson('./comment-average.json', data)
  })
  // .then(x => console.log(median(x)))
