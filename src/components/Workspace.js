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
        this.setState({ text: event.target.value });
    }
    render() {
        const { currentList } = this.props;
        let items = ["","","","",""];
        if (currentList) {
            items = currentList.items;
        }
        if (this.state.editActive) {
            //{...this.state.itemNumber === 0? <input/>: <div className="top5-item" onClick={(e) => {this.handleClick(e, 0, items);}}>{items[0]}</div>}
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
                            <input className="top5-item" onChange={this.handleUpdate} defaultValue={this.state.text} type='text'/>: 
                            <div className="top5-item" onClick={(e) => {this.handleClick(e, 0, items);}}>{items[0]}</div>}
                            <div className="top5-item" onClick={(e) => {this.handleClick(e, 1, items);}}>{items[1]}</div>
                            <div className="top5-item" onClick={(e) => {this.handleClick(e, 2, items);}}>{items[2]}</div>
                            <div className="top5-item" onClick={(e) => {this.handleClick(e, 3, items);}}>{items[3]}</div>
                            <div className="top5-item" onClick={(e) => {this.handleClick(e, 4, items);}}>{items[4]}</div>
                        </div>
                    </div>
                </div>
            )
            // return (
            //     <input
                
            //         // id={"edit-items"} //+ this.state.itemNumber
            //         // className='top5-item'
            //         type='text'
            //         // onKeyPress={this.handleKeyPress}
            //         // onBlur={this.handleBlur}
            //         onChange={this.handleUpdate}
            //         defaultValue={this.state.text}
            //     />)
        }
        else{
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
                            <div className="top5-item" onClick={(e) => {this.handleClick(e, 0, items);}}>{items[0]}</div>
                            <div className="top5-item" onClick={(e) => {this.handleClick(e, 1, items);}}>{items[1]}</div>
                            <div className="top5-item" onClick={(e) => {this.handleClick(e, 2, items);}}>{items[2]}</div>
                            <div className="top5-item" onClick={(e) => {this.handleClick(e, 3, items);}}>{items[3]}</div>
                            <div className="top5-item" onClick={(e) => {this.handleClick(e, 4, items);}}>{items[4]}</div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}