import { useEffect, useState } from "react"
import { Modal} from 'react-bootstrap'
import { PostEditor } from "../discussions/posts";
import { useRouteMatch } from 'react-router';
import {Link} from 'react-router-dom';
import {ModalLayer , useToggle} from '@edx/paragon'
import { ALL_ROUTES } from "../data/constants";
import vectorIcon from './assets/Vector.svg'
import rightIcon from './assets/Right.svg'
import dashboardIcon from './assets/dashboard.svg'
import dashboardActiveIcon from './assets/dashboardActive.svg'
import './dashboard.scss'
import PostEditorCustom from "../discussions/posts/post-editor/PostEditorCustom";
import { useSelector } from "react-redux";
import { Search } from "../components";
import iconSearch from '../../src/assets/fe_search.svg'
import { history } from "@edx/frontend-platform";




const ActionNavbar = ({courseTitle})=>{

    const [title , setTitle] = useState('')
    const [isSearch, setIsSearch] = useState(false) 
    
    const { params, url } = useRouteMatch(ALL_ROUTES);
    const {
        courseId,postId
      } = params;

      const threads = useSelector(state=>state.threads.threadsById)
     
    useEffect(()=>{
        if (postId && threads[postId]){
            const post  = threads[postId] 
            setTitle(post.title ? post.title :'')
            setIsSearch(false)
        }
    
    },[postId, threads])
   

    const handlerSearch = ()=>{
        setIsSearch(true)
    }
    const hanlderCloseSearch = ()=>{
        setIsSearch(false)
    }

    const handlerCreatePost = ()=>{
        history.push(`/${courseId}/create-post`);
    }

    return (
        <div className="container py-4" style={{ maxWidth:'700px', minHeight:'92px'}}>
          {!isSearch ?  <div className="d-flex justify-content-between" style={{height:'37px'}}>
                <div className="action-navbar-link">
                    <Link to={`/${courseId}/dashboard`}>
                        <img src ={url == `/${courseId}` ? dashboardActiveIcon  :  dashboardIcon} alt='dashboard' width='16px' height='16px' />
                    </Link>

                    {url.includes('posts') && <Link to={`/${courseId}/posts`}>
                        {postId ? <img src={rightIcon} alt="right" style={{padding:'0px'}} /> : <img src={vectorIcon} alt="vector" />}
                       {postId ? <span>...</span> :  <span>{courseTitle}</span>}
                    </Link>}

                    {postId && <Link to=''><img src={vectorIcon} alt="vector" />
                        <span>{title}</span>
                    </Link> }

                    {url.includes('create-post') && <Link to={`/${courseId}/posts`}>
                        {postId ? <img src={rightIcon} alt="right" style={{padding:'0px'}} /> : <img src={vectorIcon} alt="vector" />}
                        <span>Tạo thảo luận mới</span>
                    </Link>}
                </div>
                <div>
                    {!postId && <div>
                        <button onClick={handlerSearch} className="btn">
                                <span>
                                    <img src={iconSearch} alt='search' />
                                </span>
                        </button>
                    <button className="btn-primary-custom " onClick={handlerCreatePost}  >
                        <span>Tạo bài đăng</span>
                    </button>
                    {/* <ModalLayer isOpen={isOpen} onClose={close}>
                        <PostEditorCustom onClose={handlerClose} />
                    </ModalLayer> */}
                    </div> }        
                </div>
           
           </div> : !postId && <Search close={hanlderCloseSearch} />}
        </div>
    )
}

export default ActionNavbar
