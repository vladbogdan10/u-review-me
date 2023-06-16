import { GetServerSideProps } from 'next';
import PostRepository from '../../../../repository/PostRepository';

// Just for redirecting to post
function Index() {
  return <p>You will be redirected shortly...</p>;
}

export default Index;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const urlId = params?.urlId as string;

  try {
    const postRepository = new PostRepository();
    const post = await postRepository.getPostByUrlId(urlId);

    if (!post) {
      throw new Error(`No article found for urlId: ${urlId}`);
    }

    return {
      redirect: {
        permanent: false,
        destination: `/${post.category}/${post.subcategory}/${post.urlId}/${post.slug}`,
      },
    };
  } catch (error) {
    console.error(error);

    return { notFound: true };
  }
};
