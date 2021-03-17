export function _init(graph, paper) {
     // Container for all HTML views inside paper
     var htmlContainer = document.createElement('div');
     htmlContainer.style.pointerEvents = 'none';
     htmlContainer.style.position = 'absolute';
     htmlContainer.style.inset = '0';
     paper.el.appendChild(htmlContainer);
     paper.htmlContainer = htmlContainer;
 
     paper.on('scale translate', function() {
         // Update the transformation of all JointJS HTML Elements
         var htmlContainer = this.htmlContainer;
         htmlContainer.style.transformOrigin = '0 0';
         htmlContainer.style.transform = V.matrixToTransformString(this.matrix());
     });
 
     paper.on('blank:pointerdown cell:pointerdown', function() {
         document.activeElement.blur();
     });
     
     paper.on('element:mouseenter', function(elementView, event) {
        var htmlList = $(elementView.paper.htmlContainer).children('.html-container').toArray();
        var target = htmlList.filter(child => $(child).attr('model-id') === elementView.model.id)[0]
        $(target).children('.html-element').css('display', 'block');
    });

    paper.on('element:mouseleave', function(elementView, event) {
        var htmlList = $(elementView.paper.htmlContainer).children('.html-container').toArray();
        var target = htmlList.filter(child => $(child).attr('model-id') === elementView.model.id)[0]
        $(target).children('.html-element').css('display', 'none');
    });

     const connect = (source, target,port) => {
        var l = new joint.shapes.standard.Link();
        l.source(source);
        l.target(target);
        l.attr({
            line: {
                targetMarker: {
                    type: 'ellipse'
                }
            }
        })
        if(port) {
            l.attr('line/sourceMarker', {
                type: 'circle',
                r: 5,
                cx: 15
            })
        }
        return l;
    }
 
 
     var el1 = new joint.shapes.html.Element({
         fields: {
             matric: {
                 label: 'hopLatency',
                 value: '1234'
             }
         }
     });
 
     var el2 = new joint.shapes.html.Element({
         fields: {
            metric: {
                label: 'hopLatency',
                value: '1234'
            }
         }
     });
 
     var el3 = new joint.shapes.html.Element({
         fields: {
            metric: {
                label: 'hopLatency',
                value: '1234'
            }
         }
     });
 
     var l1 = connect(el1, el2, true);
     var l2 = connect(el1, el3);
 
     graph.resetCells([el1, el2, el3, l1, l2]);
 
     paper.unfreeze();

     joint.layout.DirectedGraph.layout(graph, {
        nodeSep: 400,
        rankSep: 200,
        marginX: 200,
        marginY: 200,
        rankDir: "TB"
    });
 
     // Toolbar
     var zoomLevel = 1;
}