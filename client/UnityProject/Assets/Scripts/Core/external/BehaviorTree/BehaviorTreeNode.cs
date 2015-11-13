using UnityEngine;
using System.Collections;
using InputParam = System.Object;
using OutputParam = System.Object;

namespace BehaviorTree
{

    public enum NodeRunningStatus
    {
        Executing = 0,
        Finish = 1,
        TransitionError = -1,
    };

    public enum ParallelFinishCondition
    {
        OR = 1,
        AND
    };

    public enum NodeActionStaus
    {
        Ready = 1,
        Running = 2,
        Finish = 3,
    };
    
    /// <summary>
    /// 节点基类
    /// </summary>
    public class BehaviorTreeNode
    {
        public static int _maxChildNodeCount = 8;
        public static int _invalidChildNodeIndex = _maxChildNodeCount;

        protected BehaviorTreeNode mParentNode;
        protected BehaviorTreeNode mActiveNodeCur;
        protected BehaviorTreeNode mActiveNodeLast;
        protected int mChildrenCount;
        protected BehaviorTreeNode[] mChildren;

        protected BehaviorTreeCondition mCondition;

        protected string NodeName { set; get; }

        public BehaviorTreeNode(BehaviorTreeNode rParentNode, BehaviorTreeCondition rCondition = null)
        {
            NodeName = "UNNAMED";
            mChildrenCount = 0;
            mActiveNodeCur = null;
            mActiveNodeLast = null;
            mCondition = null;
            mChildren = new BehaviorTreeNode[_maxChildNodeCount];

            for( int i=0; i < _maxChildNodeCount; i++ )
            {
                mChildren[i] = null;
            }

            SetParentNode(rParentNode);
            SetExternalCondition(rCondition);
        }

        public BehaviorTreeNode AddChildNode(BehaviorTreeNode rNode)
        {
            if(mChildrenCount >= _maxChildNodeCount)
            {
                Debug.Log("children count up to max value:> " + NodeName);
                return this;
            }
            mChildren[mChildrenCount] = rNode;
            mChildrenCount++;
            return this;
        }

        public BehaviorTreeNode SetExternalCondition(BehaviorTreeCondition rCondition)
        {
            if (mCondition != rCondition)
            {
                if (mCondition != null) mCondition = null;
                mCondition = rCondition;
            }
            return this;
        }

        public void SetActiveNode(BehaviorTreeNode rNode)
        {
            mActiveNodeLast = mActiveNodeCur;
            mActiveNodeCur = rNode;
            if (mParentNode != null) mParentNode.SetActiveNode(rNode);
        }

        public BehaviorTreeNode GetActiveNodeLast()
        {
            return mActiveNodeLast;
        }

        public bool Evaluate(InputParam rInput)
        {
            return (mCondition == null || mCondition.ExternalCondition(rInput)) &&
                EvaluateInternal(rInput);
        }

        public void Transition(InputParam rInput)
        {
            TransitionInternal(rInput);
        }

        public NodeRunningStatus Update(InputParam rInput, OutputParam rOutput)
        {
            return UpdateInternal(rInput, rOutput);
        }

        protected virtual bool EvaluateInternal(InputParam rInput)
        {
            return true;
        }

        protected virtual NodeRunningStatus UpdateInternal(InputParam rInput, OutputParam rOutput)
        {
            return NodeRunningStatus.Finish;
        }

        protected virtual void TransitionInternal(InputParam rInput) { }

        protected void SetParentNode(BehaviorTreeNode rParentNode)
        {
            if (rParentNode == null) return;
            mParentNode = rParentNode;
        }

        protected bool CheckIndexSafe(int rIndex)
        {
            return rIndex >= 0 && rIndex < mChildrenCount;
        }
    }
}
