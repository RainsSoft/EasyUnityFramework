using UnityEngine;
using System.Collections;

namespace BehaviorTree
{
    /// <summary>
    /// 决策节点 序列
    /// </summary>
    public class SequenceNode : BehaviorTreeNode
    {
        int mNodeIndexCur;
        public SequenceNode(BehaviorTreeNode rParentNode, BehaviorTreeCondition rCondition = null)
            : base(rParentNode, rCondition)
        {
            mNodeIndexCur = BehaviorTreeNode._invalidChildNodeIndex;
        }

        protected override bool EvaluateInternal(object rInput)
        {
            int rIndex;
            if(mNodeIndexCur == BehaviorTreeNode._invalidChildNodeIndex)
            {
                rIndex = 0;
            }
            else
            {
                rIndex = mNodeIndexCur;
            }

            if (CheckIndexSafe(rIndex))
            {
                var rNode = mChildren[rIndex];
                if(rNode.Evaluate(rInput))
                {
                    return true;
                }
            }
            return false;
        }

        protected override void TransitionInternal(object rInput)
        {
            if(CheckIndexSafe(mNodeIndexCur))
            {
                var rNode = mChildren[mNodeIndexCur];
                rNode.Transition(rInput);
            }
            mNodeIndexCur = BehaviorTreeNode._invalidChildNodeIndex;
        }

        protected override NodeRunningStatus UpdateInternal(object rInput, object rOutput)
        {
            NodeRunningStatus rIsFinish = NodeRunningStatus.Finish;

            if (mNodeIndexCur == BehaviorTreeNode._invalidChildNodeIndex)
                mNodeIndexCur = 0;

            var rNode = mChildren[mNodeIndexCur];
            rIsFinish = rNode.Update(rInput, rOutput);

            if(rIsFinish == NodeRunningStatus.Finish)
            {
                mNodeIndexCur++;

                if(mNodeIndexCur == mChildrenCount)
                {
                    mNodeIndexCur = BehaviorTreeNode._invalidChildNodeIndex;
                }
                else
                {
                    rIsFinish = NodeRunningStatus.Executing;
                }
            }

            if(rIsFinish == NodeRunningStatus.TransitionError)
            {
                mNodeIndexCur = BehaviorTreeNode._invalidChildNodeIndex;
            }

            return rIsFinish;

        }
    }
}

