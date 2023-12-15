import { useState } from "react"
import { Modal} from 'react-bootstrap'
import { PostEditor } from "../discussions/posts";
import {  useParams } from 'react-router-dom';
import {
    Route, Switch, useLocation, useRouteMatch, matchPath
  } from 'react-router';
  import {Link} from 'react-router-dom';

import { ALL_ROUTES } from "../data/constants";



const ActionNavbar = ()=>{
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { params } = useRouteMatch(ALL_ROUTES);
    const {
        courseId,
      } = params;

    return (
        <div className="container py-4" style={{ maxWidth:'700px'}}>
           <div className="d-flex justify-content-between">
                <div>
                    <Link to={`/${courseId}/dashboard`}>Dashboard</Link>
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