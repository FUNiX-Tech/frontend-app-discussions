import {
    Link
  } from 'react-router-dom';
import { ALL_ROUTES } from "../data/constants";import {
    Route, Switch, useLocation, useRouteMatch, matchPath
  } from 'react-router';
import iconBooks from './assets/books.svg';
import { useSelector } from 'react-redux';
import './dashboard.scss'

const Dashboard = ()=>{
    // const {courseId, courseTitle} =useContext(DiscussionContext)
    const { params } = useRouteMatch(ALL_ROUTES);
    const {
        courseId,
      } = params;
      
      const { courseTitle } = useSelector((state) => state.courseTabs);


    return  (
        

            <div className='container' style={{minHeight:'70vh' , maxWidth:'700px'}}>
                
                <Link className='dashboard-item' to={`/${courseId}/posts`}>
                  
                        <img src={iconBooks} />
                        <span>{courseTitle}</span>
                   
                </Link>
            </div>
     
    )
}

export default Dashboard