/*function reduceAddtopics(p, v) {
  if (v.topics[0] === "") return p;    // skip empty values
  v.topics.forEach (function(val, idx) {
     p[val] = (p[val] || 0) + 1; //increment counts
  });
  return p;
}

function reduceRemovetopics(p, v) {
  if (v.topics[0] === "") return p;    // skip empty values
  v.topics.forEach (function(val, idx) {
     p[val] = (p[val] || 0) - 1; //decrement counts
  });
  return p;
   
}
function reduceAddchannels(p, v) {
  if (v.channels[0] === "") return p;    // skip empty values
  v.channels.forEach (function(val, idx) {
     p[val] = (p[val] || 0) + 1; //increment counts
  });
  return p;
}

function reduceRemovechannels(p, v) {
  if (v.channels[0] === "") return p;    // skip empty values
  v.channels.forEach (function(val, idx) {
     p[val] = (p[val] || 0) - 1; //decrement counts
  });
  return p;
   
}
function reduceInitial() {
  return {};  
}*/

//parse json file and format into var data example
/*var data = [
    {"key":"0-10","tags":["skype", "facebook"], "date":new Date("10/02/2012"),"age":"20"},
    {"key":"10-20","tags":["skype"], "date": new Date("10/05/2012"),"age":"22"},
    {"key":"0-10","tags":["facebook", "whatsapp"], "date":new Date("10/08/2012"),"age":"40"}];
*/

var jsonData = $.ajax({
          url: "https://kobocat.unhcr.org/warnes/forms/InfoComms/api",
          dataType: "json",
          async: false
          }).responseText;

var data = [];
var json = JSON.parse(jsonData);
//change json to data format
for (var i = 0; i < json.length; i++){
    var obj = json[i];
    var dict = {};
    for (var key in obj){
        var attrName = (key.split("/"))[1];
      /*  if(attrName == "channels_befor" || attrName=="messing_apps"|| attrName=="family_information_channel"|| attrName=="friends_family"|| attrName=="information_sharing_channel"){

        }
      */
        var attrValue = ((obj[key]).toString()).split(" ");
        if(attrValue.length>1){
          dict[attrName] = attrValue;
        }
        else{
          dict[attrName] = obj[key];
        }

        if(attrName == "age"){
          if (attrValue < 5) {
              dict[attrName] = "0-5";
          } else if (attrValue < 12) {
              dict[attrName] = "6-12";
          } 
          else if (attrValue < 18) {
              dict[attrName] = "13-18";
          } 
          else if (attrValue < 55) {
              dict[attrName] = "19-55";
          } 

          else {
              dict[attrName] = "55+";
          }
        }
    }
    data.push(dict);
}
console.log(data);


//Request num 1 GENDER


var cf = crossfilter(data);


var gender = cf.dimension(function(d){ return d.gender;});
var genderGroup = gender.group();

var pieChart = dc.pieChart("#genderchart");
pieChart.height(300).width(300).dimension(gender).group(genderGroup);

//Request num 2
var age = cf.dimension(function(d){ return d.age;});
var ageGroup = age.group();

var pieageChart = dc.pieChart("#agechart");
pieageChart.height(300).width(300).dimension(age).group(ageGroup);
/*var topicsDim = cf.dimension(function(d){ return d.topics;});
console.log(topicsDim);
var topicsGroup = topicsDim.groupAll().reduce(reduceAddtopics, reduceRemovetopics, reduceInitial).value();
// hack to make dc.js charts work
topicsGroup.all = function() {
  var newObject = [];
  for (var key in this) {
    if (this.hasOwnProperty(key) && key != "all" && key != "top") {
      newObject.push({
        key: key,
        value: this[key]
      });
    }
  }
  return newObject;
};


topicsGroup.top = function(count) {
    var newObject = this.all();
     newObject.sort(function(a, b){return b.value - a.value});
    return newObject.slice(0, count);
};

var channelsDim = cf.dimension(function(d){ return d.channels;});
var channelsGroup = topicsDim.groupAll().reduce(reduceAddchannels, reduceRemovechannels, reduceInitial).value();
// hack to make dc.js charts work
channelsGroup.all = function() {
  var newObject = [];
  for (var key in this) {
    if (this.hasOwnProperty(key) && key != "all" && key != "top") {
      newObject.push({
        key: key,
        value: this[key]
      });
    }
  }
  return newObject;
};


channelsGroup.top = function(count) {
    var newObject = this.all();
     newObject.sort(function(a, b){return b.value - a.value});
    return newObject.slice(0, count);
};





var barChart = dc.rowChart("#chart");
    
barChart
    .renderLabel(true)
    .height(200)
    .dimension(topicsDim)
    .group(topicsGroup)
    .cap(2)
    .ordering(function(d){return -d.value;})
    .xAxis().ticks(3);

barChart.filterHandler (function (dimension, filters) {
       dimension.filter(null);   
        if (filters.length === 0)
            dimension.filter(null);
        else
            dimension.filterFunction(function (d) {
                for (var i=0; i < d.length; i++) {
                    if (filters.indexOf(d[i]) >= 0) return true;
                }
                return false;
            });
    return filters; 
    }
);

var channelsChart = dc.rowChart("#chart3");
    
channelsChart
    .renderLabel(true)
    .height(200)
    .dimension(channelsDim)
    .group(channelsGroup)
    .cap(2)
    .ordering(function(d){return -d.value;})
    .xAxis().ticks(3);

channelsChart.filterHandler (function (dimension, filters) {
       dimension.filter(null);   
        if (filters.length === 0)
            dimension.filter(null);
        else
            dimension.filterFunction(function (d) {
                for (var i=0; i < d.length; i++) {
                    if (filters.indexOf(d[i]) >= 0) return true;
                }
                return false;
            });
    return filters; 
    }
);  */

dc.renderAll();

