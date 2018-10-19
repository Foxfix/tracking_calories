//Storage controller
const StorageCtrl = (function() {
    //Public methods
    return{
        storeItem: function(item){
            let items = [];
            // check if any items in localstorage
            if(localStorage.getItem('items') === null ){
                items = [];
                //push new Item
                items.push(item);
                //set ls
                localStorage.setItem('items', JSON.stringify(items));
            } else{
                //get what is alresdy iin localstorage
                items = JSON.parse(localStorage.getItem('items'));

                //push new items
                items.push(items);

                //re set localstorage
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemFromStorage: function() {
            let items;
            if(localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        }
    }
})();

//Item controller
const ItemCtrl = (function(){
    //Item constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;    
    }

    //data structure / state
    const data = {
        // items: [
        // // {id: 0, name: 'Steack Dinner', callories: 1200},
        // // {id: 1, name: 'Cookies', callories: 400},
        // // {id: 2, name: 'Aggs', callories: 300}
        // ],
        items: StorageCtrl.getItemFromStorage(),
        currentItem: null,
        totalCalories: 0
    }
    //Public methods
    return {
        getItems: function() {
            return data.items;
        },
        addItem: function(name, callories) {
            let ID;
            //create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            //calories to number
            callories = parseInt(callories);

            //create new item
            newItem = new Item(ID, name, callories);

            //add to items array
            data.items.push(newItem);
            return newItem;
        },
        getItemById: function(id) {
            let found = null;
            data.items.forEach(function(item) {
                if(item.id === id) {
                    found = item;
                }
            })
            return found;
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        updatedItem: function(name, calories) {
            //calories to number
            calories = parseInt(calories);
            let found = null;

            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;

        },
        deleteItem: function(id) {
            //get ids
            const ids = data.items.map(function(item) {
                return item.id
            })

            //get index
            const index = ids.indexOf(id);

            //remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function() {
            data.items = [];

        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        getTotalCalorie: function() {
            let total = 0;
            //loop through items and add cals
            data.items.forEach(function(item) {
                total += item.calories;
            })
            //set total cal in data structure
            data.totalCalories = total;
            //return total
            return data.totalCalories;
        },
        logData: function(){
            return data;
        }
    }
})();


//UI controller
const UICtrl = (function(){
    //private 
    const UISelectors = {
        itemList: '#item-list',
        cleadBtn: '.clear-btn',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'        
    }
    //Public methods
    return {
        populateItemList: function(items) {
            let html = '';
            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                </li>`;
            });
            //Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        //public
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            //show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //create li element
            const li = document.createElement('li');
            //add a class
            li.className = 'collection-item';
            //add id
            li.id = `item-${item.id}`;
            //add html
            li.innerHTML = ` <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
            //insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems)

            //turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = ` <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
                }
            });
        },
        deleteListItem: function(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        //add item to form
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        //remove items
        removeItems: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // turn Node list into array
            listItems = Array.from(listItems);
            listItems.forEach(function(item) {
                item.remove();
            })
        },
        //hide the list
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function(){
            return UISelectors;
        }
    }
})();

//App controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
    //load event listeners
    const loadEventListeners = function() {
       const UISelectors = UICtrl.getSelectors(); 
       //add item event
       document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

       //disable submit on enter
       document.addEventListener('keypress', function(e) {
        if(e.keyCode === 13 || e.which === 13){
            e.preventDefault();
            return false;
        }
       })

       //edit icon click event
       document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

       //update item event
       document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

       //delete item event
       document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
       
       // back button event
       document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

       // clear item event
       document.querySelector(UISelectors.cleadBtn).addEventListener('click', clearAllItemsClick);
    }
    //add item submit
    const itemAddSubmit = function(e) {
        //get form input from UI controller
        const input = UICtrl.getItemInput();

        //check for name and calorie input
        if(input.name !== '' && input.calories !== '') {
            //add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            //Add item to UI list
            UICtrl.addListItem(newItem);

            //get total calories
            const totalCalories = ItemCtrl.getTotalCalorie();
            //add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //Store in localStorage
            StorageCtrl.storeItem(newItem);

            //clear fields
            UICtrl.clearInput();
        }
        e.preventDefault();
    }
    // Edit item submit
    const itemEditClick = function(e) {
        if(e.target.classList.contains('edit-item')){
            // Get list item id (item-0, item-1)
            const listId = e.target.parentNode.parentNode.id;
            const listIdArr = listId.split('-');
            //get the actual id
            const id = parseInt(listIdArr[1]);

            //get item
            const itemToEdit = ItemCtrl.getItemById(id)

            //set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            //add item to form
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }

    //Update item submit
    const itemUpdateSubmit = function(e) {
        //get item input
        const input = UICtrl.getItemInput();

        //update item 
        const updatedItem = ItemCtrl.updatedItem(input.name, input.calories);

        //update UI
        UICtrl.updateListItem(updatedItem);

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalorie();

        //add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //clear fields
        UICtrl.clearEditState();

        e.preventDefault();
    }

    //Delete item submit
    const itemDeleteSubmit = function(e) {
        //get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        //Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalorie();
        
        //add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //clear fields
        UICtrl.clearEditState();

        e.preventDefault();
    }

    //clear items event
    const clearAllItemsClick = function(){
        //delete all items form data structure
        ItemCtrl.clearAllItems();

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalorie();
        
        //add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //Remove from UI
        UICtrl.removeItems();
        //hide ul
        UICtrl.hideList();
    }

    //Public methods
    return {
        init: function() {
            //clear edit state
            UICtrl.clearEditState();

            //fetch items from data structure
            const items = ItemCtrl.getItems();

            //check if ane items
            if(items.length === 0 ) {
                UICtrl.hideList();
            } else {
                //populate list with items
                UICtrl.populateItemList(items);
            }

            //get total calories
            const totalCalories = ItemCtrl.getTotalCalorie();
            //add total calories to UI
            UICtrl.showTotalCalories(totalCalories);
            
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);

App.init(); 