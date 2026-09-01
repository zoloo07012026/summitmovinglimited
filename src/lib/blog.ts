import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** The entry id is the filename, so the slug is stable across edits. */
export const postHref = (post: Post) => `/blog/${post.id}/`;

export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    // Without this the date shifts a day west of UTC and posts appear to
    // publish the day before they were dated.
    timeZone: 'UTC',
  });

/**
 * Published posts, newest first.
 *
 * Drafts are filtered here rather than hidden with CSS, so a draft has no
 * route, no entry in the sitemap and no presence in `dist/` at all.
 */
export async function publishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
