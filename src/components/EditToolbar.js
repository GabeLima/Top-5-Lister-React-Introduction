import React from "react";

export default class EditToolbar extends React.Component {
    render() {
        const { closeCallback, undoCallback, redoCallback, hasUndo, hasRedo, currentList} = this.props;
        return (
            <div id="edit-toolbar">
                {hasUndo ? 
                    <div 
                        onClick={undoCallback}
                        id='undo-button' 
                        className="top5-button">
                            &#x21B6;
                    </div>:
                    <div 
                        onClick={undoCallback}
                        id='undo-button' 
                        className="top5-button-disabled">
                            &#x21B6;
                    </div>
                }
                {hasRedo ?
                    <div
                        onClick={redoCallback}
                        id='redo-button'
                        className="top5-button">
                            &#x21B7;
                    </div>
                    :
                    <div
                        onClick={redoCallback}
                        id='redo-button'
                        className="top5-button-disabled">
                            &#x21B7;
                    </div>
                }
                {currentList? 
                    <div
                        onClick={closeCallback}
                        id='close-button'
                        className="top5-button">
                            &#x24E7;
                    </div>
                :
                    <div
                        onClick={closeCallback}
                        id='close-button'
                        className="top5-button-disabled">
                            &#x24E7;
                    </div>
                }
            </div>
        )
    }
}