(function () {
    'use strict';
    
    /*global angular */
    /*global createjs */
    angular.module('Common')
        .directive('teethGraph', function () {
            return {
                restict: 'E',
                scope: {
                    readonly: '=',
                    state: '=',
                    width: '@'
                },
                replace: true,
                template: '<canvas width="{{width}}" height="200"></canvas>',
                link: function (scope, element, attr) {
                    var hasBeenInit = false,
                        tooth = [];

                    function Init() {

                        var update = false,
                            moveOffset = 5,
                            readOnly = scope.readonly,
                            canvas = element[0],
                            stage = new createjs.Stage(canvas);
                        stage.enableMouseOver(10);
                        createjs.Ticker.setFPS(24);

                        // Create a new Text object and a rectangle Shape object, and position them inside a container:
                        var container = new createjs.Container();
                        container.x = 100;
                        container.y = 100;

                        function PartBase(teethId, stage) {
                            this.teethId = teethId;
                            this.stateSymbol = ["H", "I", "O", "F"];
                            /*if (undefined !== scope.state[this.teethId] &&
                                    undefined !== scope.state[this.teethId].details &&
                                    undefined !== scope.state[this.teethId].details[this.elementId]) {
                                var sym = scope.state[this.teethId].details[this.elementId];
                                this.currentState = this.stateSymbol.indexOf(sym);
                                if (this.currentState === undefined || this.currentState === null) {
                                    this.currentState = 0;
                                }
                            }*/
                            this.stage = stage;
                            
                            this.colors = ["#FFF", "#F33", "#3F3", "#33F"];
                            this.target = new createjs.Shape();
                            this.target.scaleX = this.target.scaleY = this.target.scale = 1;
                            this.Draw();

                            /*global bind */
                            this.target.addEventListener("click", bind(this, this.OnClick));
                            this.target.addEventListener("rollover", bind(this, this.OnMouseOverIn));
                            this.target.addEventListener("rollout", bind(this, this.OnMouseOverOut));

                            function bind(scope, fn) {
                                return function () {
                                    return fn.apply(scope, arguments);
                                };
                            }

                        }

                        PartBase.prototype.SetState = function (newStateSymbol) {
                            var newState = this.stateSymbol.indexOf(newStateSymbol);
                            if (-1 === newState) {
                                newState = 0;
                            }
                            this.currentState = newState;
                            if (undefined === scope.state[this.teethId].details) {
                                scope.state[this.teethId].details = [];
                            }
                            scope.state[this.teethId].details[this.elementId] = this.stateSymbol[this.currentState];
                        };

                        PartBase.prototype.GetState = function () {
                            return this.stateSymbol[this.currentState];
                        };
                        
                        PartBase.prototype.UpdateCurrentStateBeforeDraw = function () {
                            if (undefined !== scope.state[this.teethId] && null !== scope.state[this.teethId] &&
                                    undefined !== scope.state[this.teethId].details &&
                                    undefined !== scope.state[this.teethId].details[this.elementId]) {
                                var sym = scope.state[this.teethId].details[this.elementId];
                                this.currentState = this.stateSymbol.indexOf(sym);
                                
                            }
                            if (this.currentState === undefined || this.currentState === null) {
                                this.currentState = 0;
                            }
                        };

                        PartBase.prototype.OnClick = function () {
                            if (readOnly) {
                                return;
                            }
                            this.currentState++;
                            if (this.colors.length === this.currentState) {
                                this.currentState = 0;
                            }
                            this.SetState(this.stateSymbol[this.currentState]);
                            
                            this.Draw();
                            update = true;
                        };

                        PartBase.prototype.OnMouseOverIn = function () {
                        };

                        PartBase.prototype.OnMouseOverOut = function () {
                        };

                        PartBase.prototype.addStage = function (container) {
                            container.addChild(this.target);
                        };

                        function PartOneMolar(teethId, stage) {
                            this.elementId = 1;
                            PartBase.call(this, teethId, stage);
                        }

                        PartOneMolar.prototype = Object.create(PartBase.prototype);

                        PartOneMolar.prototype.Draw = function () {
                            this.UpdateCurrentStateBeforeDraw();
                            this.target.graphics.clear();
                            this.target.graphics.beginStroke("black")
                                .beginFill(this.colors[this.currentState])
                                .lineTo(30, 30)
                                .lineTo(30, 70)
                                .lineTo(0, 100)
                                .lineTo(0, 0)
                                .closePath();
                            stage.update();
                        };

                        PartOneMolar.prototype.OnMouseOverIn = function (evt) {
                            if (readOnly) {
                                return;
                            }
                            var o = evt.target;
                            o.x = o.x - moveOffset;
                            update = true;
                        };

                        PartOneMolar.prototype.OnMouseOverOut = function (evt) {
                            if (readOnly) {
                                return;
                            }
                            var o = evt.target;
                            o.x = o.x + moveOffset;
                            update = true;
                        };

                        function PartTwoMolar(teethId, stage) {
                            this.elementId = 2;
                            PartBase.call(this, teethId, stage);
                        }

                        PartTwoMolar.prototype = Object.create(PartBase.prototype);

                        PartTwoMolar.prototype.Draw = function () {
                            this.UpdateCurrentStateBeforeDraw();
                            this.target.graphics.beginStroke("black")
                                .beginFill(this.colors[this.currentState])
                                .lineTo(100, 0)
                                .lineTo(70, 30)
                                .lineTo(70, 70)
                                .lineTo(100, 100)
                                .closePath();
                            update = true;
                        };

                        PartTwoMolar.prototype.OnMouseOverIn = function (evt) {
                            if (readOnly) {
                                return;
                            }
                            var o = evt.target;
                            o.x = o.x + moveOffset;
                            update = true;
                        };

                        PartTwoMolar.prototype.OnMouseOverOut = function (evt) {
                            if (readOnly) {
                                return;
                            }
                            var o = evt.target;
                            o.x = o.x - moveOffset;
                            update = true;
                        };


                        function PartThreeMolar(teethId, stage) {
                            this.elementId = 3;
                            PartBase.call(this, teethId, stage);
                        }

                        PartThreeMolar.prototype = Object.create(PartBase.prototype);

                        PartThreeMolar.prototype.Draw = function () {
                            this.UpdateCurrentStateBeforeDraw();
                            this.target.graphics.beginStroke("black")
                                .beginFill(this.colors[this.currentState])
                                .lineTo(0, 0)
                                .lineTo(30, 30)
                                .lineTo(70, 30)
                                .lineTo(100, 0)
                                .closePath();
                        };

                        PartThreeMolar.prototype.OnMouseOverIn = function (evt) {
                            if (readOnly) {
                                return;
                            }
                            var o = evt.target;
                            o.y = o.y - moveOffset;
                            update = true;
                        };

                        PartThreeMolar.prototype.OnMouseOverOut = function (evt) {
                            if (readOnly) {
                                return;
                            }
                            var o = evt.target;
                            o.y = o.y + moveOffset;
                            update = true;
                        };

                        function PartFourMolar(teethId, stage) {
                            this.elementId = 4;
                            PartBase.call(this, teethId, stage);
                        }

                        PartFourMolar.prototype = Object.create(PartBase.prototype);

                        PartFourMolar.prototype.Draw = function () {
                            this.UpdateCurrentStateBeforeDraw();
                            this.target.graphics.beginStroke("black")
                                .beginFill(this.colors[this.currentState])
                                .lineTo(0, 100)
                                .lineTo(30, 70)
                                .lineTo(70, 70)
                                .lineTo(100, 100)
                                .closePath();
                        };

                        PartFourMolar.prototype.OnMouseOverIn = function (evt) {
                            if (readOnly) {
                                return;
                            }
                            var o = evt.target;
                            o.y = o.y + moveOffset;
                            update = true;
                        };

                        PartFourMolar.prototype.OnMouseOverOut = function (evt) {
                            if (readOnly) {
                                return;
                            }
                            var o = evt.target;
                            o.y = o.y - moveOffset;
                            update = true;
                        };


                        function PartFiveMolar(teethId, stage) {
                            this.elementId = 5;
                            PartBase.call(this, teethId, stage);
                        }

                        PartFiveMolar.prototype = Object.create(PartBase.prototype);

                        PartFiveMolar.prototype.Draw = function () {
                            this.UpdateCurrentStateBeforeDraw();
                            this.target.graphics.beginStroke("black")
                                .beginFill(this.colors[this.currentState])
                                .lineTo(30, 30)
                                .lineTo(30, 70)
                                .lineTo(70, 70)
                                .lineTo(70, 30)
                                .closePath();
                        };

                        PartFiveMolar.prototype.OnMouseOverIn = function () {
                            if (readOnly) {
                                return;
                            }
                            update = true;
                        };

                        PartFiveMolar.prototype.OnMouseOverOut = function () {
                            if (readOnly) {
                                return;
                            }
                            update = true;
                        };



                        function PartOne(teethId, stage) {
                            this.elementId = 1;
                            PartBase.call(this, teethId, stage);
                        }

                        PartOne.prototype = Object.create(PartBase.prototype);

                        PartOne.prototype.Draw = function () {
                            this.UpdateCurrentStateBeforeDraw();
                            this.target.graphics.beginStroke("black")
                                .beginFill(this.colors[this.currentState])
                                .lineTo(40, 50)
                                .lineTo(0, 100)
                                .lineTo(0, 0)
                                .closePath();
                        };

                        PartOne.prototype.OnMouseOverIn = function (evt) {
                            if (readOnly) {
                                return;
                            }
                            var o = evt.target;
                            o.x = o.x - moveOffset;
                            update = true;
                        };

                        PartOne.prototype.OnMouseOverOut = function (evt) {
                            if (readOnly) {
                                return;
                            }
                            var o = evt.target;
                            o.x = o.x + moveOffset;
                            update = true;
                        };


                        function PartTwo(teethId, stage) {
                            this.elementId = 2;
                            PartBase.call(this, teethId, stage);
                        }

                        PartTwo.prototype = Object.create(PartBase.prototype);

                        PartTwo.prototype.Draw = function () {
                            this.UpdateCurrentStateBeforeDraw();
                            this.target.graphics.beginStroke("black")
                                .beginFill(this.colors[this.currentState])
                                .lineTo(100, 0)
                                .lineTo(60, 50)
                                .lineTo(40, 50)
                                .lineTo(0, 0)
                                .closePath();
                        };

                        PartTwo.prototype.OnMouseOverIn = function (evt) {
                            if (readOnly) {
                                return;
                            }
                            var o = evt.target;
                            o.y = o.y - moveOffset;
                            update = true;
                        };

                        PartTwo.prototype.OnMouseOverOut = function (evt) {
                            if (readOnly) {
                                return;
                            }
                            var o = evt.target;
                            o.y = o.y + moveOffset;
                            update = true;
                        };


                        function PartThree(teethId, stage) {
                            this.elementId = 3;
                            PartBase.call(this, teethId, stage);
                        }

                        PartThree.prototype = Object.create(PartBase.prototype);

                        PartThree.prototype.Draw = function () {
                            this.UpdateCurrentStateBeforeDraw();
                            this.target.graphics.beginStroke("black")
                                .beginFill(this.colors[this.currentState])
                                .lineTo(100, 0)
                                .lineTo(60, 50)
                                .lineTo(100, 100)
                                .closePath();
                        };

                        PartThree.prototype.OnMouseOverIn = function (evt) {
                            if (readOnly) {
                                return;
                            }
                            var o = evt.target;
                            o.x = o.x + moveOffset;
                            update = true;
                        };

                        PartThree.prototype.OnMouseOverOut = function (evt) {
                            if (readOnly) {
                                return;
                            }
                            var o = evt.target;
                            o.x = o.x - moveOffset;
                            update = true;
                        };



                        function PartFour(teethId, stage) {
                            this.elementId = 4;
                            PartBase.call(this, teethId, stage);
                        }

                        PartFour.prototype = Object.create(PartBase.prototype);

                        PartFour.prototype.Draw = function () {
                            this.UpdateCurrentStateBeforeDraw();
                            this.target.graphics.beginStroke("black")
                                .beginFill(this.colors[this.currentState])
                                .lineTo(0, 100)
                                .lineTo(100, 100)
                                .lineTo(60, 50)
                                .lineTo(40, 50)
                                .closePath();
                        };

                        PartFour.prototype.OnMouseOverIn = function (evt) {
                            if (readOnly) {
                                return;
                            }
                            var o = evt.target;
                            o.y = o.y + moveOffset;
                            update = true;
                        };

                        PartFour.prototype.OnMouseOverOut = function (evt) {
                            if (readOnly) {
                                return;
                            }
                            var o = evt.target;
                            o.y = o.y - moveOffset;
                            update = true;
                        };


                        function FrontTeeth(teethNumber, stage, x, y) {
                            this.x = x;
                            this.y = y;
                            this.teethState = 0;
                            this.generalContainer = new createjs.Container();
                            this.teethId = teethNumber;
                            var txt = new createjs.Text(teethNumber, "24px Verdana", "black");
                            txt.x = 135 + x;
                            txt.y = 77 + y;
                            this.generalContainer.addChild(txt);

                            this.Draw();


                            this.menuContainer = new createjs.Container();
                            this.menuContainer.x = x;
                            this.menuContainer.y = y;
                            var menuBox = new createjs.Shape();
                            menuBox.graphics.beginStroke("black").beginFill("white")
                                .drawRoundRectComplex(5, 5, 430, 70, 5, 5, 5, 5).endStroke();

                            var removeTeethMenuItem = new createjs.Shape();
                            removeTeethMenuItem.graphics.beginStroke("black").beginFill("white")
                                .drawRoundRectComplex(15, 15, 50, 50, 5, 5, 5, 5).endStroke();
                            removeTeethMenuItem.graphics.beginStroke("red")
                                    .setStrokeStyle(2)
                                    .moveTo(15, 15)
                                    .lineTo(65, 65)
                                    .moveTo(15, 65)
                                    .lineTo(65, 15).endStroke();
                            removeTeethMenuItem.addEventListener("click", bind(this, this.OnRemoveClick));

                            var noTeethMenuItem = new createjs.Shape();
                            noTeethMenuItem.graphics.beginStroke("black").beginFill("white")
                                .drawRoundRectComplex(75, 15, 50, 50, 5, 5, 5, 5).endStroke();
                            noTeethMenuItem.graphics.beginStroke("blue")
                                    .setStrokeStyle(2)
                                    .moveTo(71, 40)
                                    .lineTo(129, 40).endStroke();
                            noTeethMenuItem.addEventListener("click", bind(this, this.OnNoTeethClick));

                            var normalTeeth = new createjs.Shape();
                            normalTeeth.graphics.beginStroke("black").beginFill("white").setStrokeStyle(1)
                                .drawRoundRectComplex(135, 15, 50, 50, 5, 5, 5, 5).endStroke();
                            normalTeeth.addEventListener("click", bind(this, this.OnHealthClick));

                            var crownTeethMenuItem = new createjs.Shape();
                            crownTeethMenuItem.graphics.beginStroke("black").beginFill("white").setStrokeStyle(1)
                                .drawRoundRectComplex(195, 15, 50, 50, 5, 5, 5, 5).endStroke();
                            crownTeethMenuItem.graphics.beginStroke("blue")
                                    .setStrokeStyle(2)
                                    .moveTo(210, 15)
                                    .lineTo(210, 65)
                                    .moveTo(240, 15)
                                    .lineTo(210, 45)
                                    .moveTo(240, 65)
                                    .lineTo(210, 45).endStroke();
                            crownTeethMenuItem.addEventListener("click", bind(this, this.OnCrownClick));

                            var forEndoMenuItem = new createjs.Shape();
                            forEndoMenuItem.graphics.beginStroke("black").beginFill("white").setStrokeStyle(1)
                                .drawRoundRectComplex(255, 15, 50, 50, 5, 5, 5, 5).endStroke();
                            forEndoMenuItem.graphics.beginStroke("blue")
                                    .setStrokeStyle(2)
                                    .moveTo(260, 15)
                                    .lineTo(260, 65)
                                    .moveTo(260, 15)
                                    .lineTo(300, 15)
                                    .moveTo(260, 65)
                                    .lineTo(300, 65)
                                    .moveTo(260, 40)
                                    .lineTo(280, 40).endStroke();
                            forEndoMenuItem.addEventListener("click", bind(this, this.OnForEndoClick));

                            var afterEndoMenuItem = new createjs.Shape();
                            afterEndoMenuItem.graphics.beginStroke("black").beginFill("white").setStrokeStyle(1)
                                .drawRoundRectComplex(315, 15, 50, 50, 5, 5, 5, 5).endStroke();
                            afterEndoMenuItem.graphics.beginStroke("red")
                                    .setStrokeStyle(2)
                                    .moveTo(320, 15)
                                    .lineTo(320, 65)
                                    .moveTo(320, 15)
                                    .lineTo(360, 15)
                                    .moveTo(320, 65)
                                    .lineTo(360, 65)
                                    .moveTo(320, 40)
                                    .lineTo(340, 40).endStroke();
                            afterEndoMenuItem.addEventListener("click", bind(this, this.OnAfterEndoClick));

                            var uplandMenuItem = new createjs.Shape();
                            uplandMenuItem.graphics.beginStroke("black").beginFill("white").setStrokeStyle(1)
                                .drawRoundRectComplex(375, 15, 50, 50, 5, 5, 5, 5).endStroke();
                            uplandMenuItem.graphics.beginStroke("blue")
                                    .setStrokeStyle(2)
                                    .moveTo(380, 15)
                                    .lineTo(390, 65)
                                    .lineTo(400, 45)
                                    .lineTo(410, 65)
                                    .lineTo(420, 15).endStroke();
                            uplandMenuItem.addEventListener("click", bind(this, this.OnUplandClick));

                            this.menuContainer.addChild(menuBox);
                            this.menuContainer.addChild(removeTeethMenuItem);
                            this.menuContainer.addChild(noTeethMenuItem);
                            this.menuContainer.addChild(normalTeeth);
                            this.menuContainer.addChild(crownTeethMenuItem);
                            this.menuContainer.addChild(forEndoMenuItem);
                            this.menuContainer.addChild(afterEndoMenuItem);
                            this.menuContainer.addChild(uplandMenuItem);
                            this.menuContainer.visible = false;

                            this.generalContainer.addChild(this.menuContainer);

                            this.triangle = new createjs.Shape();
                            this.triangle.x = x + 5;
                            this.triangle.y = y;
                            this.triangle.graphics.beginStroke("black").beginFill("black")
                                .moveTo(163, 80)
                                .lineTo(188, 80)
                                .lineTo(175, 95).closePath().endStroke();

                            this.triangle.addEventListener("click", bind(this, this.OnMenuClick));
                            this.triangle.addEventListener("rollover", bind(this, this.OnMenuButtonMouseEnter));
                            this.triangle.addEventListener("rollout", bind(this, this.OnMenuButtonMouseExit));

                            function bind(scope, fn) {
                                return function () {
                                    return fn.apply(scope, arguments);
                                };
                            }

                            this.generalContainer.addChild(this.triangle);
                            this.generalContainer.addChild(this.health);
                            this.generalContainer.addChild(this.removeTeeth);
                            this.generalContainer.addChild(this.noTeeth);
                            this.generalContainer.addChild(this.crown);
                            this.generalContainer.addChild(this.forEndo);
                            this.generalContainer.addChild(this.afterEndo);
                            this.generalContainer.addChild(this.upland);
                            stage.addChild(this.generalContainer);


                            this.Update();
                        }

                        FrontTeeth.prototype.Update = function () {
                            if (scope.state === undefined || scope.state[this.teethId] === undefined || scope.state[this.teethId].state === 'H') {
                                this.OnHealthClick();
                            } else if (scope.state[this.teethId].state === 'TR') {
                                this.OnRemoveClick();
                            } else if (scope.state[this.teethId].state === 'R') {
                                this.OnNoTeethClick();
                            } else if (scope.state[this.teethId].state === 'K') {
                                this.OnCrownClick();
                            } else if (scope.state[this.teethId].state === 'TE') {
                                this.OnForEndoClick();
                            } else if (scope.state[this.teethId].state === 'E') {
                                this.OnAfterEndoClick();
                            } else if (scope.state[this.teethId].state === 'U') {
                                this.OnUplandClick();
                            } else if (scope.state[this.teethId].state === '[object Array]') {
                                this.OnHealthClick();
                            }
                        };

                        FrontTeeth.prototype.OnMenuClick = function () {
                            if (readOnly){
                                return;                                
                            } 
                            this.menuContainer.visible = !this.menuContainer.visible;
                            update = true;
                        };

                        FrontTeeth.prototype.OnMenuButtonMouseEnter = function (evt) {
                            if (readOnly) {
                                return;
                            }
                            this.triangle.graphics.beginStroke("black").beginFill("gray")
                            .moveTo(163, 80)
                            .lineTo(188, 80)
                            .lineTo(175, 95).closePath().endStroke();
                            update = true;
                        };

                        FrontTeeth.prototype.OnMenuButtonMouseExit = function () {
                            if (readOnly) return;
                            this.triangle.graphics.beginStroke("black").beginFill("black")
                            .moveTo(163, 80)
                            .lineTo(188, 80)
                            .lineTo(175, 95).closePath().endStroke();
                            update = true;
                        }

                        FrontTeeth.prototype.Draw = function () {
                            this.health = new createjs.Container();
                            this.health.x = 100 + this.x;
                            this.health.y = 100 + this.y;

                            var partOne = new PartOne(this.teethId, stage);
                            partOne.addStage(this.health);

                            var partTwo = new PartTwo(this.teethId, stage);
                            partTwo.addStage(this.health);

                            var partThree = new PartThree(this.teethId, stage);
                            partThree.addStage(this.health);

                            var partFour = new PartFour(this.teethId, stage);
                            partFour.addStage(this.health);

                            this.removeTeeth = new createjs.Container();
                            this.removeTeeth.x = 100 + this.x;
                            this.removeTeeth.y = 100 + this.y;

                            var removeTeethShape = new createjs.Shape();
                            removeTeethShape.graphics.beginStroke("black").beginFill("white")
                                .drawRoundRectComplex(0, 0, 100, 100, 5, 5, 5, 5).endStroke();
                            removeTeethShape.graphics.beginStroke("red", "round")
                                    .setStrokeStyle(4)
                                    .moveTo(0, 0)
                                    .lineTo(100, 100)
                                    .moveTo(0, 100)
                                    .lineTo(100, 0).endStroke();

                            this.removeTeeth.addChild(removeTeethShape);


                            this.noTeeth = new createjs.Container();
                            this.noTeeth.x = 100 + this.x;
                            this.noTeeth.y = 100 + this.y;

                            var noTeethShape = new createjs.Shape();
                            noTeethShape.graphics.beginStroke("black").beginFill("white")
                                .drawRoundRectComplex(0, 0, 100, 100, 5, 5, 5, 5).endStroke();
                            noTeethShape.graphics.beginStroke("blue", "round")
                                    .setStrokeStyle(4)
                                    .moveTo(-5, 50)
                                    .lineTo(105, 50).endStroke();

                            this.noTeeth.addChild(noTeethShape);

                            this.crown = new createjs.Container();
                            this.crown.x = 100 + this.x;
                            this.crown.y = 100 + this.y;

                            var crownShape = new createjs.Shape();
                            crownShape.graphics.beginStroke("black").beginFill("white")
                                .drawRoundRectComplex(0, 0, 100, 100, 5, 5, 5, 5).endStroke();
                            crownShape.graphics.beginStroke("blue")
                                    .setStrokeStyle(4, "round")
                                    .moveTo(15, 0)
                                    .lineTo(15, 100)
                                    .moveTo(85, 0)
                                    .lineTo(15, 50)
                                    .moveTo(85, 100)
                                    .lineTo(15, 50).endStroke();

                            this.crown.addChild(crownShape);

                            this.forEndo = new createjs.Container();
                            this.forEndo.x = 100 + this.x;
                            this.forEndo.y = 100 + this.y;

                            var forEndoShape = new createjs.Shape();
                            forEndoShape.graphics.beginStroke("black").beginFill("white")
                                .drawRoundRectComplex(0, 0, 100, 100, 5, 5, 5, 5).endStroke();
                            forEndoShape.graphics.beginStroke("blue")
                                    .setStrokeStyle(4, "round")
                                    .moveTo(15, 0)
                                    .lineTo(15, 100)
                                    .moveTo(15, 0)
                                    .lineTo(95, 0)
                                    .moveTo(15, 100)
                                    .lineTo(95, 100)
                                    .moveTo(15, 50)
                                    .lineTo(80, 50).endStroke();

                            this.forEndo.addChild(forEndoShape);


                            this.afterEndo = new createjs.Container();
                            this.afterEndo.x = 100 + this.x;
                            this.afterEndo.y = 100 + this.y;

                            var afterEndoShape = new createjs.Shape();
                            afterEndoShape.graphics.beginStroke("black").beginFill("white")
                                .drawRoundRectComplex(0, 0, 100, 100, 5, 5, 5, 5).endStroke();
                            afterEndoShape.graphics.beginStroke("red")
                                    .setStrokeStyle(4, "round")
                                    .moveTo(15, 0)
                                    .lineTo(15, 100)
                                    .moveTo(15, 0)
                                    .lineTo(95, 0)
                                    .moveTo(15, 100)
                                    .lineTo(95, 100)
                                    .moveTo(15, 50)
                                    .lineTo(80, 50).endStroke();

                            this.afterEndo.addChild(afterEndoShape);

                            this.upland = new createjs.Container();
                            this.upland.x = 100 + this.x;
                            this.upland.y = 100 + this.y;

                            var uplandShape = new createjs.Shape();
                            uplandShape.graphics.beginStroke("black").beginFill("white")
                                .drawRoundRectComplex(0, 0, 100, 100, 5, 5, 5, 5).endStroke();
                            uplandShape.graphics.beginStroke("red")
                                    .setStrokeStyle(4, "round")
                                    .moveTo(15, 0)
                                    .lineTo(30, 100)
                                    .lineTo(45, 75)
                                    .lineTo(60, 100)
                                    .lineTo(75, 0).endStroke();

                            this.upland.addChild(uplandShape);


                        }

                        FrontTeeth.prototype.OnRemoveClick = function (evt) {
                            this.removeTeeth.visible = true;
                            this.health.visible = false;
                            this.noTeeth.visible = false;
                            this.crown.visible = false;
                            this.forEndo.visible = false;
                            this.afterEndo.visible = false;
                            this.upland.visible = false;

                            this.menuContainer.visible = false;

                            update = true;
                            scope.state[this.teethId] = { id: this.teethId, state: 'TR' };
                        }

                        FrontTeeth.prototype.OnHealthClick = function (evt) {
                            this.removeTeeth.visible = false;
                            this.health.visible = true;
                            this.noTeeth.visible = false;
                            this.crown.visible = false;
                            this.forEndo.visible = false;
                            this.afterEndo.visible = false;
                            this.upland.visible = false;

                            this.menuContainer.visible = false;

                            
                            var det = [];
                             if (undefined !== scope.state[this.teethId] &&
                                    undefined !== scope.state[this.teethId].details ) {
                                det = scope.state[this.teethId].details;                                
                            }
                            scope.state[this.teethId] = { id: this.teethId, state: 'H', details: det};
                            update = true;
                        }

                        FrontTeeth.prototype.OnNoTeethClick = function (evt) {
                            this.removeTeeth.visible = false;
                            this.health.visible = false;
                            this.noTeeth.visible = true;
                            this.crown.visible = false;
                            this.forEndo.visible = false;
                            this.afterEndo.visible = false;
                            this.upland.visible = false;

                            this.menuContainer.visible = false;

                            update = true;
                            scope.state[this.teethId] = { id: this.teethId, state: 'R' };
                        }

                        FrontTeeth.prototype.OnCrownClick = function (evt) {
                            this.removeTeeth.visible = false;
                            this.health.visible = false;
                            this.noTeeth.visible = false;
                            this.crown.visible = true;
                            this.forEndo.visible = false;
                            this.afterEndo.visible = false;
                            this.upland.visible = false;

                            this.menuContainer.visible = false;

                            update = true;
                            scope.state[this.teethId] = { id: this.teethId, state: 'K' };
                        }

                        FrontTeeth.prototype.OnForEndoClick = function (evt) {
                            this.removeTeeth.visible = false;
                            this.health.visible = false;
                            this.noTeeth.visible = false;
                            this.crown.visible = false;
                            this.forEndo.visible = true;
                            this.afterEndo.visible = false;
                            this.upland.visible = false;

                            this.menuContainer.visible = false;

                            update = true;
                            scope.state[this.teethId] = { id: this.teethId, state: 'TE' };
                        }

                        FrontTeeth.prototype.OnAfterEndoClick = function (evt) {
                            this.removeTeeth.visible = false;
                            this.health.visible = false;
                            this.noTeeth.visible = false;
                            this.crown.visible = false;
                            this.forEndo.visible = false;
                            this.afterEndo.visible = true;
                            this.upland.visible = false;

                            this.menuContainer.visible = false;

                            update = true;
                            scope.state[this.teethId] = { id: this.teethId, state: 'E' };
                        }

                        FrontTeeth.prototype.OnUplandClick = function (evt) {
                            this.removeTeeth.visible = false;
                            this.health.visible = false;
                            this.noTeeth.visible = false;
                            this.crown.visible = false;
                            this.forEndo.visible = false;
                            this.afterEndo.visible = false;
                            this.upland.visible = true;

                            this.menuContainer.visible = false;

                            update = true;
                            scope.state[this.teethId] = { id: this.teethId, state: 'U' };
                        }

                        function MolarTeeth(teethNumber, stage, x, y) {
                            FrontTeeth.call(this, teethNumber, stage, x, y);
                        }

                        MolarTeeth.prototype = Object.create(FrontTeeth.prototype);

                        MolarTeeth.prototype.Draw = function () {
                            this.health = new createjs.Container();
                            this.health.x = 100 + this.x;
                            this.health.y = 100 + this.y;

                            var partOne = new PartOneMolar(this.teethId, stage);
                            partOne.addStage(this.health);

                            var partTwo = new PartTwoMolar(this.teethId, stage);
                            partTwo.addStage(this.health);

                            var partThree = new PartThreeMolar(this.teethId, stage);    
                            partThree.addStage(this.health);

                            var partFour = new PartFourMolar(this.teethId, stage);
                            partFour.addStage(this.health);

                            var partFive = new PartFiveMolar(this.teethId, stage);
                            partFive.addStage(this.health);

                            this.removeTeeth = new createjs.Container();
                            this.removeTeeth.x = 100 + this.x;
                            this.removeTeeth.y = 100 + this.y;

                            var removeTeethShape = new createjs.Shape();
                            removeTeethShape.graphics.beginStroke("black").beginFill("white")
                                .drawRoundRectComplex(0, 0, 100, 100, 5, 5, 5, 5).endStroke();
                            removeTeethShape.graphics.beginStroke("red", "round")
                                    .setStrokeStyle(4)
                                    .moveTo(0, 0)
                                    .lineTo(100, 100)
                                    .moveTo(0, 100)
                                    .lineTo(100, 0).endStroke();

                            this.removeTeeth.addChild(removeTeethShape);


                            this.noTeeth = new createjs.Container();
                            this.noTeeth.x = 100 + this.x;
                            this.noTeeth.y = 100 + this.y;

                            var noTeethShape = new createjs.Shape();
                            noTeethShape.graphics.beginStroke("black").beginFill("white")
                                .drawRoundRectComplex(0, 0, 100, 100, 5, 5, 5, 5).endStroke();
                            noTeethShape.graphics.beginStroke("blue", "round")
                                    .setStrokeStyle(4)
                                    .moveTo(-5, 50)
                                    .lineTo(105, 50).endStroke();

                            this.noTeeth.addChild(noTeethShape);

                            this.crown = new createjs.Container();
                            this.crown.x = 100 + this.x;
                            this.crown.y = 100 + this.y;

                            var crownShape = new createjs.Shape();
                            crownShape.graphics.beginStroke("black").beginFill("white")
                                .drawRoundRectComplex(0, 0, 100, 100, 5, 5, 5, 5).endStroke();
                            crownShape.graphics.beginStroke("blue")
                                    .setStrokeStyle(4, "round")
                                    .moveTo(15, 0)
                                    .lineTo(15, 100)
                                    .moveTo(85, 0)
                                    .lineTo(15, 50)
                                    .moveTo(85, 100)
                                    .lineTo(15, 50).endStroke();

                            this.crown.addChild(crownShape);

                            this.forEndo = new createjs.Container();
                            this.forEndo.x = 100 + this.x;
                            this.forEndo.y = 100 + this.y;

                            var forEndoShape = new createjs.Shape();
                            forEndoShape.graphics.beginStroke("black").beginFill("white")
                                .drawRoundRectComplex(0, 0, 100, 100, 5, 5, 5, 5).endStroke();
                            forEndoShape.graphics.beginStroke("blue")
                                    .setStrokeStyle(4, "round")
                                    .moveTo(15, 0)
                                    .lineTo(15, 100)
                                    .moveTo(15, 0)
                                    .lineTo(95, 0)
                                    .moveTo(15, 100)
                                    .lineTo(95, 100)
                                    .moveTo(15, 50)
                                    .lineTo(80, 50).endStroke();

                            this.forEndo.addChild(forEndoShape);


                            this.afterEndo = new createjs.Container();
                            this.afterEndo.x = 100 + this.x;
                            this.afterEndo.y = 100 + this.y;

                            var afterEndoShape = new createjs.Shape();
                            afterEndoShape.graphics.beginStroke("black").beginFill("white")
                                .drawRoundRectComplex(0, 0, 100, 100, 5, 5, 5, 5).endStroke();
                            afterEndoShape.graphics.beginStroke("red")
                                    .setStrokeStyle(4, "round")
                                    .moveTo(15, 0)
                                    .lineTo(15, 100)
                                    .moveTo(15, 0)
                                    .lineTo(95, 0)
                                    .moveTo(15, 100)
                                    .lineTo(95, 100)
                                    .moveTo(15, 50)
                                    .lineTo(80, 50).endStroke();

                            this.afterEndo.addChild(afterEndoShape);

                            this.upland = new createjs.Container();
                            this.upland.x = 100 + this.x;
                            this.upland.y = 100 + this.y;

                            var uplandShape = new createjs.Shape();
                            uplandShape.graphics.beginStroke("black").beginFill("white")
                                .drawRoundRectComplex(0, 0, 100, 100, 5, 5, 5, 5).endStroke();
                            uplandShape.graphics.beginStroke("red")
                                    .setStrokeStyle(4, "round")
                                    .moveTo(15, 0)
                                    .lineTo(30, 100)
                                    .lineTo(45, 75)
                                    .lineTo(60, 100)
                                    .lineTo(75, 0).endStroke();

                            this.upland.addChild(uplandShape);

                        }

                        var graphContainer = new createjs.Container();
                        
                        graphContainer.scaleX = graphContainer.scaleY = graphContainer.scale = 0.55;


                        // Build Teeth graph
                        tooth.push(new MolarTeeth("18", graphContainer, 0, 0));

                        tooth.push(new MolarTeeth("17", graphContainer, 110, 0));

                        tooth.push(new MolarTeeth("16", graphContainer, 220, 0));

                        tooth.push(new MolarTeeth("15", graphContainer, 330, 0));

                        tooth.push(new MolarTeeth("14", graphContainer, 440, 0));

                        tooth.push(new FrontTeeth("13", graphContainer, 550, 0));

                        tooth.push(new FrontTeeth("12", graphContainer, 660, 0));

                        tooth.push(new FrontTeeth("11", graphContainer, 770, 0));

                        tooth.push(new FrontTeeth("21", graphContainer, 880, 0));

                        tooth.push(new FrontTeeth("22", graphContainer, 990, 0));

                        tooth.push(new FrontTeeth("23", graphContainer, 1100, 0));

                        tooth.push(new MolarTeeth("24", graphContainer, 1210, 0));

                        tooth.push(new MolarTeeth("25", graphContainer, 1320, 0));

                        tooth.push(new MolarTeeth("26", graphContainer, 1430, 0));

                        tooth.push(new MolarTeeth("27", graphContainer, 1540, 0));

                        tooth.push(new MolarTeeth("28", graphContainer, 1650, 0));



                        tooth.push(new MolarTeeth("38", graphContainer, 0, 140));

                        tooth.push(new MolarTeeth("37", graphContainer, 110, 140));

                        tooth.push(new MolarTeeth("36", graphContainer, 220, 140));

                        tooth.push(new MolarTeeth("35", graphContainer, 330, 140));

                        tooth.push(new MolarTeeth("34", graphContainer, 440, 140));

                        tooth.push(new FrontTeeth("33", graphContainer, 550, 140));

                        tooth.push(new FrontTeeth("32", graphContainer, 660, 140));

                        tooth.push(new FrontTeeth("31", graphContainer, 770, 140));

                        tooth.push(new FrontTeeth("41", graphContainer, 880, 140));

                        tooth.push(new FrontTeeth("42", graphContainer, 990, 140));

                        tooth.push(new FrontTeeth("43", graphContainer, 1100, 140));

                        tooth.push(new MolarTeeth("44", graphContainer, 1210, 140));

                        tooth.push(new MolarTeeth("45", graphContainer, 1320, 140));

                        tooth.push(new MolarTeeth("46", graphContainer, 1430, 140));

                        tooth.push(new MolarTeeth("47", graphContainer, 1540, 140));

                        tooth.push(new MolarTeeth("48", graphContainer, 1650, 140));

                        stage.addChild(graphContainer);
                        stage.addChild(container);


                        createjs.Ticker.addEventListener("tick", tick);

                        function tick(event) {
                            // this set makes it so the stage only re-renders when an event handler indicates a change has happened.
                            if (update) {
                                update = false; // only update once
                                stage.update(event);
                            }
                        }

                        stage.update();

                    }

                    scope.$watch('state', function (newVal, oldVal) {
                        if (undefined === scope.state) {
                            return;
                        }
                        if (typeof scope.state === 'string') {
                            scope.state = JSON.parse(scope.state);
                        }
                        if (!hasBeenInit) {
                            Init();
                            hasBeenInit = true;
                            return;
                        }
                        tooth.forEach(function (x) {
                            x.Update();
                        });
                    });

                }
            };
    });
}());