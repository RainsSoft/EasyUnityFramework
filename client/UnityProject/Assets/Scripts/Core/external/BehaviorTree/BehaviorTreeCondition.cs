using UnityEngine;
using System.Collections;
using InputParam = System.Object;
using OutputParam = System.Object;


/// <summary>
/// 决策条件
/// </summary>
namespace BehaviorTree
{
    public abstract class BehaviorTreeCondition
    {
        public abstract bool ExternalCondition(InputParam rInput);
    }


    public class ConditionTrue : BehaviorTreeCondition
    {
        public override bool ExternalCondition(OutputParam rInput)
        {
            return true;
        }
    }

    public class ConditionFalse : BehaviorTreeCondition
    {
        public override bool ExternalCondition(OutputParam rInput)
        {
            return false;
        }
    }

    public class ConditionNot : BehaviorTreeCondition
    {
        BehaviorTreeCondition mOperand;

        public ConditionNot(BehaviorTreeCondition rOperand)
        {
            mOperand = rOperand;
        }

        public override bool ExternalCondition(OutputParam rInput)
        {
            return !mOperand.ExternalCondition(rInput);
        }
    }

    public class ConditionAnd : BehaviorTreeCondition
    {
        BehaviorTreeCondition mOperandL;
        BehaviorTreeCondition mOperandR;

        public ConditionAnd(BehaviorTreeCondition rOperandL, BehaviorTreeCondition rOperandR)
        {
            mOperandL = rOperandL;
            mOperandR = rOperandR;
        }

        public override bool ExternalCondition(OutputParam rInput)
        {
            return mOperandL.ExternalCondition(rInput) && mOperandR.ExternalCondition(rInput);
        }
    }

    public class ConditionOr : BehaviorTreeCondition
    {
        BehaviorTreeCondition mOperandL;
        BehaviorTreeCondition mOperandR;

        public ConditionOr(BehaviorTreeCondition rOperandL, BehaviorTreeCondition rOperandR)
        {
            mOperandL = rOperandL;
            mOperandR = rOperandR;
        }

        public override bool ExternalCondition(OutputParam rInput)
        {
            return mOperandL.ExternalCondition(rInput) || mOperandR.ExternalCondition(rInput);
        }
    }

    public class ConditionXor : BehaviorTreeCondition
    {
        BehaviorTreeCondition mOperandL;
        BehaviorTreeCondition mOperandR;

        public ConditionXor(BehaviorTreeCondition rOperandL, BehaviorTreeCondition rOperandR)
        {
            mOperandL = rOperandL;
            mOperandR = rOperandR;
        }

        public override bool ExternalCondition(OutputParam rInput)
        {
            return mOperandL.ExternalCondition(rInput) ^ mOperandR.ExternalCondition(rInput);
        }
    }

}
