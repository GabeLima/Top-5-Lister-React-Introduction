import React from "react";
import { DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";

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
        this.setState({ text: event.target.value, items: items});
        //GOTTA SAVE IT
    }
    handleBlur = (event) => {
        this.handleUpdate(event);
        // this.props.items = this.state.items;
        this.setState({ itemNumber: -1});
        this.props.saveListCallback(this.state.oldCurrentListItems);
    }
    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            this.handleBlur(event);
        }
    }
    render() {
        const { currentList} = this.props;
        let items = ["","","","",""];
        if (currentList) {
            items = currentList.items;
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
                    <DragDropContext>
                        <Droppable droppableId = "characters">
                            {(provided) => (

                            <div id="edit-items" {...provided.droppableProps} ref = {provided.innerRef}>

                                <Draggable draggableId = "top5-item-0" index = {0}>
                                    {(provided) => (
                                        <div className="top5-item" {...provided.draggableProps} {...provided.dragHandleProps} ref = {provided.innerRef}>
                                            {this.state.itemNumber === 0? 
                                            <input autoFocus onKeyPress={this.handleKeyPress} onBlur={this.handleBlur} defaultValue={items[0]} type='text'/>: 
                                            <div onClick={(e) => {this.handleClick(e, 0, items); }}>{items[0]}</div>}
                                        </div>
                                    )}
                                </Draggable>
                                
                                <Draggable draggableId = "top5-item-1" index = {1}>
                                    {(provided) => (
                                        <div className="top5-item" {...provided.draggableProps} {...provided.dragHandleProps} ref = {provided.innerRef}>
                                            {this.state.itemNumber === 1? 
                                            <input autoFocus onKeyPress={this.handleKeyPress} onBlur={this.handleBlur} defaultValue={items[1]} type='text'/>: 
                                            <div onClick={(e) => {this.handleClick(e, 1, items); }}>{items[1]}</div>}
                                        </div>
                                    )}
                                </Draggable>

                                {this.state.itemNumber === 2? 
                                <input className="top5-item" autoFocus onKeyPress={this.handleKeyPress} onBlur={this.handleBlur} defaultValue={items[2]} type='text'/>: 
                                <div className="top5-item"  onClick={(e) => {this.handleClick(e, 2, items); }}>{items[2]}</div>}

                                {this.state.itemNumber === 3? 
                                <input className="top5-item" autoFocus onKeyPress={this.handleKeyPress} onBlur={this.handleBlur} defaultValue={items[3]} type='text'/>: 
                                <div className="top5-item"  onClick={(e) => {this.handleClick(e, 3, items); }}>{items[3]}</div>}
                                
                                {this.state.itemNumber === 4? 
                                <input className="top5-item" autoFocus onKeyPress={this.handleKeyPress} onBlur={this.handleBlur} defaultValue={items[4]} type='text'/>: 
                                <div className="top5-item"  onClick={(e) => {this.handleClick(e, 4, items); }}>{items[4]}</div>}
                            
                            
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