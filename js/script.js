

// ------------------------------------- OBSERVER STRUCTURE ---------------------------------------- //

// SUBJECT BASE CLASS
// Controller will expand on this
function Subject () {
  this._observerList = [];
}

Subject.prototype.attachObserver = function(observer) {
  console.log(observer + ' is now an observer of Subject');
  this._observerList.push(observer);
};

Subject.prototype.detachObserver = function(observer) {
  var len = this._observerList.length;
  for (var i= 0; i<len; i++) {
    if (this._observerList[i] === observer) {
      this._observerList.splice(i,1);
      console.log(observer + ' is no longer an observer of Subject');
      return true;
    }
  }
  // else observer not in list
  return false;
};

Subject.prototype.updateObservers = function(args) {
  if(args === void 0) {
    args = {};
  }

  var len = this._observerList.length;
  for (var i= 0; i<len; i++) {
    this._observerList[i].update(args);
  }
};


// OBSERVER BASE CLASS
// Each component will expand on this base
function Observer() {}

Observer.prototype.toString = function() {
  return 'Observer';
};

Observer.prototype.update = function(args) {
  if(args === void 0) {
    args = {};
  }

  console.log('Generic Observer update called');
  console.log(JSON.stringify(args));
};


// ------------------------------------- IMPLEMENTATION ---------------------------------------------- //

// Controller will serve as the central point of contact, updating components
function Controller() {

  var subject = new Subject();

  this.attachObserver = function attachObserver(observer) {
    subject.attachObserver(observer);
  };

  this.detachObserver = function detachObserver(observer) {
    subject.detachObserver(observer);
  };

  this.updateObservers = function update(args) {
    if(args === void 0) {
      args = {};
    }
    subject.updateObservers(args);
  };
}

// Initialize Components
var controller = new Controller();
var summaryComponent = new Observer();
var listComponent = new Observer();
var storageComponent = new Observer();
var twitterComponent = new Observer();



// ------------------------------------- LIST FUNCTIONALITY ----------------------------------------- //

// ------------------------------------- LIST OBSERVER BEHAVIOR ------------------------------------- //

listComponent.unCompleted = [];
listComponent.completed = [];

// Item Class
// each item is an entry on the to-do list
function Item(content, completed){
  this.content = content;
  this.completed = completed;
  this.timeCreated = new Date();
  this.timeCompleted = null;
}


function addItem() {
  var inputField = document.getElementById('list_textbox');

  if(inputField.value == '') { return false; }

  var item = new Item(inputField.value, false);
  listComponent.unCompleted.push(item);


  // Add item to displayed list
  var listContainer = document.getElementById('list_todo');

  var itemDiv = document.createElement('div');
  addClass(itemDiv, 'item');

  var contentDiv = document.createElement('div');
  addClass(contentDiv, 'content');
  contentDiv.appendChild(document.createTextNode(item.content));

  itemDiv.appendChild(contentDiv);
  listContainer.insertBefore(itemDiv,listContainer.childNodes[0]);

  itemDiv.addEventListener('click', function() { selectItem(itemDiv); });
}

function selectItem(item) {
  toggleClass(item, 'selected');
}



// Observer functions
listComponent.toString = function() {
  return 'listComponent Observer';
};

listComponent.update = function(args) {
  if(args === void 0) {
    args = {};
  }
  console.log('listComponent Observer update called');
  console.log(JSON.stringify(args));
};




controller.attachObserver(summaryComponent);
controller.attachObserver(listComponent);
controller.updateObservers({'from': 'twitter'});


// ------------------------------------ GENERAL UTILITIES ------------------------------------ //

function addClass(element, className) {
  if(element.classList.contains(className)) {
    // console.log(className + ' already in classList');
  }
  else {
    element.classList.add(className);
  }
}

function removeClass(element, className) {
  if(element.classList.contains(className)) {
    element.classList.remove(className);
  }
  else {
    // console.log(className + ' not in classList');
  }
}

function toggleClass(element, className) {
  if(element.classList.contains(className)) {
    element.classList.remove(className);
  }
  else {
    element.classList.add(className);
  }
}
