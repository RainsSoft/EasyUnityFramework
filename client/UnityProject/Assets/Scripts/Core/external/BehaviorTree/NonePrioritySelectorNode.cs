using UnityEngine;
using System.Collections;

namespace BehaviorTree
{
    /// <summary>
    /// 决策节点  选择-无优先级
    /// </summary>
    public class NonePrioritySelectorNode : PriortySelectorNode
    {
        public NonePrioritySelectorNode(BehaviorTreeNode rParentNode, BehaviorTreeCondition rCondition = null)
            : base(rParentNode, rCondition)
        {
        }

        protected override bool EvaluateInternal(object rInput)
        {

            if(CheckIndexSafe(mSelectIndexCur))
            {
                var rNode = mChildren[mSelectIndexCur];
                if(rNode.Evaluate(rInput))
                {
                    return true;
                }
            }
            return base.EvaluateInternal(rInput);
        }

    }
}
