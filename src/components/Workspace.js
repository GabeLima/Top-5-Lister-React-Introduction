import React from "react";
import styled from 'styled-components'
import { DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";

// const Container = styled.div`
// position:absolute;
// left:20%;
// top:0%;
// width:80%;
// height: 100%;
// background-color: ${props => (props.isDragging ? 'lightgreen': 'white')};
// `;

export default class Workspace extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            oldCurrentListItems : [],
            editActive: false,
            itemNumber: -1,
            text : "",
            items: []
        }
    }
    handleClick = (event, itemNumber, items, currentList) => {
        if(event.detail === 1){
            this.setState(prevState => ({
                oldCurrentListItems: prevState.oldCurrentListItems,
                editActive: prevState.editActive,
                itemNumber: itemNumber,
                text : items[itemNumber],
                items: items,
                isDragging: false
              }));
        }
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
    handleOnDragEnd = (result, items) =>{
        if(!result.destination) return;
        let oldIndex = result.source.index;
        let newIndex = result.destination.index;
        //console.log("Passed items from on drag end: ", items);
        //deep copy the list before swapping so we can pass it to save list callback
        let newOldCurrentListItems = [];//this.props.currentList.items;
        for(let i = 0; i < items.length; i ++){
            newOldCurrentListItems[i] = this.props.currentList.items[i];
        }
        this.setState({ items: items});
        this.moveItem(oldIndex, newIndex, items);
        //console.log(result);
        //console.log("New lists: ", this.state.items);
        this.props.saveListCallback(newOldCurrentListItems);
    }
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
        while (!(i == swapIndex)){
            // console.log(i);
            let temp = list[i];
            list[i] = list[i + direction];
            list[i + direction] = temp;
            i += direction;
            
        }
        //console.log("List after swapping: ", list);
        //update the state of the new items array
        this.setState({ items: list});
    }
    handleOnDragStart = (result) =>{
        this.setState({ isDragging: true});
    }
    render() {
        const { currentList, isDragging} = this.props;
        let items = ["","","","",""];
        if (currentList) {
            items = currentList.items;
            //update the items
        }
        let backGroundId = "edit-items";
        if(this.state.isDragging){
            backGroundId = "edit-items-active"
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
                    <DragDropContext onDragEnd={(e) => this.handleOnDragEnd(e, items)} onDragStart = {this.handleOnDragStart} >
                        <Droppable droppableId = "characters">
                            {(provided) => (

                            <div id={backGroundId} {...provided.droppableProps} ref = {provided.innerRef}>

                                <Draggable draggableId = "top5-item-0" index = {0}>
                                    {(provided, snapshot) => (
                                        <div className="top5-item" {...provided.draggableProps} {...provided.dragHandleProps} ref = {provided.innerRef}>
                                            {this.state.itemNumber === 0? 
                                            <input autoFocus onKeyPress={this.handleKeyPress} onBlur={this.handleBlur} defaultValue={items[0]} type='text'/>: 
                                            <div onClick={(e) => {this.handleClick(e, 0, items); }}>{items[0]}</div>}
                                        </div>
                                    )}
                                </Draggable>
                                
                                <Draggable draggableId = "top5-item-1" index = {1}>
                                    {(provided, snapshot) => (
                                        <div className="top5-item" {...provided.draggableProps} {...provided.dragHandleProps} ref = {provided.innerRef}>
                                            {this.state.itemNumber === 1? 
                                            <input autoFocus onKeyPress={this.handleKeyPress} onBlur={this.handleBlur} defaultValue={items[1]} type='text'/>: 
                                            <div onClick={(e) => {this.handleClick(e, 1, items); }}>{items[1]}</div>}
                                        </div>
                                    )}
                                </Draggable>

                                <Draggable draggableId = "top5-item-2" index = {2}>
                                    {(provided, snapshot) => (
                                        <div className="top5-item" {...provided.draggableProps} {...provided.dragHandleProps} ref = {provided.innerRef}>
                                            {this.state.itemNumber === 2? 
                                            <input autoFocus onKeyPress={this.handleKeyPress} onBlur={this.handleBlur} defaultValue={items[2]} type='text'/>: 
                                            <div onClick={(e) => {this.handleClick(e, 2, items); }}>{items[2]}</div>}
                                        </div>
                                    )}
                                </Draggable>

                                <Draggable draggableId = "top5-item-3" index = {3}>
                                    {(provided, snapshot) => (
                                        <div className="top5-item" {...provided.draggableProps} {...provided.dragHandleProps} ref = {provided.innerRef} >
                                            {this.state.itemNumber === 3? 
                                            <input autoFocus onKeyPress={this.handleKeyPress} onBlur={this.handleBlur} defaultValue={items[3]} type='text'/>: 
                                            <div onClick={(e) => {this.handleClick(e, 3, items); }}>{items[3]}</div>}
                                        </div>
                                    )}
                                </Draggable>
                                
                                <Draggable draggableId = "top5-item-4" index = {4}>
                                    {(provided, snapshot) => (
                                        <div className="top5-item" {...provided.draggableProps} {...provided.dragHandleProps} ref = {provided.innerRef} >
                                            {this.state.itemNumber === 4? 
                                            <input autoFocus onKeyPress={this.handleKeyPress} onBlur={this.handleBlur} defaultValue={items[4]} type='text'/>: 
                                            <div onClick={(e) => {this.handleClick(e, 4, items); }}>{items[4]}</div>}
                                        </div>
                                    )}
                                </Draggable>
                            
                            
                            {provided.placeholder}
                            </div>
                        )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>
        )
    }
}