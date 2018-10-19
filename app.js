//Storage controller

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
        items: [
        // {id: 0, name: 'Steack Dinner', callories: 1200},
        // {id: 1, name: 'Cookies', callories: 400},
        // {id: 2, name: 'Aggs', callories: 300}
        ],
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
const App = (function(ItemCtrl, UICtrl){
    //load event listeners
    const loadEventListeners = function() {
       const UISelectors = UICtrl.getSelectors(); 
       //add item event
       document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

       //edit icon click event
       document.querySelector(UISelectors.itemList).addEventListener('click', ItemUpdateSubmit);
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

            //clear fields
            UICtrl.clearInput();
        }
        e.preventDefault();
    }
    // Update item submit
    const ItemUpdateSubmit = function(e) {
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

    

    //Public methods
    return {
        init: function() {
            //clear edit state
            UICtrl.clearEditState();
            //fetch items from data structure
            const items = ItemCtrl.getItems();

            //check if ane items
            if(items.length ===0 ) {
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
})(ItemCtrl, UICtrl);

App.init(); 