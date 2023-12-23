let clicked = false;
let spin = 0;
cc.Class({

    extends: cc.Component,

    properties: {
        myPrefabs: {
            default: [],
            type: cc.Prefab  // Drag and drop your prefabs here
        },
        myButton: cc.Button,  // Drag and drop your button here
        target: {
            default: [],
            type: cc.Node  // Drag and drop your target layouts here
        },
        winprefabs: cc.Prefab,
        winrowprefabs: cc.Prefab,

    },

    onLoad: function () {
        // Add a click event handler to the button
        this.myButton.node.on('click', this.spawnAndDrop, this);
    },

    spawn: function (prefab, position) {
        // Instantiate the prefab
        let instance = cc.instantiate(prefab);

        // Set the position of the instance
        instance.setPosition(position);

        // Add the instance to the current scene
        cc.director.getScene().addChild(instance);

        return instance;
    },

    drop: function (prefab, targetPosition) {
        // Calculate a position at the top of the screen
        let spawnPosition = new cc.Vec2(targetPosition.x, cc.winSize.height);

        // Spawn the prefab at the spawn position
        let instance = this.spawn(prefab, spawnPosition);

        // Make the prefab drop to the target position
        // You can use an action, a tween, or a physics engine to do this
        // Here's an example using cc.Tween
        cc.tween(instance)
            .to(.1, { position: targetPosition })  // 2 seconds
            .start();
    },

    spawnAndDrop: function () {
        spin++;

        const popup = cc.director.getScene().getChildByName('bigPrize');
        if (popup) {
            popup.destroy();
        }



        // Loop through all prefabs and layouts
        if (clicked == true) {
            let scene = cc.director.getScene(); // get the scene
            let children = scene.children; // get all children of the scene

            for (let i = children.length - 1; i >= 0; i--) {
                let child = children[i];
                if (child.group === 'food') { // check if the child's group is the one you want to delete
                    child.destroy(); // destroy the child
                }
            }

            const Winrow = cc.director.getScene();
            const winsign = Winrow.getChildByName('rowWin')
            if (winsign) {
                winsign.destroy();
            }
        }
        let numSet = [];
        for (let i = 0; i < this.target.length; i++) {
            let number = i;
            let random = this.rand();
            if (spin % 10 == 0) {
                random = 0
            }
            numSet.push(random);
            let targetPosition = this.target[number].getPosition();
            this.drop(this.myPrefabs[random], targetPosition);
        }

        let firstnum = numSet[0];
        let BIGPrize = true;
        for (let i = 0; i < numSet.length; i++) {
            if (numSet[i] !== firstnum) {
                BIGPrize = false;
            }
        }

        console.log(BIGPrize);

        if (BIGPrize == true) {
            let position = new cc.Vec2(15, -1024);
            this.spawn(this.winprefabs, position);
            console.log("WIN BIG PRIZE")
            
        }else{
            for (let i = 0; i < 3; i++) {
                let j = i * 5
                if (numSet[j] == numSet[j + 1] && numSet[j] == numSet[j + 2] && numSet[j] == numSet[j + 3] && numSet[j] == numSet[j + 4]) {
                    let position = new cc.Vec2(122, 23.7);
                    this.spawn(this.winrowprefabs, position);
                    console.log("WIN")
                }
    
            }
        }

        clicked = true;
        numSet = [];

    },
    rand: function () {
        let min = 0;
        let max = this.myPrefabs.length;
        let randomNumber = min + Math.random() * (max - min);
        let floor = Math.floor(randomNumber);
        return floor;
    }

});