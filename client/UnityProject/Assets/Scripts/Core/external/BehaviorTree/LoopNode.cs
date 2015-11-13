using UnityEngine;
using System.Collections;


namespace BehaviorTree
{
    /// <summary>
    /// 决策节点 循环
    /// </summary>
    public class LoopNode : BehaviorTreeNode
    {
        //这个变量   待修改， 静态？ 循环？？
        public  const int _infiniteLoop = -1;

        int mLoopCount;
        int mCountCur;

        public LoopNode(BehaviorTreeNode rParentNode, BehaviorTreeCondition rCondition = null, int rLoopCount = _infiniteLoop)
            : base(rParentNode, rCondition)
        {
            mLoopCount = rLoopCount;
            mCountCur = 0;
        }

        protected override bool EvaluateInternal(object rInput)
        {
            bool checkLoopCount = (mLoopCount == _infiniteLoop) || (mCountCur < mLoopCount);

            if (!checkLoopCount)
            {
                return false;
            }

            if(CheckIndexSafe(0))
            {
                var rNode = mChildren[0];
                if(rNode.Evaluate(rInput))
                {
                    return true;
                }
            }
            return false;
        }

        protected override void TransitionInternal(object rInput)
        {
            if(CheckIndexSafe(0))
            {
                var rNode = mChildren[0];
                rNode.Transition(rInput);
            }
            mCountCur = 0;
        }

        protected override NodeRunningStatus UpdateInternal(object rInput, object rOutput)
        {
            NodeRunningStatus rIsFinish = NodeRunningStatus.Finish;
            if(CheckIndexSafe(0))
            {
                var rNode = mChildren[0];
                rIsFinish = rNode.Update(rInput, rOutput);
                if (rIsFinish == NodeRunningStatus.Finish)
                {
                    if (mLoopCount != _infiniteLoop)
                    {
                        mCountCur++;
                        if(mCountCur == mLoopCount)
                        {
                            rIsFinish = NodeRunningStatus.Executing;
                        }
                    }
                    else
                    {
                        rIsFinish = NodeRunningStatus.Executing;
                    }
                }
            }

            if (rIsFinish != NodeRunningStatus.Executing)
            {
                mCountCur = 0;
            }

            return rIsFinish;
        }
    }
}