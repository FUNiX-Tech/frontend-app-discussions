import { useState } from "react";

const PostContent = ({ previewBody, renderedBody }) => {
  const [showContent, setShowContent] = useState(false);

  const toggleShowContent = () => {
    setShowContent(!showContent);
  };

  return (
    <div>
      <span dangerouslySetInnerHTML={{ __html: showContent ? renderedBody : previewBody }} />
      {previewBody.length === 140 && (
        <span style={{cursor:'pointer'}} className="text-info" onClick={toggleShowContent}>{showContent ? 'Ẩn bớt' : 'Xem thêm'}</span>
      )}
    </div>
  );
};

export default PostContent;