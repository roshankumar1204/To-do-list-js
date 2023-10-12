
module.exports= getDate;

function getDate(){
   
var today = new Date();
var option={
weekday: 'long',
day: 'numeric',
month: 'long',
};

var date = today.toLocaleDateString("en-US",option);
return date;
}