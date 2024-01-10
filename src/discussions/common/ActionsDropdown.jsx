import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { logError } from '@edx/frontend-platform/logging';
import {
  Button, Dropdown, Icon, IconButton, ModalPopup, useToggle,Modal, InputSelect , InputText , DropdownButton
} from '@edx/paragon';
import { MoreHoriz } from '@edx/paragon/icons';

import { ContentActions } from '../../data/constants';
import { commentShape } from '../comments/comment/proptypes';
import { selectBlackoutDate } from '../data/selectors';
import messages from '../messages';
import { postShape } from '../posts/post/proptypes';
import { inBlackoutDateRange, useActions } from '../utils';
import { DiscussionContext } from './context';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import iconEdit from '../../assets/edit.svg'
import iconTrash from '../../assets/trash.svg'
import iconReport from '../../assets/report.svg'
import iconClose from '../../assets/closePost.svg'
import iconUnpin from '../../assets/notPin.svg'
import iconPin from '../../assets/ghim.svg'
import iconFollowing from '../../assets/following.svg'
import iconUnfollwing from '../../assets/unfollowing.svg'
import iconUMarkAnswered from '../../assets/unMarkAnswered.svg'
import iconMarkAnswered from '../../assets/markAnswered.svg'

import { resetReport, setDetails, setType, addReports } from './data/slice';
function ActionsDropdown({
  intl,
  commentOrPost,
  disabled,
  actionHandlers,
}) {
  const [isOpen, open, close] = useToggle(false);
  const [target, setTarget] = useState(null);
  const actions = useActions(commentOrPost);
  
  console.log('============', useActions(commentOrPost))
  // console.log('=====commentOrPost=======', commentOrPost)
  // const { inContext } = useContext(DiscussionContext);
  const authenticatedUser = getAuthenticatedUser();
  // console.log(commentOrPost.author === authenticatedUser.username)
  // console.log('========', authenticatedUser)
  const isUserCreated = commentOrPost.author === authenticatedUser.username
  const handleActions = (action) => {

    const actionFunction = actionHandlers[action];
    if (actionFunction) {
      actionFunction();
    } else {
      logError(`Unknown or unimplemented action ${action}`);
    }
  };
  const blackoutDateRange = useSelector(selectBlackoutDate);

  // Find and remove edit action if in blackout date range.
  if (inBlackoutDateRange(blackoutDateRange) || !isUserCreated) {
    actions.splice(actions.findIndex(action => action.id === 'edit'), 1);
  }

  if (authenticatedUser.administrator ){
    actions.splice(actions.findIndex(action => action.id === 'report'), 1);
  }
if (isUserCreated) {
  actions.splice(actions.findIndex(action => action.id === 'report'), 1);
}
// console.log(actions);
// console.log('===========', authenticatedUser)
// console.log('===========isUserCreated=====', commentOrPost.author ,authenticatedUser.username)
  // model report 
  const [modelReport , setModalReport] = useState(false)
  const typeReport = [intl.formatMessage(messages.duplicationReport), intl.formatMessage(messages.inappropriateReport)]
  const dispatch = useDispatch()
  const reportSelector = useSelector(state=>state.report)

  const handlerModalReport =(action)=>{
    close()
    setModalReport(true)
    dispatch(setType(typeReport[0]))
    
  }
// console.log(useSelector(state=>state))
  const handlerReport = ()=>{
    const actionFunction = actionHandlers['abuse_flagged'];
    if (actionFunction) {
      actionFunction();
      dispatch(addReports({id:commentOrPost.id , type : reportSelector.type }))
    } else {
      logError(`Unknown or unimplemented action ${'abuse_flagged'}`);
    }
    setModalReport(false)
    
    dispatch(resetReport())
  }
// console.log('============', actions)
const [isDelete , setIsDelete] = useState(false)
useEffect(()=>{
  if (isOpen){
    setIsDelete(false)
  }
},[isOpen])
  return (
    <>
      <IconButton
        onClick={open}
        alt={intl.formatMessage(messages.actionsAlt)}
        src={MoreHoriz}
        iconAs={Icon}
        disabled={disabled}
        size="sm"
        className='action-dropdown'
        ref={setTarget}
      />

      <ModalPopup
        onClose={close}
        positionRef={target}
        isOpen={isOpen}
        // placement={inContext ? 'left' : 'auto-start'}
        hasArrow
        placement='right'
      >
        <div
          className="bg-white p-1 shadow d-flex flex-column"
          data-testid="actions-dropdown-modal-popup"
        >
          {actions.map(action => {
            if (action.id !== 'copy-link' && action.id !== "reopen" && action.id !== 'delete'){
              return (
                <div key={action.id}>
                 <Dropdown.Item
                    as={Button}
                    variant="tertiary"
                    size="inline"
                    // onClick={() => {
                    //   close();
                    //   handleActions(action);
                    // }}
                    onClick={() => {
                      close();
                      const actionHandler = action.id !== 'report' ? handleActions : handlerModalReport;
                      actionHandler(action.action);
                    }}
                    className="d-flex justify-content-start py-1.5 mr-4"
                  >
                    {/* <Icon src={action.icon} className="mr-1" /> */}
                    {action.id =='edit' && <img src={iconEdit} alt='edit' />}
                    {/* {action.id =='delete' && <img src={iconTrash} alt='remove' />} */}
                    {action.id =="report" && <img src={iconReport} alt='report' />}
                    {action.id =="close" && <img src={iconClose} alt='close' />}
                    {action.id =="unpin" && <img src={iconUnpin} alt='unpin' />}
                    {action.id =="pin" && <img src={iconPin} alt='pin' />}
                    {action.id == 'answer' || action.id == 'endorse' && <img src={iconMarkAnswered} alt='mark_answered' />}
                    {action.id == "unanswer" || action.id == 'unendorse' && <img src={iconUMarkAnswered} alt='un_mark_answered' />}
                    <span style={{color : `${action.id =='delete' ? '#D82C0D' : ''}`}}> {intl.formatMessage(action.label)}</span>
                  </Dropdown.Item>
                </div>
              )
            }
          })}
            {authenticatedUser.administrator && (!isDelete ? <div>
              <Dropdown.Item 
                      as={Button}
                    variant="tertiary"
                    size="inline" onClick={()=>setIsDelete(true)}
                    className="d-flex justify-content-start py-1.5 mr-4" > 
                      <img src={iconTrash} alt='remove' />
                      <span style={{color : ` #D82C0D`}}> {intl.formatMessage(messages.deleteAction)}</span>
                    </Dropdown.Item> 
              </div>
                    : 
                    <div className='d-flex'>
              <Dropdown.Item as={Button}
                    variant="tertiary"
                    size="inline" 
                    onClick={()=>handleActions('delete')}>
                      <span style={{color : ` #D82C0D`}}>Chắc chắc</span>
                    </Dropdown.Item>
              <Dropdown.Item  as={Button}
                    variant="tertiary"
                    size="inline"
                    onClick={()=>setIsDelete(false)}
                    >Không</Dropdown.Item>
            </div>)}
            {!authenticatedUser.administrator  && 
             <Dropdown.Item as={Button}                    
                   variant="tertiary"
                   className="d-flex justify-content-start py-1.5 mr-4" 
                    size="inline"  onClick={()=>{
              close()
              handleActions('following')
            }} >
               {commentOrPost.following ? <>
                <img src={iconUnfollwing} alt='unfollowing' />
                <span>Bỏ theo dõi</span>
               </> : <>
               <img src={iconFollowing} alt='following' />
               <span>Theo dõi</span>
                  </>}
            </Dropdown.Item> }
           
        </div>
      </ModalPopup>

      <div>
         <Modal
              open ={modelReport}
              title={intl.formatMessage(messages.titleModalReport)}
              closeText = {intl.formatMessage(messages.closeModalReport)}
              body={<div>
                  <InputSelect
                    name="type_report"
                    label={intl.formatMessage(messages.labelModalReport)}
                    value={typeReport[0]}
                    options={typeReport}
                    onChange={(e)=>dispatch(setType(e))}
                  />
                  <InputText name="details_report" value={reportSelector.details} label={intl.formatMessage(messages.detailModalReport)}  onChange={(e)=>dispatch(setDetails(e))}/>
              </div>}
              buttons={[
                <Button onClick={handlerReport} variant="primary">{intl.formatMessage(messages.submitModalReport)}</Button>,
              ]}
              
              onClose={() => {setModalReport(false)
                              dispatch(resetReport())}}
              
            />

      
      </div>
    </>
  );
}

ActionsDropdown.propTypes = {
  intl: intlShape.isRequired,
  commentOrPost: PropTypes.oneOfType([commentShape, postShape]).isRequired,
  disabled: PropTypes.bool,
  actionHandlers: PropTypes.objectOf(PropTypes.func).isRequired,
};

ActionsDropdown.defaultProps = {
  disabled: false,
};

export default injectIntl(ActionsDropdown);
