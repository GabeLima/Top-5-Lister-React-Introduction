import React from "react";



export default class Workspace extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editActive: false,
            itemNumber: -1,
            text : "",
            items: []
        }
    }
    handleClick = (event, itemNumber, items) => {
        if (event.detail === 2) {
            this.handleToggleEdit(event, itemNumber, items);
        }
        console.log(itemNumber);
    }
    handleToggleEdit = (event, itemNumber, items) => {
        this.setState(prevState => ({
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
        this.setState({ itemNumber: -1});
    }
    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            this.handleUpdate(event);
            this.setState({ itemNumber: -1});
        }
    }
    render() {
        const { currentList } = this.props;
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
                    <div id="edit-items">
                    {this.state.itemNumber === 0? 
                        <input className="top5-item" autoFocus onKeyPress={this.handleKeyPress} onBlur={this.handleBlur} onChange={this.handleUpdate} defaultValue={items[0]} type='text'/>: 
                        <div className="top5-item"  onClick={(e) => {this.handleClick(e, 0, items); }}>{items[0]}</div>}


                        {this.state.itemNumber === 1? 
                        <input className="top5-item" autoFocus onKeyPress={this.handleKeyPress} onBlur={this.handleBlur} onChange={this.handleUpdate} defaultValue={items[1]} type='text'/>: 
                        <div className="top5-item"  onClick={(e) => {this.handleClick(e, 1, items); }}>{items[1]}</div>}

                        {this.state.itemNumber === 2? 
                        <input className="top5-item" autoFocus onKeyPress={this.handleKeyPress} onBlur={this.handleBlur} onChange={this.handleUpdate} defaultValue={items[2]} type='text'/>: 
                        <div className="top5-item"  onClick={(e) => {this.handleClick(e, 2, items); }}>{items[2]}</div>}

                        {this.state.itemNumber === 3? 
                        <input className="top5-item" autoFocus onKeyPress={this.handleKeyPress} onBlur={this.handleBlur} onChange={this.handleUpdate} defaultValue={items[3]} type='text'/>: 
                        <div className="top5-item"  onClick={(e) => {this.handleClick(e, 3, items); }}>{items[3]}</div>}
                        
                        {this.state.itemNumber === 4? 
                        <input className="top5-item" autoFocus onKeyPress={this.handleKeyPress} onBlur={this.handleBlur} onChange={this.handleUpdate} defaultValue={items[4]} type='text'/>: 
                        <div className="top5-item"  onClick={(e) => {this.handleClick(e, 4, items); }}>{items[4]}</div>}
                    </div>
                </div>
            </div>
        )
    }
}