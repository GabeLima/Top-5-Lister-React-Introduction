import React from 'react';
import './App.css';

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from './db/DBManager';
import jsTPS from './transactions/jsTPS';
import ChangeItem_Transaction from './transactions/ChangeItem_Transaction'

// THESE ARE OUR REACT COMPONENTS
import DeleteModal from './components/DeleteModal';
import Banner from './components/Banner.js';
import Sidebar from './components/Sidebar.js';
import Workspace from './components/Workspace.js';
import Statusbar from './components/Statusbar.js';

class App extends React.Component {
    constructor(props) {
        super(props);

        // THIS WILL TALK TO LOCAL STORAGE
        this.db = new DBManager();
        this.tps = new jsTPS();

        // GET THE SESSION DATA FROM OUR DATA MANAGER
        let loadedSessionData = this.db.queryGetSessionData();

        // SETUP THE INITIAL STATE
        this.state = {
            currentList : null,
            sessionData : loadedSessionData,
            listKeyPair : {
                key : "",
                name : ""
            }
        }
        this.undo = this.undo.bind(this);
    }
    sortKeyNamePairsByName = (keyNamePairs) => {
        keyNamePairs.sort((keyPair1, keyPair2) => {
            // GET THE LISTS
            return keyPair1.name.localeCompare(keyPair2.name);
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
    createNewList = () => {
        if(this.state.currentList !== null){
            return;
        }
        // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
        let newKey = this.state.sessionData.nextKey;
        let newName = "Untitled" + newKey;

        // MAKE THE NEW LIST
        let newList = {
            key: newKey,
            name: newName,
            items: ["?", "?", "?", "?", "?"]
        };

        // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
        // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
        let newKeyNamePair = { "key": newKey, "name": newName };
        let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
        this.sortKeyNamePairsByName(updatedPairs);

        // CHANGE THE APP STATE SO THAT IT THE CURRENT LIST IS
        // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
        // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
        // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
        // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
        // SHOULD BE DONE VIA ITS CALLBACK
        this.setState(prevState => ({
            currentList: newList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey + 1,
                counter: prevState.sessionData.counter + 1,
                keyNamePairs: updatedPairs
            },
            listKeyPair : prevState.listKeyPair
        }), () => {
            // PUTTING THIS NEW LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationCreateList(newList);
        });
    }
    renameList = (key, newName) => {
        // let shouldClearTransactions = true;
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            let pair = newKeyNamePairs[i];
            if (pair.key === key) {
                // if(pair.name === newName){
                //     shouldClearTransactions = false;
                //     console.log("Shouldn't clear the transaction stack...");
                // }
                pair.name = newName;
            }
        }
        // if(shouldClearTransactions){
        //     this.tps.clearAllTransactions();
        // }
        this.sortKeyNamePairsByName(newKeyNamePairs);

        // WE MAY HAVE TO RENAME THE currentList
        let currentList = this.state.currentList;
        if (currentList.key === key) {
            currentList.name = newName;
        }

        this.setState(prevState => ({
            currentList: prevState.currentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            let list = this.db.queryGetList(key);
            list.name = newName;
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
            
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
    loadList = (key) => {
        let newCurrentList = this.db.queryGetList(key);
        if(this.state.currentList != null && newCurrentList.key === this.state.currentList.key){
            console.log("Returning early to prevent clearing of the transaction stack!");
            return;
        }
        console.log("Callling clear all transactions from load list...");
        this.tps.clearAllTransactions();
        this.setState(prevState => ({
            currentList: newCurrentList,
            sessionData: prevState.sessionData
        }), () => {
            // ANY AFTER EFFECTS? CLEAR THE TRANSACTION STACK
            
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
    closeCurrentList = () => {
        this.tps.clearAllTransactions();
        console.log("INSIDE CLOSE CURRENT LIST");
        this.setState(prevState => ({
            currentList: null,
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            sessionData: this.state.sessionData
        }), () => {
            // ANY AFTER EFFECTS?
        });
    }
    deleteList = (key) => {
        console.log("Passed the key: ", key);
        this.setState(prevState => ({
            currentList: prevState.currentList,
            sessionData: prevState.sessionData,
            listKeyPair: key

        }), () => {
            // ANY AFTER EFFECTS?
        });
        // SOMEHOW YOU ARE GOING TO HAVE TO FIGURE OUT
        // WHICH LIST IT IS THAT THE USER WANTS TO
        // DELETE AND MAKE THAT CONNECTION SO THAT THE
        // NAME PROPERLY DISPLAYS INSIDE THE MODAL
        this.showDeleteListModal(key);
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
    showDeleteListModal(key) {
        let modal = document.getElementById("delete-modal");
        modal.classList.add("is-visible");
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.remove("is-visible");
    }
    //THIS FUNCTION IS FOR DELETING A LIST AND HIDING THE MODAL
    deleteListHideModal = () => {
        // @TODO 
        // GOTTA SOMEHOW DELETE THE LIST, LOOK AT THE DELETELIST FN
        let newKeyNamePairs = this.state.sessionData.keyNamePairs;
        let listRemoving = this.state.listKeyPair.key
        newKeyNamePairs = newKeyNamePairs.filter(item => item.key !== listRemoving)
        console.log(newKeyNamePairs);
        console.log(this.state.currentList);
        // let newCurrentList = this.state.currentList;
        // newCurrentList.name = "";
        this.setState(prevState => ({
            currentList: null,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            //ANY AFTER EFFECTS OF DELETING A LIST? YES, HAVE TO SAVE and CLEAR OUT THE STATUSBAR ^ did that with newCurrentList
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
        console.log("Attempting to delete a list... NEED THE NAME");
        this.hideDeleteListModal();
    }
    saveLists = (oldCurrentListItems) =>{
        console.log("Inside saveLists");
        this.db.mutationUpdateList(this.state.currentList);
    }

    addChangeItemTransaction = (oldCurrentListItems) => {
        let equalCount = 0;
        for(let i = 0; i < this.state.currentList.items.length; i ++){
            if(oldCurrentListItems[i] === this.state.currentList.items[i]){
                equalCount += 1;
            }
        }
        // Essentially saying if theres no actual update to the item, don't add a transaction
        if(equalCount === 5){
            return; 
        }
        console.log("ADD CHANGE Old current List items: ", oldCurrentListItems);
        console.log("ADD CHANGE New current list items: ", this.state.currentList.items);
        //CREATE DEEP COPIES OF EACH
        // for(let i = 0; i < this.state.currentList.items.length; i ++){
        //     deepCurrentList[i] = this.state.currentList.items[i];
        // }
        let deepCurrentList = JSON.parse(JSON.stringify(this.state.currentList.items));
        // deepCurrentList[5] = "potato";
        // for(let i = 0; i < this.state.currentList.items.length; i ++){
        //     deepOldItems[i] = oldCurrentListItems[i];
        // }
        let deepOldItems = JSON.parse(JSON.stringify(oldCurrentListItems));
        let transaction = new ChangeItem_Transaction(this, deepOldItems, deepCurrentList);
        this.tps.addTransaction(transaction);
    }

    changeItem(oldCurrentListItems) {
        console.log("Old current List items: ", oldCurrentListItems);
        console.log("New current list items: ", this.state.currentList.items);
        let newCurrentList = this.state.currentList;
        newCurrentList.items = oldCurrentListItems;
        newCurrentList = JSON.parse(JSON.stringify(newCurrentList));
        this.setState(prevState => ({
            currentList: newCurrentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: this.state.sessionData.keyNamePairs //Not sure if this is correct
            }
        }), () => {
            //ANY AFTER EFFECTS?
        });
        this.saveLists(newCurrentList);
    }

    undo = () => {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
        }
        // UPDATING STATE FOR CTRL Z PURPOSES.
        this.setState(prevState => ({
            currentList: prevState.currentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: this.state.sessionData.keyNamePairs //Not sure if this is correct
            }
        }), () => {
            //ANY AFTER EFFECTS?
        });
    }
    redo= () =>{
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();
        }
        // UPDATING STATE FOR CTRL Y PURPOSES.
        this.setState(prevState => ({
            currentList: prevState.currentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: this.state.sessionData.keyNamePairs //Not sure if this is correct
            }
        }), () => {
            //ANY AFTER EFFECTS?
        });
    }

    handler = (event) =>{
        if (event.ctrlKey && event.key === 'z') {
            console.log("ctrlz pressed");
          this.undo();
          console.log("After undo: ", this.tps.hasTransactionToUndo());
        }
        else if(event.ctrlKey && event.key === 'y'){
            this.redo();
        }
    }
    
    componentDidMount() {
        document.addEventListener('keydown', this.handler);
    }
    // keydownHandler(e){
    //     if(e.keyCode===13 && e.ctrlKey) this.showMessage()
    //   }
    // componentDidMount(){
    //     document.addEventListener('keydown',this.keydownHandler);
    //   }
    //   componentWillUnmount(){
    //     document.removeEventListener('keydown',this.keydownHandler);
    //   }
    //   showMessage () {
    //     alert('SOME MESSAGE');
    //   }


      

    


    render() {
        return (
            <div id="app-root">
                <Banner 
                    title='Top 5 Lister'
                    closeCallback={this.closeCurrentList} 
                    undoCallback = {this.undo}
                    redoCallback = {this.redo}
                    hasUndo = {this.tps.hasTransactionToUndo()}
                    hasRedo = {this.tps.hasTransactionToRedo()}
                    currentList = {this.state.currentList}
                />
                    
                <Sidebar
                    heading='Your Lists'
                    currentList={this.state.currentList}
                    keyNamePairs={this.state.sessionData.keyNamePairs}
                    createNewListCallback={this.createNewList}
                    deleteListCallback={this.deleteList}
                    loadListCallback={this.loadList}
                    renameListCallback={this.renameList}
                />
                <Workspace
                    currentList={this.state.currentList} 
                    saveListCallback = {this.addChangeItemTransaction}/>
                <Statusbar 
                    currentList={this.state.currentList} 
                    />
                <DeleteModal
                    hideDeleteListModalCallback={this.hideDeleteListModal}
                    deleteListCallBack = {this.deleteListHideModal}
                    listKeyPair = {this.state.listKeyPair}
                />
            </div>
        );
    }
}

export default App;