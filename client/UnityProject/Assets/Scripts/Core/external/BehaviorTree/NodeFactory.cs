using UnityEngine;
using System.Collections;

namespace BehaviorTree
{
    /// <summary>
    /// 节点工厂
    /// </summary>
    public class NodeFactory
    {
        public BehaviorTreeNode CreateParalleNode(BehaviorTreeNode rParentNode, ParallelFinishCondition rPCondition, string rNodeName)
        {
            return new BehaviorTreeNode(rParentNode, new ConditionTrue());
        }

        public BehaviorTreeNode CreatePrioritySelectorNode(BehaviorTreeNode rParentNode, string rNodeName)
        {
            return new BehaviorTreeNode(rParentNode, new ConditionTrue());
        }

        public BehaviorTreeNode CreateNonePrioritySelectorNode(BehaviorTreeNode rParentNode, string rNodeName)
        {
            return new BehaviorTreeNode(rParentNode, new ConditionTrue());
        }
        public BehaviorTreeNode CreateSequenceNode(BehaviorTreeNode rParentNode, string rNodeName)
        {
            return new BehaviorTreeNode(rParentNode, new ConditionTrue());
        }
        public BehaviorTreeNode oCreateLoopNode(BehaviorTreeNode rParentNode, string rNodeName, int rLoopCount)
        {
            return new BehaviorTreeNode(rParentNode, new ConditionTrue());
        }
        public BehaviorTreeNode CreateActionNode(BehaviorTreeNode rParentNode, string rNodeName)
        {
            return new BehaviorTreeNode(rParentNode, new ConditionTrue());
        }


        BehaviorTreeNode CreateNodeCommon(BehaviorTreeNode rSelfNode, BehaviorTreeNode rParentNode, string rNodeName)
        {
            return new BehaviorTreeNode(rParentNode, new ConditionTrue());
        }

    }

}
