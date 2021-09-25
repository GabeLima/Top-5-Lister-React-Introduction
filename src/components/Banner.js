import React from "react";
import EditToolbar from "./EditToolbar";

export default class Banner extends React.Component {
    render() {
        const { closeCallback, undoCallback, redoCallback} = this.props;
        const { title} = this.props;
        return (
            <div id="top5-banner">
                {title}
                <EditToolbar
                redoCallback = {redoCallback}
                undoCallback = {undoCallback} 
                closeCallback = {closeCallback}/>
            </div>
        );
    }
}