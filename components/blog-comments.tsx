import { DiscussionEmbed } from "disqus-react";
type BlogCommentsProps = {
  post: {
    id: string;
    title: string;
  };
};

const BlogComments = ({ post }: BlogCommentsProps) => {
  const disqusShortname = 'fillippo';

  const disqusConfig = {
    url: `https://filippodesilva.vercel.app/blog/${post.id}`, // Replace with your actual domain
    identifier: post.id,
    title: post.title,
    language: 'en',
  };
  console.log(disqusConfig);

  return (
    <div style={{ marginTop: '2rem' }}>
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  );
};

export default BlogComments;