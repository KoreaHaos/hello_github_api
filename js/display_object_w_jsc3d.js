// These number are used to setup the initial placement of the object.
var xRotInitial = 0;
var yRotInitial = 180;
var zRotInitial = 0;

// These variable are the degrees per update of the animation.
var xRotAdjust = 0;
var yRotAdjust = 1;
var zRotAdjust = 0;

// These variable are used to let the user know to click.
var rotationCount = 0.0;
var displayedFirstWord = false;
var displayedFinalWords = false;

// As it says, higher numbers rotate the object slower.
var rotationLag = 10;


function displayPartOneOfMessageToUser() {
    console.log("First Bit!");
    var imgPath = "../img/clickTrans.gif";
    loadImage(imgPath);
    displayedFirstWord = true;
}

function displayPartTwoOfMessageToUser() {
    console.log("Second Bit!");
    var imgPath = "../img/as_you_pleaseTrans.gif";
    loadImage(imgPath);
    displayedFinalWords = true;

}

function loadImage(path_to_image_to_place_on_dom) {
    var img = new Image();
    $(img).load(function(){
      $('.overlayed_message').append($(this));
        //console.log("First Bit! ajaxed" + this);
    }).attr({
      src: path_to_image_to_place_on_dom
    }).error(function(){
      //do something if image cannot load
    });    
}


function show_viewer(xRotIn, yRotIn, zRotIn) {

    // Get the canvas from The Don
    var cvs = document.getElementById('object_canvas');
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;

    var viewer = new JSC3D.Viewer(cvs);

    viewer.setParameter('InitRotationX', xRotIn);
    viewer.setParameter('InitRotationY', yRotIn);
    viewer.setParameter('InitRotationZ', zRotIn);

    viewer.setParameter('ModelColor', '#1a1a1a');

    viewer.setParameter('RenderMode', 'texturesmooth');

    viewer.setBackgroudImageFromUrl('../img/GitCatsMashUp.png');
    viewer.setParameter('SceneUrl', '../obj/git_hub_logo.obj');
    
    viewer.init();

    // This bit takes care of the aniumation.
    setInterval(function() {
        viewer.rotate(xRotAdjust, yRotAdjust, zRotAdjust);
        viewer.update();
        
        // This code displays a two part message to the client.
        
        // ToDo put this into a switch...
        if (!displayedFinalWords) {
            rotationCount += 1;
        }
        
        // If the object has spun one 360 degree rotation...
        if (rotationCount > 360 && !displayedFirstWord) {
            displayPartOneOfMessageToUser();
        }
        // If the object has spun two 360 degree rotations (But not anymore)...
        if (rotationCount > 720 && displayedFirstWord && !displayedFinalWords) {
            displayPartTwoOfMessageToUser();
        }
        else if (rotationCount % 45 == 0) {
            // Uncommenting this will display objects degree.
            //console.log("degrees rotated = " + rotationCount);
        }
    }, rotationLag);
}

show_viewer(xRotInitial, yRotInitial, zRotInitial);

// That's it!
