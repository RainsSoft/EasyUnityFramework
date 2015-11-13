using UnityEngine;
using System.Collections;

namespace BehaviorTree
{
    /// <summary>
    /// 决策节点 选择-有优先级
    /// </summary>
    public class PriortySelectorNode : BehaviorTreeNode
    {
        protected int mSelectIndexCur;
        protected int mSelectIndexLast;

        public PriortySelectorNode(BehaviorTreeNode rParentNode, BehaviorTreeCondition rCondition = null)
            : base(rParentNode, rCondition)
        {
            mSelectIndexCur = mSelectIndexLast = BehaviorTreeNode._invalidChildNodeIndex;
        }

        protected override bool EvaluateInternal(object rInput)
        {
            mSelectIndexCur = BehaviorTreeNode._invalidChildNodeIndex;

            for (int i = 0; i < mChildrenCount; i++ )
            {
                var rNode = mChildren[i];
                if(rNode.Evaluate(rInput))
                {
                    mSelectIndexCur = i;
                    return true;
                }
            }

            return false;
        }

        protected override void TransitionInternal(object rInput)
        {
            if(CheckIndexSafe(mSelectIndexLast))
            {
                var rNode = mChildren[mSelectIndexLast];
                rNode.Transition(rInput);
            }
            mSelectIndexLast = _invalidChildNodeIndex;
        }

        protected override NodeRunningStatus UpdateInternal(object rInput, object rOutput)
        {
            NodeRunningStatus rIsFinish = NodeRunningStatus.Finish;

            if(CheckIndexSafe(mSelectIndexCur))
            {
                if(mSelectIndexLast != mSelectIndexCur)
                {
                    if(CheckIndexSafe(mSelectIndexLast))
                    {
                        var rNode = mChildren[mSelectIndexLast];
                        rNode.Transition(rInput);
                    }
                    mSelectIndexLast = mSelectIndexCur;
                }
            }

            if(CheckIndexSafe(mSelectIndexLast))
            {
                var rNode = mChildren[mSelectIndexLast];
                rIsFinish = rNode.Update(rInput, rOutput);

                if(rIsFinish != NodeRunningStatus.Executing)
                {
                    mSelectIndexLast = _invalidChildNodeIndex;
                }

            }
            return rIsFinish;
        }
    }

}
