// components/ArticleCard.tsx
import Link from "next/link";
import React from "react";

interface ArticleCardProps {
  id: number;
  title: string;
  excerpt: string;
  author?: string;
  publicationDate: string;
  imageUrl?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  excerpt,
  author,
  publicationDate,
  imageUrl,
}) => {
  return (
    <Link href={`/articles/${id}`}>
      <div className="articlecardcontainer">
        {imageUrl && (
          <img src={imageUrl} alt={title} className="articlecardimage" />
        )}
        <h2 className="articlecardheader">{title}</h2>
        <p className="articlecardexcerpt">{excerpt}</p>
        <div className="articlecardmeta">
          {author && <span>By {author} – </span>}
          {new Date(publicationDate).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
