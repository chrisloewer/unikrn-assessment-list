

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
  return 'Basic Observer';
};

Observer.prototype.update = function(args) {
  if(args === void 0) {
    args = {};
  }

  console.log('Generic Observer update called');
  // console.log(JSON.stringify(args));
};


// -------------------------------------  OBSERVER IMPLEMENTATION ------------------------------------- //

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

// ------------------------------------- INITIALIZE PAGE -------------------------------------------- //

var controller = new Controller();
var summaryComponent = new Observer();
var listComponent = new Observer();
var storageComponent = new Observer();
var twitterComponent = new Observer();

window.onload = function() {


  controller.attachObserver(summaryComponent);
  controller.attachObserver(listComponent);
  controller.attachObserver(twitterComponent);
  controller.attachObserver(storageComponent);

  // get stored data, if any exists, otherwise load as normal
  if( !storageComponent.updateController() ) {
    controller.updateObservers();
  }
};


// ------------------------------------- LIST COMPONENT BEHAVIOR ------------------------------------ //

(function () {

  // Initialize
  listComponent.unCompleted = [];
  listComponent.completed = [];
  listComponent.selected = [];

  function init() {
    document.getElementById('add_button').addEventListener('click', addItem);
    document.getElementById('complete_button').addEventListener('click', completeItems);
  }


  // Item Class
  // each item is an entry on the to-do list
  function Item(content, completed) {
    this.content = content;
    this.timeCreated = new Date().toGMTString();
    this.timeCompleted = null;
  }


  function addItem() {
    var inputField = document.getElementById('list_textbox');

    if (inputField.value == '') {
      return false;
    }

    var item = new Item(inputField.value, false);
    listComponent.unCompleted.push(item);

    listComponent.updateController();

  }


  function selectItem(item) {
    if (listComponent.selected.indexOf(item) >= 0) {
      listComponent.selected.splice(listComponent.selected.indexOf(item), 1);
    }
    else {
      listComponent.selected.push(item);
    }
    toggleClass(item, 'selected');
  }


  function completeItems() {

    for (var i = 0; i < listComponent.selected.length; i++) {
      var itemJson = JSON.parse(listComponent.selected[i].dataset.item);

      // Find uncompleted item that matches
      for (var j = 0; j < listComponent.unCompleted.length; j++) {
        if (listComponent.unCompleted[j].content == itemJson.content
            && listComponent.unCompleted[j].timeCreated == itemJson.timeCreated) {
          console.log('Great Success');

          var item = listComponent.unCompleted[j];
          listComponent.completed.push(item);
          listComponent.unCompleted.splice(j, 1);
          break;
        }
      }
    }

    listComponent.updateController();

  }

  // Add items to page visible
  function displayItems() {

    // empty both lists
    removeChildNodes(document.getElementById('list_todo'));
    removeChildNodes(document.getElementById('list_done'));


    for (var i = 0; i < listComponent.unCompleted.length; i++) {
      var item = listComponent.unCompleted[i];

      // Add item to displayed list
      var listContainer = document.getElementById('list_todo');

      var itemDiv = document.createElement('div');
      addClass(itemDiv, 'item');
      itemDiv.dataset.item = JSON.stringify(item);

      var contentDiv = document.createElement('div');
      addClass(contentDiv, 'content');
      contentDiv.appendChild(document.createTextNode(item.content));

      itemDiv.appendChild(contentDiv);
      listContainer.insertBefore(itemDiv, listContainer.childNodes[0]);

      itemDiv.onclick = function () {
        selectItem(this);
      }
    }


    for (var i = 0; i < listComponent.completed.length; i++) {
      var item = listComponent.completed[i];

      // Add item to displayed list
      var listContainer = document.getElementById('list_done');

      var itemDiv = document.createElement('div');
      addClass(itemDiv, 'item');
      itemDiv.dataset.item = JSON.stringify(item);

      var contentDiv = document.createElement('div');
      addClass(contentDiv, 'content');
      contentDiv.appendChild(document.createTextNode(item.content));

      itemDiv.appendChild(contentDiv);
      listContainer.insertBefore(itemDiv, listContainer.childNodes[0]);

      itemDiv.onclick = function () {
        selectItem(this);
      }
    }

  }


  // OBSERVER functions
  listComponent.toString = function () {
    return 'listComponent Observer';
  };

  listComponent.update = function (args) {
    if (args === void 0) {
      args = {};
    }

    // Update component to match observer's data
    listComponent.unCompleted = args.unCompleted;
    listComponent.completed = args.completed;

    if(listComponent.unCompleted === void 0) {
      listComponent.unCompleted = [];
    }
    if(listComponent.completed === void 0) {
      listComponent.completed = [];
    }

    init();
    displayItems();
  };

  listComponent.updateController = function () {
    var args = {
      'completed': listComponent.completed,
      'unCompleted': listComponent.unCompleted
    };
    controller.updateObservers(args);
  };

})();


// ------------------------------------ STORAGE COMPONENT BEHAVIOR --------------------------- //

(function() {

  // OBSERVER functions
  storageComponent.toString = function() {
    return 'storageComponent Observer';
  };

  storageComponent.update = function(args) {
    if (args === void 0) {
      args = {};
    }
    console.log('storageComponent Observer update called');
    // console.log(JSON.stringify(args));

    // Write to storage - using local storage to persist data
    localStorage.setItem('data', JSON.stringify(args));
  };

  // Used to let controller know stored values on load
  storageComponent.updateController = function() {
    try {
      var data = JSON.parse(localStorage.getItem('data'));
      if (data) {
        controller.updateObservers(data);
        return true;
      }
    }
    catch (e) {
      console.log('Could not get local storage: ' + e)
    }

    return false;
  }

})();


// ------------------------------------ SUMMARY COMPONENT BEHAVIOR --------------------------- //

(function () {

  // OBSERVER functions
  summaryComponent.toString = function () {
    return 'summaryComponent Observer'
  };

  summaryComponent.update = function(args) {
    if (args === void 0) {
      args = {};
    }
    console.log('summaryComponent Observer update called');

    var numCompleted = 0;
    var numUnCompleted = 0;

    if(args.completed !== void 0) {
      numCompleted = args.completed.length;
    }
    if(args.unCompleted !== void 0) {
      numUnCompleted = args.unCompleted.length;
    }

    document.getElementById('disp_completed').innerHTML = numCompleted + '';
    document.getElementById('disp_uncompleted').innerHTML = numUnCompleted + '';

    if((numCompleted + numUnCompleted) > 0) {
      document.getElementById('completed_progress-bar').style.width =
          (numCompleted / (numCompleted + numUnCompleted)) * 100 + '%';
    }
  };

})();


// ------------------------------------ TWITTER COMPONENT BEHAVIOR --------------------------- //




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

function removeChildNodes(element) {
  while(element.hasChildNodes()) {
    element.removeChild(element.firstChild);
  }
}

