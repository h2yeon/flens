<template>
    <div id="topology"></div>
</template>

<script>
import {defind_html} from '@/joint/joint.shapes.device.js';
import {deviceType} from '@/data/type/deviceType.js';
import axios from 'axios';
window.$ = require('jquery');
window.joint = require('jointjs');
window.dagre = require('dagre');
window.graphlib = require('graphlib');
export default {
    name: "Topology",
    mounted() {
        this.width = this.$el.clientWidth;
        this.graph = new joint.dia.Graph;
        this.paper = new joint.dia.Paper({
            el: $('#topology'),
            model: this.graph,
            width: this.width,
            height: this.$el.clientHeight,
            marginX: 200,
            marginY: 200,
            gridSize: 1
        });
        defind_html(this);
        this.topology_init();
        this.addEvent();
    },
    data() {
        return {
            graph: null,
            paper: null,
            deviceType: deviceType,
            spine: {x: 0, y: 200},
            leaf: {x: 0, y: 500},
            controller: {x: 0, y:800},
            width: 0
        }
    },
    methods: {
        topology_init() {
            var htmlContainer = document.createElement('div');
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
            let deviceType = this.deviceType;
            let spineWidth = this.getPosition(result, deviceType.SPINE); 
            let leafWidth = this.getPosition(result, deviceType.LEAF); 
            let controllerWidth = this.getPosition(result, deviceType.CONTROLLER); 
            const vm = this;
            result.forEach(data => {
                var x, y;
                switch(data.dev_role.toUpperCase()) {
                    case deviceType.SPINE:
                        x = vm.spine.x + spineWidth;
                        y = vm.spine.y; 
                        vm.spine.x = x;
                        break;
                    case deviceType.LEAF: 
                        x = vm.leaf.x + leafWidth;
                        y = vm.leaf.y; 
                        vm.leaf.x = x;
                        break;
                    case deviceType.CONTROLLER: 
                        x = vm.controller.x + controllerWidth;
                        y = vm.controller.y; 
                        vm.controller.x = x;
                        break;
                }
                var cell = new joint.shapes.html.Element({
                    position: {x: x, y: y},
                    fields: {
                        name: data.dev_name,
                        role: data.dev_role,
                    },
                    metrics: {
                        hopLatency: '1',
                        queueCongestion: '2',
                        pps: '3',
                        throughput: '4'
                    }
                });
                cell.device_id = data.id;
                graphCells.push(cell);
            })
            this.graph.addCells(graphCells);
            axios.get('/api/link')
                .then(function(response) {
                    vm.createLinks(response.data);
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        createLinks(result) {
            var deviceKeys = Object.keys(result);
            var deviceCells = this.graph.getCells();
            const vm = this;
            deviceKeys.forEach(function(deviceId) {
                let device = deviceCells.filter(cell => cell.device_id === deviceId)[0]
                let deviceResult = result[deviceId];
                Object.keys(result[deviceId]).forEach(function(portId) {
                    var targetDevice = deviceCells.filter(cell => cell.device_id === deviceResult[portId].tar_dev_id)[0];
                    var targetPortId = deviceResult[portId].tar_tp;
                    let target = targetDevice;
                    let source = device;
                    vm.connect(source,target);
                })
            })
        },
        connect(source, target) {
            var sourceOption = 'bottom';
            var targetOption = 'top';
            if(source.attributes.position.y > target.attributes.position.y) {
                sourceOption = 'top';
                targetOption = 'bottom';
            }
            var l = new joint.shapes.standard.Link();
            l.source(source, {
                anchor: { name: sourceOption}
            })
            l.target(target, {
                anchor: { name: targetOption}
            })
            l.attr({
                line: {
                    targetMarker: {
                        type: 'ellipsis'
                    },
                    sourceMarker: {
                        type: 'circle',
                        r: 4,
                        cx: 15
                    }
                }
            })
            this.graph.addCell(l);
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
        getPosition(result, type) {
            let length = result.filter(data => data.dev_role === type).length; 
            var width = Math.floor(this.width/(length+1)) - 40;
            return width;
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
