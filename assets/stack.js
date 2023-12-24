let clicked = false;
let spin = 0;
cc.Class({

    extends: cc.Component,

    properties: {
        myPrefabs: {
            default: [],
            type: cc.Prefab
        },
        myButton: cc.Button,
        target: {
            default: [],
            type: cc.Node
        },
        winprefabs: cc.Prefab,
        winrowprefabs: cc.Prefab,


    },

    onLoad: function () {
        // Add a click event handler to the button
        this.myButton.node.on('click', this.rolling, this);
    },

    spawn: function (prefab, position) {
        let instance = cc.instantiate(prefab);

        instance.setPosition(position);

        cc.director.getScene().addChild(instance);

        return instance;
    },

    drop: function (prefab, targetPosition) {
        // Calculate a position at the top of the screen
        let spawnPosition = new cc.Vec2(targetPosition.x, cc.winSize.height);

        let instance = cc.instantiate(prefab);
        instance.setPosition(spawnPosition);
        cc.director.getScene().getChildByName("box").addChild(instance);
        // Make the prefab drop to the target position

        cc.tween(instance)
            .to(.1, { position: targetPosition })
            .start();
    },

    spawnAndDrop: function () {
        spin++;

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

        } else {
            for (let i = 0; i < 3; i++) {
                let j = i * 5
                if (numSet[j] == numSet[j + 1] && numSet[j] == numSet[j + 2] && numSet[j] == numSet[j + 3] && numSet[j] == numSet[j + 4]) {
                    let spawnPosition = new cc.Vec2(476, -190);
                    let targetPosition = new cc.Vec2(476, 71)
                    let instance = this.spawn(this.winrowprefabs, spawnPosition);
                    cc.tween(instance)
                        .to(.1, { position: targetPosition })
                        .start();
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
    },
    rolling: function () {

        const popup = cc.director.getScene().getChildByName('bigPrize');
        if (popup) {
            popup.destroy();
        }

        // Loop through all prefabs and layouts
        if (clicked == true) {
            let scene = cc.director.getScene().getChildByName("box"); // get the scene
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


        let interval = .05;
        let repeat = 20;
        let delay = 0;
        let count = 0

        this.schedule(function () {
            // Here 'this' refers to the component

            for (let i = 0; i < 5; i++) {
                let prefabrand = this.rand();
                let aposition = this.target[i]
                let instance = cc.instantiate(this.myPrefabs[prefabrand]); // create prefab instance
                instance.parent = cc.director.getScene().getChildByName("box"); // add instance to scene

                instance.position = cc.v2(aposition.x, cc.winSize.height); // set random x and top y position

                // move action
                let moveAction = cc.moveTo(0.5, cc.v2(instance.x, -instance.height));
                instance.runAction(moveAction);

            }
            count++;
            if (count > repeat) {

                this.spawnAndDrop()
            }

        }, interval, repeat, delay);

    },


});
