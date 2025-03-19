"use client";

import React from "react";
import { useEffect, useState } from "react";
import ArticleMain from "../../components/ArticleMain";
import { Article } from "@/lib/types";

interface ArticleData {
  id: number;
  title: string;
  content: string;
  author?: string;
  publicationDate: string;
  category?: string;
  tags?: string[];
  imageUrl?: string;
}

export default function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState(false);

  const unwrappedParams = React.use(params);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!unwrappedParams.id) return;

      const url = `${window.location.origin}/api/articles/${unwrappedParams.id}`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Article not found");
        const data = await res.json();
        console.log("Article data:", data);
        setArticle(data);
      } catch (error) {
        console.error(error);
        setError(true);
      }
    };

    fetchArticle();
  }, [unwrappedParams.id]);

  if (error) return <p>Article not found.</p>;
  if (!article) return <p>Loading…</p>;

  return (
    <ArticleMain
      title={article.title}
      content={article.content}
      author={article.author}
      publicationDate={article.publication_date}
      category={article.category}
      tags={article.tags}
      imageUrl={article.image_url}
    />
  );
}
