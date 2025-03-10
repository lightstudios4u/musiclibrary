import React from "react";

type Comment = {
  user: string;
  text: string;
};

type RelatedItem = {
  title: string;
  link: string;
  creator: string;
};

type PageTemplateProps = {
  title: string;
  description?: string;
  creator: string;
  content: React.ReactNode;
  comments: Comment[];
  relatedItems: RelatedItem[];
};

const PageTemplate: React.FC<PageTemplateProps> = ({
  title,
  description,
  creator,
  content,
  comments,
  relatedItems,
}) => {
  return (
    <div className="page-template">
      {/* Header Section */}
      <div className="header">
        <h1>{title}</h1>
        <p className="creator">
          Created by <strong>{creator}</strong>
        </p>
        {description && <p className="description">{description}</p>}
      </div>

      {/* Main Content Section */}
      <div className="content">{content}</div>

      {/* Comments Section */}
      <div className="comments-section">
        <h2>Discussion</h2>
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            <strong>{comment.user}:</strong>
            <p>{comment.text}</p>
          </div>
        ))}
      </div>

      {/* Related Items Section */}
      <div className="related-items">
        <h2>Other Tracks Like This</h2>
        <ul>
          {relatedItems.map((item, index) => (
            <li key={index}>
              <a href={item.link}>{item.title}</a> – {item.creator}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PageTemplate;
