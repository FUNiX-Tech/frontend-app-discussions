import { useState } from "react"
import { Modal} from 'react-bootstrap'
import { PostEditor } from "../discussions/posts";
import { useRouteMatch } from 'react-router';
import {Link} from 'react-router-dom';
import {ModalLayer , useToggle} from '@edx/paragon'
import { ALL_ROUTES } from "../data/constants";
import vectorIcon from './assets/Vector.svg'
import dashboardIcon from './assets/dashboard.svg'
import dashboardActiveIcon from './assets/dashboardActive.svg'
import './dashboard.scss'
import PostEditorCustom from "../discussions/posts/post-editor/PostEditorCustom";



const ActionNavbar = ({courseTitle})=>{
    const [isOpen, open, close] = useToggle(false);

    
    const { params, url } = useRouteMatch(ALL_ROUTES);
    const {
        courseId,
      } = params;
    
    //   console.log(ALL_ROUTES)

    return (
        <div className="container py-4" style={{ maxWidth:'700px'}}>
           <div className="d-flex justify-content-between">
                <div className="action-navbar-link">
                    <Link to={`/${courseId}/dashboard`}>
                        
                        <img src ={url == `/${courseId}` ? dashboardActiveIcon  :  dashboardIcon} alt='dashboard' width='16px' height='16px' />
                        <span>Dashboard</span>
                    </Link>
                    {url.includes('posts') && <Link to=''><img src={vectorIcon} alt="vector" />
                        <span>{courseTitle}</span>
                    </Link>}
                </div>
                <div>
                    <button className="btn-primary-custom " onClick={open}  >
                        <span>Add New Post</span>
                    </button>
                    <ModalLayer isOpen={isOpen} onClose={close}>
                        <PostEditorCustom />
                    </ModalLayer>
 
                
                </div>
           </div>
        </div>
    )
}

export default ActionNavbar