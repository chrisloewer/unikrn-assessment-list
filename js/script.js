

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


  controller.attachObserver(listComponent);
  controller.attachObserver(summaryComponent);
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
  listComponent.selectedComplete = [];
  listComponent.selectStart = null;
  listComponent.selectCompleteStart = null;
  listComponent.timeCompleted = null;

  function init() {
    document.getElementById('add_button').addEventListener('click', addItem);
    document.getElementById('complete_button').addEventListener('click', completeItems);
    document.getElementById('redo_button').addEventListener('click', redoItems);
    document.getElementById('delete_button').addEventListener('click', removeItems);
  }


  // Item Class
  // each item is an entry on the to-do list
  function Item(content) {
    this.content = content;
    this.timeCreated = new Date().toGMTString();
  }


  function addItem() {
    var inputField = document.getElementById('list_textbox');

    if (inputField.value == '') {
      return false;
    }

    var item = new Item(inputField.value);
    listComponent.unCompleted.push(item);

    listComponent.updateController();

  }


  function selectItem(item, event) {
    if(event.shiftKey && listComponent.selectStart !== null) {
      var allItems = item.parentNode.childNodes;
      var indexes = [];

      // Get indexes of two items
      for(var i=0; i<allItems.length; i++){
        if(allItems[i] === listComponent.selectStart || allItems[i] === item) {
          indexes.push(i);
        }
      }

      // clear all selected items
      while(listComponent.selected.length > 0) {
        var itm = listComponent.selected.pop();
        removeClass(itm, 'selected');
      }

      // Select appropriate items
      if(indexes[0] >= 0 && indexes[1] > 0) {
        for(var i=indexes[0]; i<= indexes[1]; i++) {
          listComponent.selected.push(allItems[i]);
          addClass(allItems[i],'selected');
        }
      }
      else if(indexes[0]) {
        listComponent.selected.push(allItems[indexes[0]]);
        addClass(allItems[indexes[0]],'selected');
      }
    }
    else if(event.ctrlKey) {
      if (listComponent.selected.indexOf(item) >= 0) {
        // Don't select
        listComponent.selected.splice(listComponent.selected.indexOf(item), 1);
        listComponent.selectStart = null;
      }
      else {
        // Select
        listComponent.selected.push(item);
        listComponent.selectStart = item;
      }
      toggleClass(item, 'selected');
    }
    else {
      // Check whether item should be selected or clear selection
      var selectFlag = true;
      if (listComponent.selected.indexOf(item) >= 0 && listComponent.selected.length == 1) {
        // Don't select
        selectFlag = false;
        listComponent.selectStart = null;
      }

      // clear all selected items
      while(listComponent.selected.length > 0) {
        var itm = listComponent.selected.pop();
        removeClass(itm, 'selected');
      }

      if(selectFlag) {
        // Select
        listComponent.selected.push(item);
        toggleClass(item, 'selected');
        listComponent.selectStart = item;
      }
    }
  }

  function selectCompletedItem(item, event) {
    if(event.shiftKey && listComponent.selectCompleteStart !== null) {
      var allItems = item.parentNode.childNodes;
      var indexes = [];

      // Get indexes of two items
      for(var i=0; i<allItems.length; i++){
        if(allItems[i] === listComponent.selectCompleteStart || allItems[i] === item) {
          indexes.push(i);
        }
      }

      // clear all selected items
      while(listComponent.selectedComplete.length > 0) {
        var itm = listComponent.selectedComplete.pop();
        removeClass(itm, 'selected');
      }

      // Select appropriate items
      if(indexes[0] >= 0 && indexes[1] > 0) {
        for(var i=indexes[0]; i<= indexes[1]; i++) {
          listComponent.selectedComplete.push(allItems[i]);
          addClass(allItems[i],'selected');
        }
      }
      else if(indexes[0]) {
        listComponent.selectedComplete.push(allItems[indexes[0]]);
        addClass(allItems[indexes[0]],'selected');
      }
    }
    else if(event.ctrlKey) {
      if (listComponent.selectedComplete.indexOf(item) >= 0) {
        // Don't select
        listComponent.selectedComplete.splice(listComponent.selectedComplete.indexOf(item), 1);
        listComponent.selectCompleteStart = null;
      }
      else {
        // Select
        listComponent.selectedComplete.push(item);
        listComponent.selectCompleteStart = item;
      }
      toggleClass(item, 'selected');
    }
    else {
      // Check whether item should be selected or clear selection
      var selectFlag = true;
      if (listComponent.selectedComplete.indexOf(item) >= 0 && listComponent.selectedComplete.length == 1) {
        // Don't Select
        selectFlag = false;
        listComponent.selectCompleteStart = null;
      }

      // clear all selected items
      while(listComponent.selectedComplete.length > 0) {
        var itm = listComponent.selectedComplete.pop();
        removeClass(itm, 'selected');
      }

      if(selectFlag) {
        // Select
        listComponent.selectedComplete.push(item);
        toggleClass(item, 'selected');
        listComponent.selectCompleteStart = item;
      }
    }
  }



  // Mark selected items as Complete
  function completeItems() {
    for (var i = 0; i < listComponent.selected.length; i++) {
      var itemJson = JSON.parse(listComponent.selected[i].dataset.item);

      // Find uncompleted item that matches
      for (var j = 0; j < listComponent.unCompleted.length; j++) {
        if (listComponent.unCompleted[j].content == itemJson.content
            && listComponent.unCompleted[j].timeCreated == itemJson.timeCreated) {

          var item = listComponent.unCompleted[j];
          listComponent.completed.push(item);
          listComponent.unCompleted.splice(j, 1);

          listComponent.timeCompleted = new Date().toGMTString();
          break;
        }
      }
    }
    listComponent.updateController();
  }

  // Mark selected items as Not Complete
  function redoItems() {
    for (var i = 0; i < listComponent.selectedComplete.length; i++) {
      var itemJson = JSON.parse(listComponent.selectedComplete[i].dataset.item);

      // Find completed item that matches
      for (var j = 0; j < listComponent.completed.length; j++) {
        if (listComponent.completed[j].content == itemJson.content
            && listComponent.completed[j].timeCreated == itemJson.timeCreated) {

          var item = listComponent.completed[j];
          listComponent.unCompleted.push(item);
          listComponent.completed.splice(j, 1);
          break;
        }
      }
    }
    listComponent.updateController();
  }

  // delete selected items - both completed and uncompleted
  function removeItems() {

    // uncompleted items
    for (var i = 0; i < listComponent.selected.length; i++) {
      var itemJson = JSON.parse(listComponent.selected[i].dataset.item);

      // Find uncompleted item that matches
      for (var j = 0; j < listComponent.unCompleted.length; j++) {
        if (listComponent.unCompleted[j].content == itemJson.content
            && listComponent.unCompleted[j].timeCreated == itemJson.timeCreated) {

          listComponent.unCompleted.splice(j, 1);
          break;
        }
      }
    }
    // completed items
    for (var i = 0; i < listComponent.selectedComplete.length; i++) {
      var itemJson = JSON.parse(listComponent.selectedComplete[i].dataset.item);

      // Find completed item that matches
      for (var j = 0; j < listComponent.completed.length; j++) {
        if (listComponent.completed[j].content == itemJson.content
            && listComponent.completed[j].timeCreated == itemJson.timeCreated) {

          listComponent.completed.splice(j, 1);
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
        selectItem(this, event);
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
        selectCompletedItem(this, event);
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

    console.log('listComponent Observer update called');

    // Update component to match observer's data
    listComponent.unCompleted = args.unCompleted;
    listComponent.completed = args.completed;
    listComponent.timeCompleted = args.timeCompleted;

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
      'unCompleted': listComponent.unCompleted,
      'timeCompleted': listComponent.timeCompleted
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
    else {
      document.getElementById('completed_progress-bar').style.width = '50%';
    }
  };

})();


// ------------------------------------ TWITTER COMPONENT BEHAVIOR --------------------------- //

(function() {

  // OBSERVER functions
  twitterComponent.toString = function() {
    return 'twitterComponent Observer';
  };

  twitterComponent.update = function(args) {
    if (args === void 0) {
      args = {};
    }
    console.log('twitterComponent Observer update called');

    var numCompleted = 0;
    var numUnCompleted = 0;
    var timeCompleted = null;

    if(args.completed !== void 0) {
      numCompleted = args.completed.length;
    }
    if(args.unCompleted !== void 0) {
      numUnCompleted = args.unCompleted.length;
    }
    if(args.timeCompleted !== void 0) {
      timeCompleted = args.timeCompleted;
    }

    var progressUpdate = 'I have completed ' + numCompleted + ' tasks out of ' + (numCompleted+numUnCompleted) + '!!';
    if(timeCompleted !== null) {
      progressUpdate += ' My last task completed was at ' + timeCompleted;
    }

    document.getElementById('progress_quote').innerHTML = progressUpdate;
    document.getElementById('twitter_button').onclick = function() {
      var link = 'http://twitter.com/home?status=' + encodeURI(progressUpdate);
      window.open(link, '_blank');
    };

  };

})();


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

