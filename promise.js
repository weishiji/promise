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
        //拍断有多个then函数的时候，每次只执行then之前的任务
        if(__this.count === __this.thenIndex[0]){
          __this.thenIndex.splice(0,1);
          __this.thenIndex.length === 0 ? __this.statusStr = 'pending' : __this.statusStr = 'success';
          _private.thenCallback();
        }
        
        console.log(__this.count,__this.thenIndex,param,'this is param')
        setTimeout(function(){
          _private.doAction();  
        },0)
      }
      ,thenCallback : function(){
        var thenFun = __this.thenArr.splice(0,1)[0];
        thenFun.call(this,123)
      }
      ,nextAction : function(){
        if(_private.isFun(task)){
          task.call(this,_private.taskCallback);
        }
      }
    }
  });

  function P(){
    this.tasksArr = [];
    this.thenIndex = [];
    this.thenArr = [];
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
    this.thenIndex.push(this.tasksArr.length)
    if(_private.isFun(fun)){
      this.thenArr.push(fun);
    }

    setTimeout(function(){
      if(!this.isStart) _private.doAction();  
      this.isStart = true;
    }.bind(this),0)
    return this;
  }
  return function(){
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
p.all([test1,test(2),test1,test(3)]).when(test('111')).then(function(data){
  console.log(data)
}).when(test(4)).when(test(5))//.then()





  //.then()
//new Promise([test(1),test(2),test(3),test(4)]);
