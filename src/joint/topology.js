export function _data(graph) {
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
    joint.layout.DirectedGraph.layout(graph, {
       nodeSep: 400,
       rankSep: 200,
       marginX: 200,
       marginY: 200,
       rankDir: "TB"
   });

}