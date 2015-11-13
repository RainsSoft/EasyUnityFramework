using UnityEngine;
using System.Collections;


namespace BehaviorTree
{

    /// <summary>
    /// 决策节点 并行
    /// </summary>
    public class ParallelNode : BehaviorTreeNode
    {
        ParallelFinishCondition mFinishCondition;
        NodeRunningStatus[] mChildrenStatus;

        public ParallelNode(BehaviorTreeNode rParentNode, BehaviorTreeCondition rCondition = null)
            : base(rParentNode, rCondition)
        {
            mFinishCondition = ParallelFinishCondition.OR;
            mChildrenStatus = new NodeRunningStatus[BehaviorTreeNode._maxChildNodeCount];

            for (int i = 0; i < BehaviorTreeNode._maxChildNodeCount; i++ )
            {
                mChildrenStatus[i] = NodeRunningStatus.Executing;
            }
        }

        public ParallelNode SetFinishCondition(ParallelFinishCondition rCondition)
        {
            mFinishCondition = rCondition;
            return this;
        }

        protected override bool EvaluateInternal(object rInput)
        {
            for (int i = 0; i < mChildrenCount; i++ )
            {
                var rNode = mChildren[i];
                if (mChildrenStatus[i] == NodeRunningStatus.Executing)
                {
                    if(!rNode.Evaluate(rInput))
                    {
                        return false;
                    }
                }
            }
            return true;
        }

        protected override void TransitionInternal(object rInput)
        {
            for (int i = 0; i < BehaviorTreeNode._maxChildNodeCount; i++ )
            {
                mChildrenStatus[i] = NodeRunningStatus.Executing;
            }

            for (int i = 0; i < mChildrenCount; i++ )
            {
                var rNode = mChildren[i];
                rNode.Transition(rInput);
            }
        }

        protected override NodeRunningStatus UpdateInternal(object rInput, object rOutput)
        {
            int rFinishedChildChount = 0;

            for ( int i = 0; i < mChildrenCount; i++ )
            {
                var rNode = mChildren[i];

                if(mFinishCondition == ParallelFinishCondition.OR)
                {
                    if(mChildrenStatus[i] == NodeRunningStatus.Executing)
                    {
                        mChildrenStatus[i] = rNode.Update(rInput, rOutput);
                    }

                    if(mChildrenStatus[i] != NodeRunningStatus.Executing)
                    {
                        for( int j = 0; j < BehaviorTreeNode._maxChildNodeCount; j++)
                        {
                            mChildrenStatus[i] = NodeRunningStatus.Executing;
                        }
					    return NodeRunningStatus.Finish;
                    }
                }
                else if(mFinishCondition == ParallelFinishCondition.AND)
                {
                    if (mChildrenStatus[i] == NodeRunningStatus.Executing)
                    {
                        mChildrenStatus[i] = rNode.Update(rInput, rOutput);
                    }
                    if (mChildrenStatus[i] != NodeRunningStatus.Executing)
                    {
                        rFinishedChildChount++;
                    }
                }
            }

            if (rFinishedChildChount == mChildrenCount)
            {
                for (int i = 0; i < BehaviorTreeNode._maxChildNodeCount; i++)
                {
                    mChildrenStatus[i] = NodeRunningStatus.Executing;
                }

                return NodeRunningStatus.Finish;
            }

            return NodeRunningStatus.Executing;
        }
    }

}
