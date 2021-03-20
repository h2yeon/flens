<template>
    <div id="topology"></div>
</template>

<script>
import {defind_html} from '@/joint/joint.shapes.device.js';
window.$ = require('jquery');
window.joint = require('jointjs');
window.dagre = require('dagre');
window.graphlib = require('graphlib');
export default {
    name: "Topology",
    mounted() {
        this.graph = new joint.dia.Graph;
        this.paper = new joint.dia.Paper({
            el: $('#topology'),
            model: this.graph
        });
        defind_html(this);
        this.topology_init();
        this.addEvent();
    },
    data() {
        return {
            graph: null,
            paper: null
        }
    },
    methods: {
        topology_init() {
            var htmlContainer = document.createElement('div');
            // htmlContainer.style.pointerEvents = 'none';
            htmlContainer.style.position = 'absolute';
            htmlContainer.style.inset = '0';
            this.paper.el.appendChild(htmlContainer);
            this.paper.htmlContainer = htmlContainer;
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
            
            var l1 = this.connect(el1, el2, true);
            var l2 = this.connect(el1, el3);
            this.graph.addCells([el1, el2, el3, l1, l2]);
            joint.layout.DirectedGraph.layout(this.graph, {
            nodeSep: 400,
            rankSep: 200,
            marginX: 200,
            marginY: 200,
            rankDir: "TB"
            });
        },
        connect(source, target, hasPort) {
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
            if(hasPort) {
                l.attr('line/sourceMarker', {
                    type: 'circle',
                    r: 5,
                    cx: 15
                })
            }
            return l;
        }, 
        addEvent() {
            this.paper.on('blank:pointerdown cell:pointerdown', function(elementView, event) {
                document.activeElement.blur();
                var devicePopup = $(elementView.html).find('.device-popup');
                if(devicePopup.css('display') !== 'none') {
                    devicePopup.css('display', 'none'); 
                }
            });
            this.paper.on('blank:pointerup cell:pointerup', function(elementView, event) {
                document.activeElement.blur();
                var devicePopup = $(elementView.html).find('.device-popup');
                if(devicePopup.css('display') === 'none') {
                    devicePopup.css('display', 'block'); 
                }
            });
        },
        search: function(modelId) {
        }
    }
}
</script>

<style lang="scss">
@import '~@/assets/scss/topology';
</style>
<style scoped>

</style>
