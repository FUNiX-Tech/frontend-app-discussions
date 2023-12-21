import { useState } from "react";
import { Link } from "react-router-dom";

const PostContent = ({ previewBody, renderedBody }) => {
  const [showContent, setShowContent] = useState(false);

  const toggleShowContent = () => {
    setShowContent(!showContent);
  };

  return (
    <div>
      <span dangerouslySetInnerHTML={{ __html: showContent ? renderedBody : previewBody }} />
      <Link to >Xem them</Link>
    </div>
  );
};

export default PostContent;