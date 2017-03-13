goog.provide("ispring.sample.GameController");

goog.require("ispring.sample.GameModel");
goog.require("ispring.sample.GameView");

goog.scope(function() {
    const MODEL = ispring.sample.GameModel;
    const VIEW = ispring.sample.GameView;
    const GAME_CONFIG = ispring.sample.Definition;
    const config = new GAME_CONFIG();
    /**
     * @constructor
     */
    ispring.sample.GameController = goog.defineClass(null, 
        {
        constructor: function(canvas) 
        {
        	this._click = false;
            this._model = new MODEL();
            this._view = new VIEW(canvas);
            
            const thisPtr = this;
            canvas.onmouseup = function()
            {
                thisPtr.OnMouseClick();
            };
            document.addEventListener("DecrementSpeed", function (e) 
            {
                thisPtr._model.DecrementSpeed();
            });
            document.addEventListener("IncrementSpeed", function (e) 
            {
                thisPtr._model.IncrementSpeed();
            });
            window.addEventListener('keypress', thisPtr.handlerKeyPress);
            setInterval(function()
            {
            	if (thisPtr._click && !thisPtr.CheckColors())
            	{
                	thisPtr._model.ResetData();
            	}
            	if (thisPtr.CheckColors())
            	{
            		thisPtr._click = true;
            	}
                thisPtr._model.RotateSystem();
                thisPtr._view.DrawShapes(thisPtr._model.GetShapesWithArrow());
                thisPtr._view.DrawText(thisPtr._model.GetScore(), thisPtr._model.GetSpeed(), thisPtr._model.GetTop());
            }, 1000 / 30);

        },
        handlerKeyPress: function(e)
        {
        	console.log(e.keyCode);
        	console.log(this);
            
            if (e.keyCode == 43)
            {
            	document.dispatchEvent(new Event("IncrementSpeed"));
            }
        },
        CheckColors: function()
        {
            var shapes = this._model.GetShapes();
            var arrow = this._model.GetArrow();
            var rotate = this._model.GetRotate();
            const thisPtr = this;
            function CompareShapes(shapeArray, arrowShape, rangeNumber)
            {
                var sectorRadian = config._TWO_HALVES / thisPtr._model.GetNumberOfColors() * Math.PI;

                for (var i = 0; i < shapeArray.length; ++i)
                {
                    if (shapeArray[i].GetColor() == arrowShape.GetColor())
                    {
                        var startRot = shapeArray[i].GetStartRotation();
                        console.log(shapeArray[i].GetColor(), arrowShape.GetColor(), " startRot ", startRot, " rangeNum ", rangeNumber, " sectorRadian ", sectorRadian * (i + 1));
                        if ((startRot < rangeNumber) && (rangeNumber <= sectorRadian * (i + 1)))
                        {
                            return true;
                        }
                    }
                   
                }
                return false;
            }
            var turn = rotate / (config._TWO_HALVES * Math.PI);
            turn = turn % 1;
            turn = turn * 2 * Math.PI;
            if (turn < 0)
            {
                turn = Math.abs(turn);
                if (turn > 3 * Math.PI / 2 && turn < 2 * Math.PI)
                {
                    return (CompareShapes(shapes, arrow, turn - 3 * Math.PI / 2));
                }
                else if (turn > 0 && turn < Math.PI / 2)
                {
                    return (CompareShapes(shapes, arrow, turn + Math.PI / 2));
                }
                else if (turn > Math.PI && turn < 3 * Math.PI / 2)
                {
                    return (CompareShapes(shapes, arrow, turn + Math.PI / 2));
                }
                else
                {
                    return (CompareShapes(shapes, arrow, turn + Math.PI / 2));
                }
            }
            else
            {
                if (shapes.length > 4)
                {
                    if (turn > 0 && turn <= Math.PI / 2)
                    {
                        return (CompareShapes(shapes, arrow, turn));
                    }
                    else if (turn > Math.PI / 2 && turn <= Math.PI)
                    {
                        return (CompareShapes(shapes, arrow, turn + Math.PI));
                    }
                    else if (turn > Math.PI && turn <= 3 * Math.PI / 2)
                    {
                        return (CompareShapes(shapes, arrow, turn + Math.PI/2));
                    }
                    else if (turn > 3 * Math.PI / 2 && turn <= 2 * Math.PI)
                    {
                        return (CompareShapes(shapes, arrow, turn - Math.PI));
                    }
                    
                    else
                    {
                        return (CompareShapes(shapes, arrow, turn + Math.PI));
                    }
                }
                else
                {
                    if (turn > 0 && turn <= Math.PI / 2)
                    {
                        return (CompareShapes(shapes, arrow, turn));
                    }
                    else if (turn > Math.PI / 2 && turn <= Math.PI)
                    {
                        return (CompareShapes(shapes, arrow, turn + Math.PI));
                    }
                    else if (turn > Math.PI && turn <= 3 * Math.PI / 2)
                    {
                        return (CompareShapes(shapes, arrow, turn));
                    }
                    else if (turn > 3 * Math.PI / 2 && turn <= 2 * Math.PI)
                    {
                        return (CompareShapes(shapes, arrow, turn - Math.PI));
                    }
                    
                    else
                    {
                        return (CompareShapes(shapes, arrow, turn + Math.PI));
                    }
                }
                
            }
            return false;
        },
        OnMouseClick: function()
        {
            this._view.DrawShapes(this._model.GetShapesWithArrow());

            if (!this.CheckColors())
            {
                this._model.ResetData();
            }
            else
            {
            	this._click = false;
                this._model.IncrementScore();
                if (this._model.GetScore() > this._model.GetTop())
                {
                    window.localStorage.setItem(config._TOP_RESULT, this._model.GetScore());
                    this._model.SetTop(this._model.GetScore());
                }
                if (this._model.GetScore() % 5 == 0)
                {
                    this._model.IncrementSpeed();
                }
                var randNumber = this._model.GetRandomArbitary(0, this._model.GetNumberOfColors() - 1);
                while (this._model.GetArrow().GetColor() == this._model.GetColors()[randNumber])
                {
                    randNumber = this._model.GetRandomArbitary(0, this._model.GetNumberOfColors() - 1);
                }
                this._model.SetColorArrow(this._model.GetColors()[randNumber]);
                this._model._twist = !this._model._twist;
            }
        }
    });
});