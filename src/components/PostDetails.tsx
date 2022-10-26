import React, { useEffect, useState } from 'react';
import { addComment, deleteComment, getComments } from '../api/comments';
import { Comment, CommentData } from '../types/Comment';
import { Post } from '../types/Post';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';

type Props = {
  post: Post | null,
};

export const PostDetails: React.FC<Props> = ({
  post,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const loadComments = async () => {
    setError(false);

    if (!post) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await getComments(post.id);

      setComments(response);
    } catch {
      setError(true);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadComments();
    setOpenForm(false);
  }, [post]);

  const handleWriteCommentForm = () => {
    setOpenForm(prev => !prev);
  };

  const handleDeleteComment = async (commentId: number) => {
    setError(false);

    try {
      await deleteComment(commentId);
      setComments(
        prev => prev.filter(prevComment => prevComment.id !== commentId),
      );
    } catch {
      setError(true);
    }
  };

  const handleAddComment = async (
    newComment: CommentData,
  ) => {
    setError(false);

    try {
      const response = await addComment(post?.id, newComment);

      setComments(prev => [...prev, response]);
    } catch {
      setError(true);
    }
  };

  return (
    <div className="content" data-cy="PostDetails">
      <div className="content" data-cy="PostDetails">
        <div className="block">
          <h2 data-cy="PostTitle">
            {`#${post?.id}: ${post?.title}`}
          </h2>

          <p data-cy="PostBody">
            {post?.body}
          </p>
        </div>

        <div className="block">
          {isLoading ? <Loader /> : (
            <>
              {error && (
                <div className="notification is-danger" data-cy="CommentsError">
                  Something went wrong
                </div>
              )}

              {!isLoading
                && comments.length === 0
                && !error
                && (
                  <p className="title is-4" data-cy="NoCommentsMessage">
                    No comments yet
                  </p>
                )}

              {comments.length > 0 && <p className="title is-4">Comments:</p>}

              {comments.map(comment => (
                <article
                  key={comment.id}
                  className="message is-small"
                  data-cy="Comment"
                >
                  <div className="message-header">
                    <a href={`mailto:${comment?.email}`} data-cy="CommentAuthor">
                      {comment?.name}
                    </a>
                    <button
                      data-cy="CommentDelete"
                      type="button"
                      className="delete is-small"
                      aria-label="delete"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      delete button
                    </button>
                  </div>

                  <div className="message-body" data-cy="CommentBody">
                    {comment.body}
                  </div>
                </article>
              ))}

              {!openForm && (
                <button
                  data-cy="WriteCommentButton"
                  type="button"
                  className="button is-link"
                  onClick={handleWriteCommentForm}
                >
                  Write a comment
                </button>
              )}
            </>
          )}
        </div>

        {openForm
          && (
            <NewCommentForm
              onAddComment={handleAddComment}
            />
          )}
      </div>
    </div>
  );
};
