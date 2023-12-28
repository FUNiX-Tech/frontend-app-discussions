import { useState } from "react";
import { Link } from "react-router-dom";

const PostContent = ({courseId, postId, previewBody, renderedBody }) => {
  const [showContent, setShowContent] = useState(false);

  const toggleShowContent = () => {
    setShowContent(!showContent);
  };

  return (
    <div>
      <span dangerouslySetInnerHTML={{ __html: showContent ? renderedBody : previewBody }} />
      <Link className="p-2" to={`/${courseId}/posts/${postId}`} >xem thêm</Link>
    </div>
  );
};

export default PostContent;