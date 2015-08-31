#pragma strict
var childObject : GameObject[];
var changeObj : int = 0;
var currObjAlive: GameObject;

 
function onScrollChangeObject()
{
if (currObjAlive)
Destroy(currObjAlive);

currObjAlive = Instantiate(childObject[changeObj],transform.position,transform.rotation);
currObjAlive.name = childObject[changeObj].name;
currObjAlive.transform.parent = transform;
}


onScrollChangeObject();

 
function Update ()
{

    if (Input.GetKeyDown ("up"))
    {
    if (changeObj == 12)
        {
        changeObj = 0;
        onScrollChangeObject();

        }
    else
        {
        changeObj++;
        onScrollChangeObject();

        }
    }
   
    if (Input.GetKeyDown ("down"))
    {
    if (changeObj == 0)
        {
        changeObj = 12;
        onScrollChangeObject();
        }
    else
        {
        changeObj--;
        onScrollChangeObject();
        }
    }
}

function OnGUI(){
 GUI.Label(Rect(Screen.width/2-200,Screen.height/2-50,Screen.width,Screen.height),currObjAlive.name);
 GUI.Label(Rect(50,50,Screen.width,Screen.height),"Use the Up and Down arrow keys to change FX!");

    }