import React, {
    useContext, useEffect, useRef, useState
  } from 'react';
  import PropTypes from 'prop-types';
  
  import classNames from 'classnames';
  import { Formik } from 'formik';
  import { isEmpty } from 'lodash';
  import { useDispatch, useSelector } from 'react-redux';
  import { useHistory, useLocation, useParams } from 'react-router-dom';
  import * as Yup from 'yup';
  
  import { useIntl } from '@edx/frontend-platform/i18n';
  import { AppContext } from '@edx/frontend-platform/react';
  import {
    Button, Card, Form, Spinner, StatefulButton, InputSelect, OverlayTrigger, Tooltip
  } from '@edx/paragon';
  import { Help, Post } from '@edx/paragon/icons';
  
  import { TinyMCEEditor } from '../../../components';
  import FormikErrorFeedback from '../../../components/FormikErrorFeedback';
  import PostPreviewPane from '../../../components/PostPreviewPane';
  import { useDispatchWithState } from '../../../data/hooks';
  import { selectCourseCohorts } from '../../cohorts/data/selectors';
  import { fetchCourseCohorts } from '../../cohorts/data/thunks';
  import { DiscussionContext } from '../../common/context';
  import { useCurrentDiscussionTopic } from '../../data/hooks';
  import {
    selectAnonymousPostingConfig,
    selectDivisionSettings,
    selectModerationSettings,
    selectUserHasModerationPrivileges,
    selectUserIsGroupTa,
    selectUserIsStaff,
  } from '../../data/selectors';
  import { EmptyPage } from '../../empty-posts';
  import { selectCoursewareTopics, selectNonCoursewareIds, selectNonCoursewareTopics } from '../../topics/data/selectors';
  import {
    discussionsPath, formikCompatibleHandler, isFormikFieldInvalid, useCommentsPagePath,
  } from '../../utils';
  import { hidePostEditor } from '../data';
  import { selectThread } from '../data/selectors';
  import { createNewThread, fetchThread, updateExistingThread } from '../data/thunks';
  import messages from './messages';
  import { fetchAllCourseEnroll , fetchAllCourseTopics } from '../../courses/data/thunks';
  import { useRouteMatch } from 'react-router-dom';
import { ALL_ROUTES } from '../../../data/constants';
import { history } from "@edx/frontend-platform";
import { TootlipTextTag, TootlipTextTitle } from '../../../components/TooltipText';
import iconCheck from '../../../assets/Check_Circle.svg'

const PostEditorCustom = ({editExisting, onClose})=>{
    const intl = useIntl();
    const [showTooltip, setShowTooltip] = useState(false);
    const [showTooltipTag, setShowTooltipTag] = useState(false)

    const arrTags = ['Tổng quan' , 'marketing', 'lab']
    const [selectedTags, setSelectedTags] = useState(["Tổng quan"]);

    const { authenticatedUser } = useContext(AppContext);
    const dispatch = useDispatch();
    const editorRef = useRef(null);
    const [submitting, dispatchSubmit] = useDispatchWithState();
    const history = useHistory();
    const location = useLocation();
    const commentsPagePath = useCommentsPagePath();
    const {params} = useRouteMatch(ALL_ROUTES)
    const {
      courseId,
      postId,
    } = params;

    const topicId = useCurrentDiscussionTopic();
    const nonCoursewareTopics = useSelector(selectNonCoursewareTopics);
    const nonCoursewareIds = useSelector(selectNonCoursewareIds);
    const coursewareTopics = useSelector(selectCoursewareTopics);
    const cohorts = useSelector(selectCourseCohorts);
    const post = useSelector(selectThread(postId));
    useEffect(()=>{

      if(post){
        setSelectedTags(post.tags)
      }

    },[post])
    const userHasModerationPrivileges = useSelector(selectUserHasModerationPrivileges);
    const userIsGroupTa = useSelector(selectUserIsGroupTa);
    const settings = useSelector(selectDivisionSettings);
    const { allowAnonymous, allowAnonymousToPeers } = useSelector(selectAnonymousPostingConfig);
    const { reasonCodesEnabled, editReasons } = useSelector(selectModerationSettings);
    const userIsStaff = useSelector(selectUserIsStaff);
    const { category, inContext } = useContext(DiscussionContext);
  
    const canDisplayEditReason = (reasonCodesEnabled && editExisting
      && (userHasModerationPrivileges || userIsGroupTa || userIsStaff)
      && post?.author !== authenticatedUser.username
    );
  
    const editReasonCodeValidation = canDisplayEditReason && {
      editReasonCode: Yup.string().required(intl.formatMessage(messages.editReasonCodeError)),
    };
  
    const canSelectCohort = (tId) => {
      // If the user isn't privileged, they can't edit the cohort.
      // If the topic is being edited the cohort can't be changed.
      if (!userHasModerationPrivileges) {
        return false;
      }
      if (nonCoursewareIds.includes(tId)) {
        return settings.dividedCourseWideDiscussions.includes(tId);
      }
      const isCohorting = settings.alwaysDivideInlineDiscussions || settings.dividedInlineDiscussions.includes(tId);
      return isCohorting;
    };
  
    const initialValues = {
      postType: post?.type || 'discussion',
      topic: post?.topicId || topicId || nonCoursewareTopics?.[0]?.id,
      title: post?.title || '',
      comment: post?.rawBody || '',
      follow: isEmpty(post?.following) ? true : post?.following,
      anonymous: allowAnonymous ? false : undefined,
      anonymousToPeers: allowAnonymousToPeers ? false : undefined,
      editReasonCode: post?.lastEdit?.reasonCode || (
        userIsStaff && canDisplayEditReason ? 'violates-guidelines' : undefined
      ),
      cohort: post?.cohort || 'default',
    };
  
    const hideEditor = (resetForm) => {
      resetForm({ values: initialValues });
      if (editExisting) {
        const newLocation = discussionsPath(commentsPagePath, {
          courseId,
          topicId,
          postId,
          learnerUsername: post?.author,
          category,
        })(location);
        history.push(newLocation);
      }
      dispatch(hidePostEditor());
    };
  
   
    // api course specialization
    const courseTitle = useSelector(state =>state.courseTabs.courseTitle)
    const [courseEnroll, setCourseEnroll] = useState([])
    
    const [course_id , setCourse_id ] = useState(courseId )

    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await fetchAllCourseEnroll(courseId);
          const newCourseEnroll = data.map(e => ({
            label: e.display_name,
            value: e.course_id
          }));
            if (newCourseEnroll.length == 0){
              newCourseEnroll.push({label:courseTitle , value:courseId})
            }
            setCourseEnroll(newCourseEnroll);
        } catch (error) {
          console.error(error);  
        }
      };
  
      fetchData();
    }, []);
    
  // course topics 
  const [nonCoursewareTopicsNew , setNonCoursewareTopicsNew ] = useState(nonCoursewareTopics)
  const [coursewareTopicsNew , setCoursewareTopicsNew] = useState(coursewareTopics)
  useEffect(()=>{
    const fetchData = async ()=>{
      try {
        const topic = await fetchAllCourseTopics(course_id)
        setNonCoursewareTopicsNew(topic.non_courseware_topics)
        setCoursewareTopicsNew(topic.courseware_topics)
        
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  },[course_id])
  
  
  
    // null stands for no cohort restriction ("All learners" option)
    const selectedCohort = (cohort) => (cohort === 'default' ? null : cohort);
    const submitForm = async (values, { resetForm }) => {
  
      if (editExisting) {
        await dispatchSubmit(updateExistingThread(postId, {
          topicId: values.topic,
          type: values.postType,
          title: values.title,
          content: values.comment,
          editReasonCode: values.editReasonCode || undefined,
          selectedTags : selectedTags
        }));
      } else {
        const cohort = canSelectCohort(values.topic) ? selectedCohort(values.cohort) : undefined;
        // if not allowed to set cohort, always undefined, so no value is sent to backend
        await dispatchSubmit(createNewThread({
          courseId : course_id ,
          topicId: values.topic,
          type: "question",
          title: values.title,
          content: values.comment,
          following: values.follow,
          anonymous: allowAnonymous ? values.anonymous : undefined,
          anonymousToPeers: allowAnonymousToPeers ? values.anonymousToPeers : undefined,
          cohort,
          selectedTags : selectedTags
        }));
        onClose()
      }
      /* istanbul ignore if: TinyMCE is mocked so this cannot be easily tested */
      if (editorRef.current) {
        editorRef.current.plugins.autosave.removeDraft();
      }
      hideEditor(resetForm);
  

    };
  
    useEffect(() => {
      if (userHasModerationPrivileges && isEmpty(cohorts)) {
        dispatch(fetchCourseCohorts(courseId));
      }
      if (editExisting) {
        dispatchSubmit(fetchThread(postId, courseId));
      }
    }, [courseId, editExisting]);
  
    if (editExisting && !post) {
      if (submitting) {
        return (
          <div className="m-4 card p-4 align-items-center">
            <Spinner animation="border" variant="primary" />
          </div>
        );
      }
      if (!submitting) {
        return (
          <EmptyPage
            title={intl.formatMessage(messages.noThreadFound)}
          />
        );
      }
    }
  
    const validationSchema = Yup.object().shape({
      postType: Yup.mixed()
        .oneOf(['discussion', 'question']),
      topic: Yup.string()
        .required(),
      title: Yup.string()
        .required(intl.formatMessage(messages.titleError)),
      comment: Yup.string()
        .required(intl.formatMessage(messages.commentError)),
      follow: Yup.bool()
        .default(true),
      anonymous: Yup.bool()
        .default(false)
        .nullable(),
      anonymousToPeers: Yup.bool()
        .default(false)
        .nullable(),
      cohort: Yup.string()
        .nullable()
        .default(null),
      ...editReasonCodeValidation,
    });
  
    const postEditorId = `post-editor-${editExisting ? postId : 'new'}`;
    

    const handleClick = (tag) => {
     
      const index = selectedTags.indexOf(tag);
  
      if (index === -1) {
        setSelectedTags([...selectedTags, tag]);
      } else {
        const newTags = [...selectedTags];
        newTags.splice(index, 1);
        setSelectedTags(newTags);
      }
    };
    // console.log('==================', post.tags)
    return (
        <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submitForm}
    >{
      ({
        values,
        errors,
        touched,
        handleSubmit,
        handleBlur,
        handleChange,
        resetForm,
      }) => (
        <Form className="post-form" onSubmit={handleSubmit}>
         <div className="d-flex flex-row mb-4 justify-content-between">
          <div className='container-editor position-relative w-100' >
          {showTooltip && <div className='container-tooltip' style={{height:'112px'}}>
              <TootlipTextTitle />
            </div>}
            <Form.Group
              className="w-100 m-0"
              isInvalid={isFormikFieldInvalid('title', {
                errors,
                touched,
              })}
            >
              <Form.Control
                className="m-0"
                name="title"
                type="text"
                onChange={handleChange}
                onBlur={(e)=>{
                  handleBlur(e)
                  setShowTooltip(false)
                }}
                onFocus={(e)=>{
                  setShowTooltip(true)
                }}
                aria-describedby="titleInput"
                floatingLabel={intl.formatMessage(messages.postTitle)}
                value={values.title}
              />
              <FormikErrorFeedback name="title" />
            </Form.Group>
          </div>
            {canDisplayEditReason && (
              <Form.Group
                className="w-100 ml-3 mb-0"
                isInvalid={isFormikFieldInvalid('editReasonCode', {
                  errors,
                  touched,
                })}
              >
                <Form.Control
                  name="editReasonCode"
                  className="m-0"
                  as="select"
                  value={values.editReasonCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-describedby="editReasonCodeInput"
                  floatingLabel={intl.formatMessage(messages.editReasonCode)}
                >
                  <option key="empty" value="">---</option>
                  {editReasons.map(({ code, label }) => (
                    <option key={code} value={code}>{label}</option>
                  ))}
                </Form.Control>
                <FormikErrorFeedback name="editReasonCode" />
              </Form.Group>
            )}
          </div>
          <div className="mb-2">

    <TinyMCEEditor
              onInit={
                /* istanbul ignore next: TinyMCE is mocked so this cannot be easily tested */
                (_, editor) => {
                  editorRef.current = editor;
                }
              }
              id={postEditorId}
              value={values.comment}
              onEditorChange={formikCompatibleHandler(handleChange, 'comment')}
              onBlur={formikCompatibleHandler(handleBlur, 'comment')}
              isPost
            />
            
            <FormikErrorFeedback name="comment" />
          </div>

          <div  onMouseOver={() => setShowTooltipTag(true)}  onMouseOut={() => setShowTooltipTag(false)} tabIndex={0} className=' position-relative py-3 d-flex border-bottom'>
              {showTooltipTag &&   <div className='container-tooltip' style={{height:'65px'}} >
              <TootlipTextTag />
            </div>}
            <span>Thêm thẻ :</span>
            <div className='d-flex px-2' style={{gap:'5px'}}>
             {arrTags.map((tag, index) =>{
              return (
                <div key={index}  onClick={() => handleClick(tag)}>
                  <span className={`tag-post ${selectedTags.includes(tag)  ? 'check' : ''}`} >
                  {selectedTags.includes(tag)  && <img src={iconCheck} alt='checked' />}
                    {tag}
                  </span>
                </div>
              )
             })}
     
            </div>
          </div>
          <div className="d-flex justify-content-end mt-3" style={{gap:'10px'}}>
              <button className="btn-primary-custom-outline"  onClick={() =>   history.push(`/${courseId}/posts`)}  >
                        <span>Huỷ bỏ</span>
               </button>

             <button className="btn-primary-custom " onClick={handleSubmit}  >
                      {editExisting ? <span>Chỉnh sửa</span> : <span>Tạo bài</span>}  
               </button>
          </div>
        </Form>
      )
    }
    </Formik>
    )
}

export default PostEditorCustom