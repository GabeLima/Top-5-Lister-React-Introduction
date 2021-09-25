import React from "react";

export default class EditToolbar extends React.Component {
    render() {
        const { closeCallback, undoCallback, redoCallback} = this.props;
        return (
            <div id="edit-toolbar">
                <div 
                    onClick={undoCallback}
                    id='undo-button' 
                    className="top5-button">
                        &#x21B6;
                </div>
                <div
                    onClick={redoCallback}
                    id='redo-button'
                    className="top5-button">
                        &#x21B7;
                </div>
                <div
                    onClick={closeCallback}
                    id='close-button'
                    className="top5-button">
                        &#x24E7;
                </div>
            </div>
        )
    }
}