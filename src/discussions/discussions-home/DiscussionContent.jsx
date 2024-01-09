import React from 'react';

import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router';

import { injectIntl } from '@edx/frontend-platform/i18n';

import { Routes } from '../../data/constants';
import { CommentsView } from '../comments';
import { PostEditor } from '../posts';
import PostEditorCustom from '../posts/post-editor/PostEditorCustom';

function DiscussionContent() {
  const postEditorVisible = useSelector((state) => state.threads.postEditorVisible);

  return (
    <div className='container' style={{maxWidth:'700px'}}>
      <div className="d-flex flex-column ">
        {postEditorVisible ? (
          <Route path={Routes.POSTS.NEW_POST}>
            <PostEditor />
          </Route>
        ) : (
          <Switch>
            <Route path={Routes.POSTS.EDIT_POST}>
              <PostEditorCustom editExisting />
            </Route>
            <Route path={Routes.COMMENTS.PATH}>
              <CommentsView />
            </Route>
          </Switch>
        )}
      </div>
    </div>
  );
}

export default injectIntl(DiscussionContent);
