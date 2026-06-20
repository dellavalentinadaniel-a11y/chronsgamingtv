import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
  type?: 'website' | 'article';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
    section?: string;
    ratingValue?: number;
    ratingMax?: number;
  };
}

export function SEO({
  title,
  description,
  imageUrl = 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=800&auto=format&fit=crop',
  url = window.location.href,
  type = 'website',
  article
}: SEOProps) {
  const siteName = 'ChronsGamingtv';
  const fullTitle = `${title} | ${siteName}`;

  // Build JSON-LD structured data
  let jsonLd: any = null;

  if (type === 'article' && article) {
    if (article.ratingValue !== undefined) {
      // Review Structured Data (Star ratings on Google!)
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Review',
        'headline': title,
        'image': [imageUrl],
        'datePublished': article.publishedTime,
        'dateModified': article.modifiedTime || article.publishedTime,
        'author': {
          '@type': 'Person',
          'name': article.author || 'Redacción ChronsGamingtv'
        },
        'publisher': {
          '@type': 'Organization',
          'name': siteName,
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=200&auto=format&fit=crop'
          }
        },
        'description': description,
        'itemReviewed': {
          '@type': 'Game',
          'name': article.section || 'Videojuego'
        },
        'reviewRating': {
          '@type': 'Rating',
          'ratingValue': article.ratingValue,
          'bestRating': article.ratingMax || 10,
          'worstRating': 1
        }
      };
    } else {
      // NewsArticle Structured Data
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        'headline': title,
        'image': [imageUrl],
        'datePublished': article.publishedTime,
        'dateModified': article.modifiedTime || article.publishedTime,
        'author': [
          {
            '@type': 'Person',
            'name': article.author || 'Redacción ChronsGamingtv'
          }
        ],
        'publisher': {
          '@type': 'Organization',
          'name': siteName,
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=200&auto=format&fit=crop'
          }
        },
        'description': description
      };
    }
  } else {
    // Website Structured Data for WebSite / Organization
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': siteName,
      'url': url,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${window.location.origin}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Dynamic structured data insertion */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
