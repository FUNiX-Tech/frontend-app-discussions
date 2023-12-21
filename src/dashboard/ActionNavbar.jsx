import { useState } from "react"
import { Modal} from 'react-bootstrap'
import { PostEditor } from "../discussions/posts";
import {  useParams } from 'react-router-dom';
import {
    Route, Switch, useLocation, useRouteMatch, matchPath
  } from 'react-router';
  import {Link} from 'react-router-dom';

import { ALL_ROUTES } from "../data/constants";
import vectorIcon from './assets/Vector.svg'
import dashboardIcon from './assets/dashboard.svg'
import dashboardActiveIcon from './assets/dashboardActive.svg'
import './dashboard.scss'



const ActionNavbar = ({courseTitle})=>{
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
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
                    <button className="btn-primary-custom " onClick={handleShow} >
                        <span>Add New Post</span>
                    </button>

                    <Modal show={show} onHide={handleClose}>
                                 <PostEditor course_ = {courseId} />
                    </Modal>
 
                
                </div>
           </div>
        </div>
    )
}

export default ActionNavbar