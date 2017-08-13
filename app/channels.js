var Promise = require("es6-promise").Promise;
var groupArray = require('group-array');

function channels() {

  var getAllChannels = function () {
    var deferred = new Promise(function (resolve, reject) {
      try {
        var allChannels = require('./data/channels');
        if(allChannels) {
          resolve(allChannels.map(function(channel) {
            var data = JSON.parse(JSON.stringify(channel));
            var dateTime = data.time.split(' ');
            // Reflect.deleteProperty(data, 'time');
            data.time = parseInt(dateTime[1].split(':').join(''))/100;

            var dateArr = dateTime[0].split('-').map(function(val) {
              return parseInt(val);
            });
            data.date = new Date(dateArr[0],dateArr[1]-1,dateArr[2],6,0,0,0).getTime();
            
            return data;
          }));
        } else {
          reject("Error obtaining channel data");
        }
      } catch(error) {
        reject(error);
      }
    });
    return deferred;
  };

  this.getAllChannels = function () {
    return getAllChannels();
  };

  this.getAllChannelsGroupedByDate = function () {
    var deferred = new Promise(function (resolve, reject) {
      getAllChannels().then(
        function(channels) {
          var sortedChannels = channels.sort(function(a,b) {
            return a.date - b.date;
          });
          var groupedChannels = groupArray(sortedChannels,'date');
          var returnData = {
            groupKey: 'date',
            groups: []
          };
          Object.keys(groupedChannels).forEach(function(group,index) {
            var groupedData = {
              group
            };
            groupedData.channels = groupedChannels[group].sort(function(a,b) {
              return a.time - b.time;
            });
            returnData.groups.push(groupedData);
          });

          resolve(returnData);
        },
        reject);
    });
    return deferred;
  };
}

module.exports = channels;
