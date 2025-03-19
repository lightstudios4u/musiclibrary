import React from "react";

interface ArticleProps {
  title: string;
  content: string;
  author?: string;
  publicationDate: string;
  category?: string;
  tags?: string[];
  imageUrl?: string;
}

const ArticleMain: React.FC<ArticleProps> = ({
  title,
  content,
  author,
  publicationDate,
  category,
  tags,
  imageUrl,
}) => {
  return (
    <div className="articlecard">
      {imageUrl && (
        <img src={imageUrl} alt={title} className="articlecardimage" />
      )}
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      {author && (
        <p className="text-sm text-gray-600 mb-2">
          By {author} — {new Date(publicationDate).toLocaleDateString()}
        </p>
      )}
      {category && (
        <span className="text-blue-500 text-sm font-medium">{category}</span>
      )}
      <div
        className="prose max-w-none mt-4"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {/* {tags && (
        <div className="mt-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-block bg-gray-200 text-gray-700 text-xs font-medium mr-2 px-2.5 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default ArticleMain;
