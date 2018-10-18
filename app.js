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
        {id: 0, name: 'Steack Dinner', callories: 1200},
        {id: 1, name: 'Cookies', callories: 400},
        {id: 2, name: 'Aggs', callories: 300}
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
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories'
    }
    //Public methods
    return {
        populateItemList: function(items) {
            let html = '';
            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.callories} Callories</em>
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
    }
//add item submit
    const itemAddSubmit = function(e) {
        //get form input from UI controller
        const input = UICtrl.getItemInput();

        //check for name and calorie input
        if(input.name !== '' && input.calories !== '') {
            //add item
            const newItem = ItemCtrl.addItem(input.name, input.calories)
        }
        e.preventDefault();
    }

    //Public methods
    return {
        init: function() {
            //fetch items from data structure
            const items = ItemCtrl.getItems();
            //populate list with items
            UICtrl.populateItemList(items);
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl);

App.init(); 