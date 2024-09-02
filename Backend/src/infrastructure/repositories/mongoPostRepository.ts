import Post from "../database/dbmodel/postModel"; 

export const getPosts = async (vendorId: string) => {
    try {
      const posts = await Post.find({ vendorId }).populate('vendorId');
      return posts;
    } catch (error) {
      console.error('Error fetching posts by vendor ID:', error);
      throw new Error('Failed to fetch posts');
    }
}

