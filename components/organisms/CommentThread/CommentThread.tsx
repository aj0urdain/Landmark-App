import { CommentWithReactions } from '@/queries/articles/types';
import { CommentItem } from '@/components/molecules/CommentItem/CommentItem';
import { Separator } from '@/components/ui/separator';
import { StaggeredAnimation } from '@/components/atoms/StaggeredAnimation/StaggeredAnimation';

const organizeComments = (
  comments: CommentWithReactions[],
  commentMap: Record<string, CommentWithReactions>,
) => {
  const rootComments: CommentWithReactions[] = [];
  const replyGroups: Record<string, CommentWithReactions[]> = {};

  // First pass: identify root comments and create reply groups
  comments.forEach((comment) => {
    if (!comment.parent_id) {
      rootComments.push(commentMap[comment.id]);
      replyGroups[comment.id] = [];
    }
  });

  // Second pass: organize replies into groups
  comments.forEach((comment) => {
    if (comment.parent_id) {
      const parentComment = commentMap[comment.parent_id];
      const rootParent = findRootParent(comment.parent_id, commentMap);

      // Only proceed if we found both the parent comment and root parent
      if (rootParent && parentComment) {
        // If replying to root comment, add directly to its replies
        if (comment.parent_id === rootParent.id) {
          if (!rootParent.replies) rootParent.replies = [];
          rootParent.replies.push({
            ...commentMap[comment.id],
            replyingToId: comment.parent_id,
          });
        } else {
          // If replying to a reply, add it after its parent
          if (!parentComment.replies) parentComment.replies = [];
          parentComment.replies.push({
            ...commentMap[comment.id],
            replyingToId: comment.parent_id,
          });
        }
      }
    }
  });

  // Sort root comments by creation date
  rootComments.sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  // Sort replies within each group by creation date
  rootComments.forEach((comment) => {
    if (comment.replies) {
      comment.replies.sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
    }
  });

  return rootComments;
};

const findRootParent = (
  commentId: string,
  commentMap: Record<string, CommentWithReactions>,
): CommentWithReactions | null => {
  const comment = commentMap[commentId];

  // Return null if comment doesn't exist in the map
  if (!comment) return null;

  if (comment.parent_id == null) return comment;
  return findRootParent(comment.parent_id, commentMap);
};

const flattenReplies = (comment: CommentWithReactions): CommentWithReactions[] => {
  const result: CommentWithReactions[] = [];

  if (comment.replies) {
    comment.replies.forEach((reply) => {
      result.push(reply);
      if (reply.replies) {
        result.push(...flattenReplies(reply));
      }
    });
  }

  return result;
};

const scrollToComment = (commentId: string) => {
  const commentElement = document.getElementById(`comment-${commentId}`);
  if (commentElement) {
    commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

export const CommentThread = ({ comments }: { comments: CommentWithReactions[] }) => {
  const commentMap: Record<string, CommentWithReactions> = {};
  comments.forEach((comment) => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  const organizedComments = organizeComments(comments, commentMap);

  return (
    <div className="space-y-4">
      {organizedComments.map((comment, index) => (
        <div key={comment.id} className="">
          <CommentItem comment={comment} commentMap={commentMap} />
          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-8 space-y-0">
              {flattenReplies(comment).map((reply, index) => (
                <StaggeredAnimation index={index} key={reply.id}>
                  <CommentItem key={reply.id} comment={reply} commentMap={commentMap} />
                </StaggeredAnimation>
              ))}
            </div>
          )}
          {index !== organizedComments.length - 1 && <Separator className="my-8" />}
        </div>
      ))}
    </div>
  );
};
