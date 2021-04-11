<template>
    <div id="topology">
        <div ref="linkPopup" class="link-popup" 
            @mouseover="showLinkPopup" 
            @mouseleave="hideLinkPopup" 
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
            @mouseover="showPortPopup" 
            @mouseleave="hidePortPopup"
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
                <div class="port-tool-icon-chart" @click="openELKWindow(source.id, selectSourceTp)"></div>
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
import {mapMutations} from 'vuex'
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
            linkColor: 'black',
            linkWidth: 2,
            portColor: 'black',
            portSize: 5
        }
        this.width = this.$el.clientWidth;
        this.graph = new joint.dia.Graph;
        this.paper = new joint.dia.Paper({
            el: $('#topology'),
            model: this.graph,
            width: this.width,
            height: this.$el.clientHeight,
            marginX: 100,
            marginY: 100,
            gridSize: 1
        });
        define_html(this);
        define_link(style);
        this.topology_init();
        this.addEvent();
    },
    data() {
        return {
            graph: null,
            paper: null,
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
            axios.post('/pps_counter_ndjson2/_search', apiHelper.getPortMetricParam(this.sourceId, this.selectSourceTp))
                    .then(function(response) {
                        vm.portMetric = apiHelper.getMetric(response.data);
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
            axios.get('/fabric_node_def.json')
                .then(function(response) {
                    vm.createCells(apiHelper.getNodeDef(response.data));
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
                    position: vm.getPosition(data, o.dev_role),
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
            axios.get('/fabric_link.json')
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
            this.paper.on('link:mouseenter', function(elementView, event) {
                if(event.target.tagName === 'circle') {
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
                    let portPopup = $(vm.$refs.portPopup).closest('.port-popup');
                    vm.source = elementView.model.getSourceElement();
                    vm.target = elementView.model.getTargetElement();
                    if(event.target.getAttribute('joint-selector') === 'target') {
                        vm.source = elementView.model.getTargetElement();
                        vm.target = elementView.model.getSourceElement();
                    }
                    let source = vm.source;
                    vm.sourceId = source.device_id;
                    vm.sourceTp = source.attributes.tp_list.filter(tp => tp.dev_id === source.device_id && tp.tar[0] !== undefined).map(tp => ({
                        value: tp.tp,
                        text: tp.tp
                    }));
                    vm.targetId = vm.target.device_id;
                    portPopup.addClass(['popup', 'appear'])
                    portPopup.removeClass('disappear');
                    portPopup.css({
                        display: 'block'
                    });
                } else {
                    vm.linkPopupPosition.x = event.clientX;
                    vm.linkPopupPosition.y = event.clientY;
                    let linkPopup = $(vm.$refs.linkPopup).closest('.link-popup');
                    linkPopup.addClass(['popup', 'appear'])
                    linkPopup.removeClass('disappear');
                    linkPopup.css({
                        display: 'block'
                    });
                }
            });
            this.paper.on('link:mouseleave', function(elementView, event) {
                if(event.target.tagName === 'circle') {
                    let portPopup = $(vm.$refs.portPopup).closest('.port-popup');
                    if(!portPopup.hasClass('port')) {
                        portPopup.removeClass(['popup', 'appear'])
                        portPopup.addClass('disappear');
                        portPopup.css('display', 'none');
                    }
                } else {
                    let linkPopup = $(vm.$refs.linkPopup).closest('.link-popup');
                    if(!linkPopup.hasClass('link')) {
                        linkPopup.removeClass(['popup', 'appear'])
                        linkPopup.addClass('disappear');
                        linkPopup.css('display', 'none');
                    }
                }
            });
        },
        getPosition(result, role) {
            let roleType = this.roleType;
            let length = result.filter(data => data.dev_role === role).length; 
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
        setMetricInfo(container) {
            let cell = this.graph.getCell(container.getAttribute('model-id'));
            const vm = this;
            if(!$(container).closest('.device-container').hasClass('popup')) {
                axios.post('/pps_counter_ndjson2/_search', apiHelper.getDeviceMetricParam(container.getAttribute('device-id')))
                    .then(function(response) {
                        cell.attributes.metrics = apiHelper.getMetric(response.data);
                        vm.paper.findViewByModel(cell).updateMetrics();
                        $(container).closest('.device-container').addClass('popup');
                        if($(container).position().top < 250) {
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
            this.setSelectedName(model.device_id);
            this.setSelectedRole(model.attributes.fields.role);
            this.mainSearch();
        },
        searchDetailPort: function(e) {
            // if(this.selectSourceTp === '' || this.selectSourceTp === undefined) return;
            this.setSelectedSearchType(this.searchType.DEVICE);
            this.setSelectedName(this.sourceId);
            let cell = this.graph.getCells().filter(cell => cell.device_id === this.sourceId);
            this.setSelectedRole(cell[0].attributes.fields.role);
            this.mainSearch();
        },
        openELKWindow: function(modelId, portId) {
            let model = this.graph.getCell(modelId);
            let from = model.attributes.metrics.from;
            let to = model.attributes.metrics.to;
            let device_id = model.device_id;
            let port = portId === undefined ? '' : portId;
            let url = "http://210.113.225.166:25601/app/dashboards#/view/5a65d140-8ae8-11eb-b70e-2f1a3dbeec6a?"
                    + "_g=(filters:!(),query:(language:kuery,query:''),refreshInterval:(pause:!t,value:0),time:(from:'"
                    + from + "',to:'" + to + "'))&_a=(description:'',filters:!(('$state':(store:appState),meta:(alias:!n,"
                    + "disabled:!f,index:'8b595fa0-8ac6-11eb-8007-071c2d9bfa1e',key:dev_id,negate:!f,params:(query:"
                    + device_id + "),type:phrase),query:(match_phrase:(dev_id:" + device_id + "))),('$state':(store:appState),meta:(alias:!n,"
                    + "disabled:!f,index:'8b595fa0-8ac6-11eb-8007-071c2d9bfa1e',key:port,negate:!f,params:(query:" 
                    + port + "),type:phrase),query:(match_phrase:(port:" + port + ")))),fullScreenMode:!f,options:(hidePanelTitles:!f,useMargins:!t)," 
                    + "query:(language:kuery,query:''),timeRestore:!f,title:Non_INT_Metric_Dashboard,viewMode:view)";
            window.open(url, "_blank");
        },
        showLinkPopup: function(e) {
            let linkPopup = $(e.target).closest('.link-popup');
            linkPopup.addClass(['popup', 'appear', 'link'])
            linkPopup.removeClass('disappear');
            linkPopup.css({
                display: 'block'
            });
        },
        hideLinkPopup: function(e) {
            let linkPopup = $(e.target).closest('.link-popup');
            linkPopup.removeClass(['popup', 'appear', 'link'])
            linkPopup.addClass('disappear');
            linkPopup.css('display', 'none');
        },
        showPortPopup: function(e) {
            let portPopup = $(e.target).closest('.port-popup');
            portPopup.addClass(['popup', 'appear', 'port'])
            portPopup.removeClass('disappear');
            portPopup.css({
                display: 'block'
            });
        },
        hidePortPopup: function(e) {
            let portPopup = $(e.target).closest('.port-popup');
            portPopup.removeClass(['popup', 'appear', 'port'])
            portPopup.addClass('disappear');
            portPopup.css('display', 'none');
            this.source = null;
            this.sourceId = '';
            this.sourceTp = [];
        },
        ...mapMutations({
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