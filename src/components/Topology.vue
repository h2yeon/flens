<template>
    <div id="topology"></div>
</template>

<script>
import {defind_html} from '@/joint/joint.shapes.device.js';
import axios from 'axios';
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
            
            const vm = this;
            axios.get('/api/nodedef')
                .then(function(response) {
                    vm.createCells(response.data);
                })
                .catch(function(error) {
                    console.log(error);
                });
            
            
        },
        createCells(result) {
            let graphCells = [];
            result.forEach(data => {
                var inPorts = [];
                for(var port in data.tp_list) {
                    inPorts.push(port);
                }
                var cell = new joint.shapes.html.Element({
                    fields: {
                        name: data.dev_name,
                        role: data.dev_role,
                    },
                    metrics: {
                        hopLatency: '1',
                        queueCongestion: '2',
                        pps: '3',
                        throughput: '4'
                    },
                    inPorts: inPorts,
                });
                inPorts.forEach(port => {
                    cell.addPort({
                        group: 'port',
                        args: { x: 0, y: 0 },
                        id: port,
                        size: { height: 5 || 0, width:5 || 0 }
                    })
                })
                cell.device_id = data.id;
                graphCells.push(cell);
            })
            this.graph.addCells(graphCells);
            
            const vm = this;
            axios.get('/api/link')
                .then(function(response) {
                    vm.createLinks(response.data);
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        createLinks(result) {
            debugger;
            joint.layout.DirectedGraph.layout(this.graph, {
            nodeSep: 400,
            rankSep: 200,
            marginX: 200,
            marginY: 200,
            rankDir: "TB"
            });
            this.paper.fitToContent({maxWidth:this.$el.clientWidth, minHeight: this.$el.clientHeight,  
            useModelGeometry: true})
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
