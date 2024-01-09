import React from 'react';
import PropTypes from 'prop-types';

import { getIn, useFormikContext } from 'formik';

import { Form, TransitionReplace } from '@edx/paragon';
import iconWarning from '../assets/Warning.svg'

function FormikErrorFeedback({ name }) {
  const {
    touched,
    errors,
  } = useFormikContext();
  const fieldTouched = getIn(touched, name);
  const fieldError = getIn(errors, name);
  
  return (
    <TransitionReplace>
      {fieldTouched && fieldError
        ? (
          <Form.Control.Feedback className='err-text' type="invalid" hasIcon={false} key={`${name}-error-feedback`}>
            <span>
              <img src={iconWarning} alt='warning' width="16px" height="16px"/>
            </span>
            <span> {fieldError}</span>
          </Form.Control.Feedback>
        )
        : (
          <React.Fragment key={`${name}-no-error-feedback`} />
        )}
    </TransitionReplace>
  );
}

FormikErrorFeedback.propTypes = {
  name: PropTypes.string.isRequired,
};

export default FormikErrorFeedback;
