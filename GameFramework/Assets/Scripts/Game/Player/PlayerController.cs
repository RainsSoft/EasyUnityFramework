using UnityEngine;
using System.Collections;
using DG.Tweening;
public class PlayerController : MonoBehaviour {

	public float moveSpeed;
	public float turnSpeed;

	private Vector3 moveDirection;

    bool isAttacking = false;

	void Start ()
    {
		moveDirection = Vector3.zero;
	}



    void FixedUpdate()
    {


		//Vector3 currentPosition = transform.position;

		if( Input.GetButton("Fire1") ) 
        {
            Vector3 currentPosition = transform.position;
			Vector3 moveToward = Camera.main.ScreenToWorldPoint( Input.mousePosition );
            moveToward.z = 0;
            var moveD = moveToward - currentPosition;
            var time = moveD.magnitude / moveSpeed;
            transform.DOLocalMove(moveToward, time).SetEase(Ease.OutExpo);

          //  moveToward.
                //Vector3.Lerp(currentPosition, moveToward, Time.deltaTime);
			//moveDirection = moveToward - currentPosition;
			//moveDirection.z = 0; 
			//moveDirection.Normalize();
		}

		//Vector3 target = moveDirection * moveSpeed + currentPosition;
		//transform.position = Vector3.Lerp( currentPosition, target, Time.deltaTime );


        /*
		float targetAngle = Mathf.Atan2(moveDirection.y, moveDirection.x) * Mathf.Rad2Deg;
		transform.rotation = 
			Quaternion.Slerp( transform.rotation, 
			                 Quaternion.Euler( 0, 0, targetAngle ), 
			                 turnSpeed * Time.deltaTime );
         * */
	}
}
