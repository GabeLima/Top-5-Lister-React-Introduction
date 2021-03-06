import React from "react";

export default class Workspace extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            oldCurrentListItems : [],
            editActive: false,
            itemNumber: -1,
            text : "",
            items: [],
            hoveringOver: -1,
            hoveringStart: -1,
            hoveringBoolean:false
        }
    }
    handleClick = (event, itemNumber, items, currentList) => {
        if(!currentList) return;
        // if(event.detail === 1){
        //     this.setState(prevState => ({
        //         oldCurrentListItems: prevState.oldCurrentListItems,
        //         editActive: prevState.editActive,
        //         itemNumber: itemNumber,
        //         text : items[itemNumber],
        //         items: items,
        //       }));
        // }
        if (event.detail === 2) {
            let newOldCurrentListItems = [];//this.props.currentList.items;
            // MAKE A DEEP COPY OF THE ITEMS
            for(let i = 0; i < this.props.currentList.items.length; i ++){
                newOldCurrentListItems[i] = this.props.currentList.items[i];
            }
            console.log(newOldCurrentListItems);
            this.handleToggleEdit(event, itemNumber, items, newOldCurrentListItems);
        }
        console.log(itemNumber);
    }
    handleToggleEdit = (event, itemNumber, items, newOldCurrentListItems) => {
        this.setState(prevState => ({
            oldCurrentListItems: newOldCurrentListItems,
            editActive: !this.state.editActive,
            itemNumber: itemNumber,
            text : items[this.state.itemNumber],
            items: items
          }));
    }
    handleUpdate = (event) => {
        let items = this.state.items;
        items[this.state.itemNumber] = event.target.value;
        this.setState({ text: event.target.value, items: items, itemNumber: -1});
        //GOTTA SAVE IT
    }
    handleBlur = (event) => {
        this.handleUpdate(event);
        this.props.saveListCallback(this.state.oldCurrentListItems);
    }
    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            this.handleBlur(event);
        }
    }

    // handleOnDragEnd = (result, items) =>{
    //     if(!result.destination) return;
    //     let oldIndex = result.source.index;
    //     let newIndex = result.destination.index;
    //     //console.log("Passed items from on drag end: ", items);
    //     //deep copy the list before swapping so we can pass it to save list callback
    //     let newOldCurrentListItems = [];//this.props.currentList.items;
    //     for(let i = 0; i < items.length; i ++){
    //         newOldCurrentListItems[i] = this.props.currentList.items[i];
    //     }
    //     this.setState({ items: items});
    //     this.moveItem(oldIndex, newIndex, items);
    //     //console.log(result);
    //     //console.log("New lists: ", this.state.items);
    //     this.props.saveListCallback(newOldCurrentListItems);
    // }
    moveItem(oldIndex, newIndex, items){
        // console.log("Old index: " + oldIndex);
        // console.log("New index: " + newIndex);
        let list = items;
        //console.log("List before swapping: ", this.state);
        let i = oldIndex;
        let swapIndex = newIndex;
        let direction = 1;
        if(oldIndex > newIndex){
            direction = -1;
        }
        while (!(i === swapIndex)){
            // console.log(i);
            let temp = list[i];
            list[i] = list[i + direction];
            list[i + direction] = temp;
            i += direction;
            
        }
        console.log("List after swapping: ", list);
        //update the state of the new items array
        this.setState({ items: list});
    }
    onDragOver = (e, hoveringOverNumber) =>{
        this.setState({hoveringBoolean: true});
        console.log("Hovering over: ", hoveringOverNumber);
        this.setState({ hoveringOver: hoveringOverNumber});
    }
    onDragStart = (e, hoveringStartNumber) =>{
        console.log("Dragging: ", hoveringStartNumber);
        this.setState({ hoveringStart: hoveringStartNumber});
    }
    onDragEnd = (event, items) =>{
        console.log("Hovering over: ", this.state.hoveringOver);
        console.log("Hovering Start: ", this.state.hoveringStart)
        console.log("event", event);
        if(this.state.hoveringOver < 0 || this.state.hoveringOver === this.hoveringStart) return;
        console.log("On Drag end firing...");
        let oldIndex = this.state.hoveringStart;
        let newIndex = this.state.hoveringOver;
        let newOldCurrentListItems = [];//this.props.currentList.items;
        for(let i = 0; i < items.length; i ++){
            newOldCurrentListItems[i] = this.props.currentList.items[i];
        }
        this.moveItem(oldIndex, newIndex, items);
        this.setState({ hoveringOver: -1, hoveringStart: -1});
        this.props.saveListCallback(newOldCurrentListItems);
    }
    resetHoveringOver = (event) =>{
        console.log("Restting hovering over...");
        this.setState({hoveringBoolean: false});
    }
    

    render() {
        const { currentList} = this.props;
        let items = ["","","","",""];
        if (currentList) {
            items = currentList.items;
            //update the items
        }
        return (
            <div id="top5-workspace">
                <div id="workspace-edit">
                    <div id="edit-numbering">
                        <div className="item-number">1.</div>
                        <div className="item-number">2.</div>
                        <div className="item-number">3.</div>
                        <div className="item-number">4.</div>
                        <div className="item-number">5.</div>
                    </div>
                    <div id="edit-items" onDragLeave = {this.resetHoveringOver}>
                        {this.state.itemNumber === 0? 
                        <input className="top5-item" autoFocus onKeyPress={this.handleKeyPress} onBlur={this.handleBlur} defaultValue={items[0]} type='text'/>: 
                        <div className={this.state.hoveringOver === 0 && this.state.hoveringBoolean? "top5-item-dragged-to": "top5-item"} onClick={(e) => {this.handleClick(e, 0, items, currentList); }}
                        onDragEnd = {(e) => this.onDragEnd(e, items, this.state.hoveringOver)}onDragOver = {(e) => this.onDragOver(e, 0)} onDragStart = {(e) => this.onDragStart(e, 0)} draggable ={currentList? "true": "false"}>{items[0]}</div>}

                        {this.state.itemNumber === 1? 
                        <input className="top5-item" autoFocus onKeyPress={this.handleKeyPress} onBlur={this.handleBlur} defaultValue={items[1]} type='text'/>: 
                        <div className={this.state.hoveringOver === 1&& this.state.hoveringBoolean? "top5-item-dragged-to": "top5-item"}  onClick={(e) => {this.handleClick(e, 1, items, currentList); }} 
                        onDragEnd = {(e) => this.onDragEnd(e, items, 1)}onDragOver = {(e) => this.onDragOver(e, 1)} onDragStart = {(e) => this.onDragStart(e, 1)} draggable = {currentList? "true": "false"}>{items[1]}</div>}

                        {this.state.itemNumber === 2? 
                        <input className="top5-item" autoFocus onKeyPress={this.handleKeyPress} onBlur={this.handleBlur} defaultValue={items[2]} type='text'/>: 
                        <div className={this.state.hoveringOver === 2&& this.state.hoveringBoolean? "top5-item-dragged-to": "top5-item"}  onClick={(e) => {this.handleClick(e, 2, items, currentList); }}
                        onDragEnd = {(e) => this.onDragEnd(e, items, 2)} onDragOver = {(e) => this.onDragOver(e, 2)} onDragStart = {(e) => this.onDragStart(e, 2)} draggable = {currentList? "true": "false"}>{items[2]}</div>}
                        
                        {this.state.itemNumber === 3? 
                        <input className="top5-item" autoFocus onKeyPress={this.handleKeyPress} onBlur={this.handleBlur} defaultValue={items[3]} type='text'/>: 
                        <div className={this.state.hoveringOver === 3&& this.state.hoveringBoolean? "top5-item-dragged-to": "top5-item"}  onClick={(e) => {this.handleClick(e, 3, items, currentList); }} 
                        onDragEnd = {(e) => this.onDragEnd(e, items, 3)} onDragOver = {(e) => this.onDragOver(e, 3)} onDragStart = {(e) => this.onDragStart(e, 3)} draggable = {currentList? "true": "false"}>{items[3]}</div>}
                        
                        {this.state.itemNumber === 4? 
                        <input className="top5-item" autoFocus onKeyPress={this.handleKeyPress} onBlur={this.handleBlur} defaultValue={items[4]} type='text'/>: 
                        <div className={this.state.hoveringOver === 4&& this.state.hoveringBoolean? "top5-item-dragged-to": "top5-item"}  onClick={(e) => {this.handleClick(e, 4, items, currentList); }}
                        onDragEnd = {(e) => this.onDragEnd(e, items, 4)} onDragOver = {(e) => this.onDragOver(e, 4)} onDragStart = {(e) => this.onDragStart(e, 4)} draggable = {currentList? "true": "false"}>{items[4]}</div>}
                    </div>
                </div>
            </div>
        )
    }
}