var p = require('promise')();
var rdom = function() { //随机time
  return Math.random() * 1000;
}
var test = function(param){
  return function(cb){
    setTimeout(function(){
        cb(param);
    },rdom());
  }
}
var test1 = function(cb){
  cb('hello world')
}
p.all([test1,test(2),test1,test(3)]).when(test('111')).then(function(data){
  console.log(data)
}).when(test(4)).when(test(5))//.then()
