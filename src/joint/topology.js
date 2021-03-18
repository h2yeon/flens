export function _init(graph, paper) {
    // Container for all HTML views inside paper
    var htmlContainer = document.createElement('div');
    // htmlContainer.style.pointerEvents = 'none';
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

    paper.on('blank:pointerdown cell:pointerdown', function(elementView, event) {
        document.activeElement.blur();
        $(elementView.html).find('.device-popup').css('display', 'none');
    });

   $(document).on('mouseover', '.device-container', function(e) {
        var target = $(e.currentTarget).children('.device-popup')[0];
        $(target).css('display', 'block');
        target.classList.remove('disappear');
        target.classList.add('appear');
   })
   $(document).on('mouseout', '.device-container', function(e) {
        var target = $(e.currentTarget).children('.device-popup')[0];
        $(target).css('display','none');
        target.classList.add('disappear');
        target.classList.remove('appear')
   })

   

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
            name: '1234',
            type: 'spine'
        },
        metrics: {
            hopLatency: '1',
            queueCongestion: '2',
            pps: '3',
            throughput: '4'
        }
    });

    var el2 = new joint.shapes.html.Element({
        fields: {
            name: '1234',
            type: 'leaf'
        },
        metrics: {
            hopLatency: '1',
            queueCongestion: '2',
            pps: '3',
            throughput: '4'
        }
    });

    var el3 = new joint.shapes.html.Element({
        fields: {
            name: '1234',
            type: 'host'
        },
        metrics: {
            hopLatency: '',
            queueCongestion: '',
            pps: '',
            throughput: ''
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