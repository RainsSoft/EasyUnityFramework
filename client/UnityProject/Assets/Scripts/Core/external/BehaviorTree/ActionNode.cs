using UnityEngine;
using System.Collections;
using InputParam = System.Object;
using OutputParam = System.Object;

namespace BehaviorTree
{
    /// <summary>
    /// 行为节点
    /// </summary>
    public class ActionNode : BehaviorTreeNode
    {
        NodeActionStaus mActionStatus;
        bool mNeedExit;

        public ActionNode(BehaviorTreeNode rParentNode, BehaviorTreeCondition rCondtion = null)
            : base(rParentNode, rCondtion)
        {
            mActionStatus = NodeActionStaus.Ready;
            mNeedExit = false;
        }

        protected virtual void Enter(InputParam rInput) { }

        protected virtual void Exit(InputParam rInput, NodeRunningStatus rExitID) { }

        protected virtual NodeRunningStatus Execute(InputParam rInput, OutputParam rOutput)
        {
            return NodeRunningStatus.Finish;
        }


        protected override void TransitionInternal(OutputParam rInput)
        {
            if (mNeedExit) Exit(rInput, NodeRunningStatus.TransitionError);

            SetActiveNode(null);
            mActionStatus = NodeActionStaus.Ready;
            mNeedExit = false;
        }

        protected override NodeRunningStatus UpdateInternal(OutputParam rInput, OutputParam rOutput)
        {
            NodeRunningStatus rIsFinish = NodeRunningStatus.Finish;

            if (mActionStatus == NodeActionStaus.Ready)
            {
                Enter(rInput);
                mNeedExit = true;
                mActionStatus = NodeActionStaus.Running;
                SetActiveNode(this);
            }

            if (mActionStatus == NodeActionStaus.Running)
            {
                rIsFinish = Execute(rInput, rOutput);
                SetActiveNode(this);
                if(rIsFinish != NodeRunningStatus.Executing)
                {
                    mActionStatus = NodeActionStaus.Finish;
                }
            }

            if (mActionStatus == NodeActionStaus.Finish)
            {

                if (mNeedExit) Exit(rInput, rIsFinish);
                mActionStatus = NodeActionStaus.Ready;
                mNeedExit = false;
                SetActiveNode(null);

                return rIsFinish;
            }

            return rIsFinish;
        }
    }
}