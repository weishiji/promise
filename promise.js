/*
function Promise(tasks){
  this.taskArr = tasks;
  this.status = 'success';
  this.task;
  this.doAction()
}
Promise.prototype.doAction = function(){
  if(this.status === 'success'){
    this.task = this.taskArr.splice(0,1)[0]
    this.status = 'pending';
    this.doAction();
    return;
  }
  
  var _this = this;
  if(typeof this.task === 'function'){
    this.task.call(this,function(param){
      console.log(param)
      _this.status = 'success'
      _this.doAction();
    })
  }
}
*/
var Promise = (function(){
  var allTasks;//缓存所有的任务
  var taskIndex;//调用then函数的时候，执行task里的任务下标
  var _private;
  //私有函数
  var privateFun = (function(){
    var __this = this;
    var task;
    return {
      isFun : function(fun){
        return typeof fun === 'function' && fun instanceof Function;
      }
      ,doAction : function(){
        if(__this.statusStr === 'success'){
          task = __this.tasksArr.splice(0,1)[0];
          __this.statusStr = 'pending';
          _private.nextAction();
        }

      }
      ,taskCallback : function(param){
        __this.count++;
        __this.statusStr = 'success';
        console.log(param,'this is param')
        setTimeout(function(){
          _private.doAction();  
        },0)
      }
      ,nextAction : function(){
        if(_private.isFun(task)){
          task.call(this,_private.taskCallback)
        }
      }
    }
  });

  function P(){
    this.tasksArr = [];
    this.statusStr = 'success' // success | pending | wating
    this.count = 0;
    this.isStart = false;
  }
  P.prototype.all = function(arr){
    for(var i=0;i<arr.length;i+=1){
      var temp = arr[i];
      if(_private.isFun(temp)){
        this.tasksArr.push(temp);
      }
    }
    return this;
  }
  P.prototype.when = function(fun){
    if(_private.isFun(fun)){
      this.tasksArr.push(fun);
    }
    return this;
  }
  P.prototype.then = function(fun){
    console.log(this.tasksArr.length)
    setTimeout(function(){
      if(!this.isStart) _private.doAction();  
      this.isStart = true;
    }.bind(this),0)
    return this;
  }
  return function(){
    allTasks = [];
    taskIndex = 0;

    var p = new P();
    _private = privateFun.call(p)
    return p;
  }
}())



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
var p = Promise();
p.all([test(1),test(2),test1,test(3)]).then(function(){

}).when(test(4)).when(test(5)).then()





  //.then()
//new Promise([test(1),test(2),test(3),test(4)]);
