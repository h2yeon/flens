<template>
    <div id="topology">
        <div ref="linkPopup" class="link-popup" 
            :style="{top:linkPopupPosition.y + 'px', left:linkPopupPosition.x + 'px'}">
            <div class="link-popup-field">
                <div class="link-popup-label">Name</div>
                <div class="link-popup-value"></div>
            </div>
            <div class="link-popup-header">Metric</div>
            <div class="link-popup-field">
                <div class="link-popup-label">PPS</div>
                <div class="link-popup-value"></div>
            </div>
            <div class="link-popup-field">
                <div class="link-popup-label">Troughput</div>
                <div class="link-popup-value"></div>
            </div>
            <div class="link-tool-icon">
                <div class="link-tool-icon-search"></div>
            </div>
        </div>
        <div ref="portPopup" class="port-popup" 
            :style="{top:portPopupPosition.y + 'px', left:portPopupPosition.x + 'px'}">
            <div class="port-popup-field">
                <div class="port-popup-label">Name</div>
                <div class="port-popup-value">{{sourceId}}</div>
            </div>
            <div class="port-popup-field">
                <div class="port-popup-label">Port선택</div>
                <div class="port-popup-value">
                    <b-form-select style="width:100%" v-model="selectSourceTp" :options="sourceTp">
                    </b-form-select>
                </div>
            </div>
            <div class="port-popup-header">Metric</div>
            <div class="port-popup-field">
                <div class="port-popup-label">From</div>
                <div class="port-popup-value">{{portMetric.from}}</div>
            </div>
            <div class="port-popup-field">
                <div class="port-popup-label">To</div>
                <div class="port-popup-value">{{portMetric.to}}</div>
            </div>
            <div class="port-popup-field">
                <div class="port-popup-label">Drop Bytes</div>
                <div class="port-popup-value">{{portMetric.dropBytes}}</div>
            </div>
            <div class="port-popup-field">
                <div class="port-popup-label">Drop Packet Count</div>
                <div class="port-popup-value">{{portMetric.dropPacketCount}}</div>
            </div>
            <div class="port-popup-field">
                <div class="port-popup-label">Rx Bytes</div>
                <div class="port-popup-value">{{portMetric.rxBytes}}</div>
            </div>
            <div class="port-popup-field">
                <div class="port-popup-label">Rx Packet Count</div>
                <div class="port-popup-value">{{portMetric.rxPacketCount}}</div>
            </div>
            <div>
                <div class="port-popup-label">Tx Bytes</div>
                <div class="port-popup-value">{{portMetric.txBytes}}</div>
            </div>
            <div class="port-popup-field">
                <div class="port-popup-label">Tx Packet Count</div>
                <div class="port-popup-value">{{portMetric.txPacketCount}}</div>
            </div>
            <div class="port-tool-icon">
                <div class="port-tool-icon-chart" @click="openELKWindow(sourceId, selectSourceTp)"></div>
                <div class="port-tool-icon-search" @click="searchDetailPort"></div>
            </div>
        </div>
    </div>
</template>

<script>
import {define_html} from '@/joint/joint.shapes.device.js';
import {define_link} from '@/joint/joint.shapes.link.js';
import {searchType} from '@/data/type/searchType.js';
import {roleType} from '@/data/type/roleType.js';
import {APIHelper} from '@/APIHelper.js'
import {mapState, mapMutations} from 'vuex'
import axios from 'axios';
window.$ = require('jquery');
window.joint = require('jointjs');
window.dagre = require('dagre');
window.graphlib = require('graphlib');
window.apiHelper = new APIHelper();
export default {
    name: "Topology",
    props: {
        mainSearch: {
            type: Function
        }
    },
    mounted() {
        //link/port style
        var style = {
            linkColor: 'black', //link 색상
            linkWidth: 2,       //link stroke width
            portColor: 'black', //port 색상
            portSize: 5         //port 사이즈
        }
        this.width = this.$el.clientWidth;
        this.setGraph(new joint.dia.Graph);
        this.setPaper(new joint.dia.Paper({
            el: $('#topology'),
            model: this.graph,
            width: this.width,
            height: this.$el.clientHeight,
            marginX: 100,
            marginY: 100,
            gridSize: 1
        }));
        define_html(this);
        define_link(style);
        this.topology_init();
        this.addEvent();
        window.addEventListener('resize', this.handleResize);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.handleResize);
    },
    computed: {
        ...mapState({
            graph: state => state.graph,
            paper: state => state.paper,
        })
    },
    data() {
        return {
            roleType: roleType,
            searchType: searchType,
            spine: {x: 0, y: 120},
            leaf: {x: 0, y: 400},
            controller: {x: 0, y:680},
            width: 0,
            linkPopupPosition: {
                x: 0,
                y: 0
            },
            portPopupPosition: {
                x: 0,
                y: 0
            },
            source: null,
            target: null,
            sourceId: '',
            sourceTp: [],
            selectSourceTp: '',
            portMetric: {
                from: "",
                to: "",
                dropBytes: null,
                dropPacketCount: null,
                rxBytes: null,
                rxPacketCount: null,
                txBytes: null,
                txPacketCount: null,
            },
            linkMetric: {},
        }
    },
    watch: {
        selectSourceTp() {
            if(this.sourceId === '' || (this.selectSourceTp === '' || this.selectSourceTp === undefined)) return;
            const vm = this;
            axios.get('/api/metric?device_id=' +  this.sourceId + '&port_id=' + this.selectSourceTp)
                    .then(function(response) {
                        vm.portMetric = response.data;
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
        }
    },
    methods: {
        topology_init() {
            var htmlContainer = document.createElement('div');
            this.paper.el.appendChild(htmlContainer);
            this.paper.htmlContainer = htmlContainer;
            this.paper.htmlContainer.appendChild(this.$refs.linkPopup);
            this.paper.htmlContainer.appendChild(this.$refs.portPopup);
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
            const vm = this;
            const data = result;
            data.forEach(o => {
                var cell = new joint.shapes.html.Element({
                    position: vm.getPosition(data.filter(c => c.dev_role === o.dev_role).length, o.dev_role),
                    fields: {
                        name: o.dev_name,
                        role: o.dev_role,
                    },
                    tp_list: Object.keys(o.tp_list).map(key => ({
                        dev_id: o.id, 
                        tp: key, 
                        assign: o.tp_list[key].tp_assign, 
                        lldp_supported: o.tp_list[key].tar_lldp_supported,
                        tar:[]
                    }))
                });
                cell.device_id = o.id;
                graphCells.push(cell);
            })
            this.graph.addCells(graphCells);
            axios.get('/api/link')
                .then(function(response) {
                    vm.setPortList(response.data, graphCells);
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        setPortList(result, graphCells) {
            this.graph.getElements().forEach(function(cell) {
                let tp_list = cell.attributes.tp_list;
                let portList = tp_list.map(tp => ({id:tp.dev_id, port: tp.tp}));
                portList.forEach((port, index) => {
                    var target = result[port.id];
                    if(target) {
                        if(target[port.port] !== undefined) {
                            tp_list[index].tar.push(target[port.port]);
                        }
                    }
                })
                cell.attributes.tp_list = tp_list;
            })
            this.createLinks(graphCells);
        },
        createLinks(result) {
            var controllers = result.filter(cell => cell.attributes.fields.role === this.roleType.CONTROLLER);
            var leafs = result.filter(cell => cell.attributes.fields.role === this.roleType.LEAF);
            var spines = result.filter(cell => cell.attributes.fields.role === this.roleType.SPINE);
            const vm = this;
            controllers.forEach(c => {
                leafs.forEach(l => {
                    let tarList = c.attributes.tp_list.filter(t => t.tar[0] !== undefined);
                    if(tarList.filter(t => t.tar.filter(p => p.tar_dev_id === l.device_id).length > 0).length > 0) {
                        vm.connect(c, l);
                    }
                })
            });
            leafs.forEach(l => {
                spines.forEach(s => {
                    let tarList = l.attributes.tp_list.filter(t => t.tar[0] !== undefined);
                    if(tarList.filter(t => t.tar.filter(p => p.tar_dev_id === s.device_id).length > 0).length > 0) {
                        vm.connect(l, s);
                    }
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
            var l = new joint.shapes.examples.CustomLink();
            l.source(source, {
                anchor: { name: sourceOption}
            })
            l.target(target, {
                anchor: { name: targetOption}
            })
            this.graph.addCell(l);
        }, 
        addEvent() {
            const vm = this;
            this.paper.on('link:contextmenu', function(elementView, event) {
                if(event.target.tagName === 'circle') {
                    let portPopup = $(vm.$refs.portPopup).closest('.port-popup');
                    if(portPopup.hasClass('popup')) {
                        portPopup.removeClass(['popup', 'appear'])
                        portPopup.addClass('disappear');
                        portPopup.css('display', 'none');
                    } else {
                        vm.portMetric =  {
                            from: "",
                            to: "",
                            dropBytes: null,
                            dropPacketCount: null,
                            rxBytes: null,
                            rxPacketCount: null,
                            txBytes: null,
                            txPacketCount: null,
                        };
                        vm.selectSourceTp = '';
                        vm.portPopupPosition.x = event.clientX;
                        vm.portPopupPosition.y = event.clientY;
                        if(event.clientY > 650) {
                            vm.portPopupPosition.y = event.clientY - 490;
                        }
                        vm.source = elementView.model.getSourceElement();
                        vm.target = elementView.model.getTargetElement();
                        if(event.target.getAttribute('joint-selector') === 'target') {
                            vm.source = elementView.model.getTargetElement();
                            vm.target = elementView.model.getSourceElement();
                        }
                        let source = vm.source;
                        vm.sourceId = source.device_id;
                        vm.sourceTp = 
                        source.attributes.tp_list
                            .filter(tp => tp.dev_id === source.device_id && tp.tar.length > 0)
                            .filter(tp => tp.tar[0].tar_dev_id === vm.target.device_id)
                            .map(tp => ({
                                value: tp.tp,
                                text: tp.tp
                            }));
                        portPopup.addClass(['popup', 'appear'])
                        portPopup.removeClass('disappear');
                        portPopup.css({
                            display: 'block'
                        });
                    }
                } else {
                    vm.linkPopupPosition.x = event.clientX;
                    vm.linkPopupPosition.y = event.clientY;
                    let linkPopup = $(vm.$refs.linkPopup).closest('.link-popup');
                    if(linkPopup.hasClass('popup')) {
                        let linkPopup = $(vm.$refs.linkPopup).closest('.link-popup');
                        if(!linkPopup.hasClass('link')) {
                            linkPopup.removeClass(['popup', 'appear'])
                            linkPopup.addClass('disappear');
                            linkPopup.css('display', 'none');
                        }
                    } else {
                        linkPopup.addClass(['popup', 'appear'])
                        linkPopup.removeClass('disappear');
                        linkPopup.css({
                            display: 'block'
                        });
                    }
                }
            });
        },
        getPosition(length, role) {
            let roleType = this.roleType;
            let width = Math.floor(this.width/(length+1)) - 20;
            let x, y;
            switch(role) {
                case roleType.SPINE:
                    x = this.spine.x + width;
                    y = this.spine.y; 
                    this.spine.x = x;
                    break;
                case roleType.LEAF: 
                    x = this.leaf.x + width;
                    y = this.leaf.y; 
                    this.leaf.x = x;
                    break;
                case roleType.CONTROLLER: 
                    x = this.controller.x + width;
                    y = this.controller.y; 
                    this.controller.x = x;
                    break;
            }
            return {x: x, y: y}
        },
        handleResize() {
            this.width = this.$el.clientWidth;
            let cells = this.graph.getCells().filter(c => c.get('type') === 'html.Element'); 
            this.spine.x = 0;
            this.leaf.x = 0;
            this.controller.x = 0;
            const vm = this;
            cells.forEach(function(el) {
                var role = el.attributes.fields.role;
                var position = vm.getPosition(cells.filter(c => c.attributes.fields.role === role).length, role);
                el.attributes.position = position;
                el.set('position', position);
                el.findView(vm.paper).updateHTML();
            })
            this.graph.resetCells(this.graph.getCells());
            this.graph.removeCells(this.graph.getLinks().filter(l => l.get('type') === 'standard.Link'));
        },
        setMetricInfo(container) {
            let cell = this.graph.getCell(container.getAttribute('model-id'));
            const vm = this;
            if($(container).closest('.device-container').hasClass('popup')) {
                $(container).closest('.device-container').removeClass('popup');
                var popup = container.lastChild;
                popup.style.display = 'none';
                popup.classList.add('disappear');
                popup.classList.remove('appear');
            } else {
                axios.get('/api/metric?device_id=' + container.getAttribute('device-id'))
                    .then(function(response) {
                        cell.attributes.metrics = response.data;
                        vm.paper.findViewByModel(cell).updateMetrics();
                        $(container).closest('.device-container').addClass('popup');
                        if($(container).position().top < 300) {
                            $(container).find('.device-popup').css({top: Math.floor($(container).height()/2)});
                        } else {
                            $(container).find('.device-popup').css({top: '-375px'});
                        }
                        var popup = container.lastChild;
                        popup.style.display = 'block';
                        popup.classList.remove('disappear');
                        popup.classList.add('appear');
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
            }
        },
        search: function(modelId) {
            let model = this.graph.getCell(modelId);
            this.setSelectedSearchType(this.searchType.DEVICE);
            this.setSelectedName(model.attributes.fields.name);
            this.setSelectedRole(model.attributes.fields.role);
            this.mainSearch();
        },
        searchDetailPort: function(e) {
            // if(this.selectSourceTp === '' || this.selectSourceTp === undefined) return;
            this.setSelectedSearchType(this.searchType.DEVICE);
            let cell = this.graph.getCells().filter(cell => cell.device_id === this.sourceId);
            this.setSelectedName(cell[0].attributes.fields.name);
            this.setSelectedRole(cell[0].attributes.fields.role);
            this.mainSearch();
        },
        openELKWindow: function(modelId, portId) {
            let model = this.graph.getCell(modelId);
            let from = model.attributes.metrics.from;
            let to = model.attributes.metrics.to;
            let device_id = model.device_id;
            console.log(portId);
            let port = portId;
            axios.get("api/dashboard/url?device_id=" + device_id + "&from=" +from + "&to="+to + "&port_id=" + port + "")
                .then(function(response) {
                    window.open(response.data, "_blank");
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        ...mapMutations({
            setGraph: 'SET_GRAPH',
            setPaper: 'SET_PAPER',
            setSelectedSearchType: 'SET_SELECTED_SEARCH_TYPE',
            setSelectedName: 'SET_SELECTED_NAME',
            setSelectedRole: 'SET_SELECTED_ROLE'
        })
    }
}
</script>

<style lang="scss">
@import '~@/assets/scss/topology';
</style>