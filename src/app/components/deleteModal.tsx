import Modal from "react-modal";
import React from "react";
import "../styles/app.scss";
import {FaWindowClose} from "react-icons/fa";

type List = {
    listName:string
}

type deleteModalProps = {
    setIsModal:(isModal:boolean) => void,
    isModal:boolean,
    list:List,
    handleDelete:(list:object) => void
}

export default function deleteModal({setIsModal,isModal,list,handleDelete}:deleteModalProps){
    return (
    <Modal ariaHideApp={false} isOpen={isModal} className="deleteModal">
        <div className="deleteModal_actions">
            <FaWindowClose onClick={()=>setIsModal(false)} 
            size={20} className="deleteModal_closeBtn" />
            <p className="deleteModal_actions_title">
                Are you sure you want to delete?
            </p>
            <p className="deleteModal_actions_taskName">
                {list && list.listName}
            </p>
            <div className="deleteModal_actions_btnContainer">
                <div onClick={()=>setIsModal(false)} 
                className="deleteModal_actions_btnContainer_noBtn">
                    No
                </div>
                <div onClick={()=>handleDelete(list)} 
                className="deleteModal_actions_btnContainer_yesBtn">
                    Yes
                </div>
            </div>
        </div>
    </Modal>
    )
}