function reduceAddsources(p, v) {
  if (v.trusted_sources[0] === "") return p;    // skip empty values
  v.trusted_sources.forEach (function(val, idx) {
     p[val] = (p[val] || 0) + 1; //increment counts
  });
  return p;
}

function reduceRemovesources(p, v) {
  if (v.trusted_sources[0] === "") return p;    // skip empty values
  v.trusted_sources.forEach (function(val, idx) {
     p[val] = (p[val] || 0) - 1; //decrement counts
  });
  return p;
   
}


function reduceAddnosources(p, v) {
  if (v.untrusted_sources[0] === "") return p;    // skip empty values
  v.untrusted_sources.forEach (function(val, idx) {
     p[val] = (p[val] || 0) + 1; //increment counts
  });
  return p;
}

function reduceRemovenosources(p, v) {
  if (v.untrusted_sources[0] === "") return p;    // skip empty values
  v.untrusted_sources.forEach (function(val, idx) {
     p[val] = (p[val] || 0) - 1; //decrement counts
  });
  return p;
   
}

function reduceAddunhcrchannels(p, v) {
  if (v.unhcr_channel[0] === "") return p;    // skip empty values
  v.unhcr_channel.forEach (function(val, idx) {
     p[val] = (p[val] || 0) + 1; //increment counts
  });
  return p;
}

function reduceRemoveunhcrchannels(p, v) {
  if (v.unhcr_channel[0] === "") return p;    // skip empty values
  v.unhcr_channel.forEach (function(val, idx) {
     p[val] = (p[val] || 0) - 1; //decrement counts
  });
  return p;
   
}

function reduceAddfamily(p, v) {
  if (v.family_information_channel[0] === "") return p;    // skip empty values
  v.family_information_channel.forEach (function(val, idx) {
     p[val] = (p[val] || 0) + 1; //increment counts
  });
  return p;
}

function reduceRemovefamily(p, v) {
  if (v.family_information_channel[0] === "") return p;    // skip empty values
  v.family_information_channel.forEach (function(val, idx) {
     p[val] = (p[val] || 0) - 1; //decrement counts
  });
  return p;
   
}
function reduceInitial() {
  return {};  
}

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
        if(attrValue.length>1 || attrName == "untrusted_sources" || attrName == "unhcr_channel" || attrName == "family_information_channel"){
          dict[attrName] = attrValue;
        }
        else{
          dict[attrName] = obj[key];
        }

        if(attrName == "age"){
          if (attrValue >0 && attrValue < 5) {
              dict[attrName] = "0-5";
          } else if (attrValue > 5 && attrValue < 12) {
              dict[attrName] = "6-12";
          } 
          else if (attrValue > 12 && attrValue < 18) {
              dict[attrName] = "13-18";
          } 
          else if (attrValue > 18 && attrValue < 55) {
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


var cf = crossfilter(data);

//Request num 1 GENDER


var gender = cf.dimension(function(d){ return d.gender;});
var genderGroup = gender.group();

var pie = dc.pieChart("#genderchart");
pie.width(200).height(200).dimension(gender).group(genderGroup).innerRadius(50);


//Request num 2 AGE
var age = cf.dimension(function(d){ return d.age;});
var ageGroup = age.group();

var pieageChart = dc.pieChart("#agechart");
pieageChart.height(200).width(200).dimension(age).group(ageGroup);

//Request num 3 NATIONALITY
var nationality = cf.dimension(function(d){ return d.nationality_background;});
var nationalityGroup = nationality.group();

var pienatChart = dc.pieChart("#nationalitychart");
pienatChart.height(200).width(200).dimension(nationality).group(nationalityGroup);

//Request num 3 NUMBER OF ENTRIES
document.getElementById("numofentries").innerHTML+= data.length;
//Request num 4 information satisfaction percentage
var infosatisf = cf.dimension(function(d){ return d.info_satisfaction;});
var infosatisfGroup = infosatisf.group();

var infosatChart = dc.pieChart("#infosatisfchart");
infosatChart.height(200).width(200).dimension(infosatisf).group(infosatisfGroup).innerRadius(50);

//Request num 5 Trusted Information Sources

var sourcesDim = cf.dimension(function(d){ return d.trusted_sources;});
console.log(sourcesDim);
var sourcesGroup = sourcesDim.groupAll().reduce(reduceAddsources, reduceRemovesources, reduceInitial).value();
// hack to make dc.js charts work
sourcesGroup.all = function() {
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


sourcesGroup.top = function(count) {
    var newObject = this.all();
     newObject.sort(function(a, b){return b.value - a.value});
    return newObject.slice(0, count);
};


var barChart = dc.rowChart("#trustchart");
    
barChart
    .renderLabel(true)
    .height(200)
    .dimension(sourcesDim)
    .group(sourcesGroup)
    .cap(sourcesGroup.length)
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



//Request num 7 Least Trusted Information Sources
var nosourcesDim = cf.dimension(function(d){ return d.untrusted_sources;});
var nosourcesGroup = nosourcesDim.groupAll().reduce(reduceAddnosources, reduceRemovenosources, reduceInitial).value();
// hack to make dc.js charts work
nosourcesGroup.all = function() {
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


nosourcesGroup.top = function(count) {
    var newObject = this.all();
     newObject.sort(function(a, b){return b.value - a.value});
    return newObject.slice(0, count);
};




var nosourcesChart = dc.rowChart("#notrustchart");
    
nosourcesChart
    .renderLabel(true)
    .height(200)
    .dimension(nosourcesDim)
    .group(nosourcesGroup)
    .cap(nosourcesGroup.length)
    .ordering(function(d){return -d.value;})
    .xAxis().ticks(3);

nosourcesChart.filterHandler (function (dimension, filters) {
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

//Request num 8 UNHCR COMMUNICATION 
var unhcrchannelsDim = cf.dimension(function(d){ return d.unhcr_channel;});
var unhcrchannelsGroup = nosourcesDim.groupAll().reduce(reduceAddunhcrchannels, reduceRemoveunhcrchannels, reduceInitial).value();
// hack to make dc.js charts work
unhcrchannelsGroup.all = function() {
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


unhcrchannelsGroup.top = function(count) {
    var newObject = this.all();
     newObject.sort(function(a, b){return b.value - a.value});
    return newObject.slice(0, count);
};




var unhcrchannelsChart = dc.rowChart("#unhcrchart");
    
unhcrchannelsChart
    .renderLabel(true)
    .height(200)
    .dimension(unhcrchannelsDim)
    .group(unhcrchannelsGroup)
    .cap(unhcrchannelsGroup.length)
    .ordering(function(d){return -d.value;})
    .xAxis().ticks(3);

unhcrchannelsChart.filterHandler (function (dimension, filters) {
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

//Request num 9 Literacy
var literacy = cf.dimension(function(d){ return d.literacy_1;});
var literacyGroup = literacy.group();

var literacyChart = dc.pieChart("#literacychart");
literacyChart.height(200).width(200).dimension(literacy).group(literacyGroup);


//Request num 10 Family Information Channel 
var familychannelsDim = cf.dimension(function(d){ return d.family_information_channel;});
var familychannelsGroup = nosourcesDim.groupAll().reduce(reduceAddfamily, reduceRemovefamily, reduceInitial).value();
// hack to make dc.js charts work
familychannelsGroup.all = function() {
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


familychannelsGroup.top = function(count) {
    var newObject = this.all();
     newObject.sort(function(a, b){return b.value - a.value});
    return newObject.slice(0, count);
};




var familychannelsChart = dc.rowChart("#familychart");
    
familychannelsChart
    .renderLabel(true)
    .height(200)
    .dimension(familychannelsDim)
    .group(familychannelsGroup)
    .cap(familychannelsGroup.length)
    .ordering(function(d){return -d.value;})
    .xAxis().ticks(3);

familychannelsChart.filterHandler (function (dimension, filters) {
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


dc.renderAll();

