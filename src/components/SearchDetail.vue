<template>
    <b-container fluid class="mt-3">
        <b-row class="mb-2">
            <b-col>
                <b-form-select :value="selectedSearchType" @change="changeSearchType" :options="searchTypeOptions">
                </b-form-select>
            </b-col>
            <b-col>
                <b-input-group :style="{display: selectedSearchType===searchType.FLOW?'none':'flex'}" >
                    <template #append>
                        <b-button variant="outline-secondary" @click="isText = !isText;setSelectedName(null)">
                            <b-icon icon="arrow-left-right"></b-icon>
                        </b-button>
                    </template>
                    <b-form-input v-if="isText" :value="selectedName" 
                    @input="setSelectedName" type="text" placeholder="Name 입력"></b-form-input>
                    <b-form-select v-else :value="selectedName" @change="setSelectedName" :options="searchNames" aria-placeholder="Name">
                    </b-form-select>
                </b-input-group>
            </b-col>
            <b-col>
                <b-form-select :style="{display: selectedSearchType===searchType.FLOW?'none':'inline-block'}"
                 :value="selectedRole" @change="setSelectedRole" :options="searchRoles" aria-placeholder="Role">
                </b-form-select>
            </b-col>
            <b-col>
                <b-button style="width: 100%" @click="
                search(selectedName? isText?selectedName + '*' : selectedName : undefined,selectedRole?selectedRole:undefined)">Search</b-button>
            </b-col>
        </b-row>
        <b-row align-v="stretch" class="mb-2">
            <b-col>
                <div class='result'>
                    <b-table 
                        hover 
                        :fields="selectedSearchType === searchType.FLOW? flowFields : deviceFields" 
                        :items="items"
                        selectable
                        sticky-header
                        style="max-height: 50rem"
                    >   
                       <template #cell(protocol)="row">
                            <b-button size="sm" @click="openProtocolWindow(row.item)" variant="light">
                                {{row.item.protocol}} 
                            </b-button>
                        </template>
                       <template #cell(detail)="row">
                            <b-button size="sm" @click="row.toggleDetails">
                                {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
                            </b-button>
                        </template>
                         <template #row-details="row">
                            <b-card no-body class="mx-3"
                                    v-if="selectedSearchType === searchType.FLOW">
                                <b-table  
                                    :fields="detailFlowFields"
                                    :items="row.item.flowPathList"
                                    @row-clicked="onDetailRowClicked"
                                >
                                </b-table>
                            </b-card>
                            <b-container fluid v-else> 
                                <b-card >
                                    <b-card-title>Device Info</b-card-title>
                                    <b-card-text>ID : {{row.item.id}}</b-card-text>
                                    <b-card-text>Name : {{row.item.name}}</b-card-text>
                                    <b-card-text>Mac : {{row.item.mac}}</b-card-text>
                                    <b-card-text>Role : {{row.item.role}}</b-card-text>
                                    <b-card-text>Rx : {{row.item.rx}}</b-card-text>
                                    <b-card-text>Tx : {{row.item.tx}}</b-card-text>
                                    <b-card-text>Dropped : {{row.item.dropped}}</b-card-text>
                                </b-card>
                                <b-card class="mt-2">
                                    <b-card-title>Metric<div class="chartIcon" @click="openELKWindow(row.item.id)"></div></b-card-title>

                                </b-card>
                                <b-card class="mt-2">
                                    <b-card-title>Active Port</b-card-title>
                                    
                                </b-card>
                            </b-container>
                        </template>
                    </b-table>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import {searchType} from '@/data/type/searchType.js'
import {roleType} from '@/data/type/roleType.js'
import axios from 'axios'
import {APIHelper} from '@/APIHelper.js'
import {mapMutations, mapState} from 'vuex'
window.apiHelper = new APIHelper();
export default {
    name: "SearchDetail",
    mounted() {
        const vm = this;
        axios.get('/api/devicenamelist')
                .then(function(response) {
                    vm.searchNames = response.data.map(r => ({
                        value: r.id,text: r.name
                    }));
                    vm.searchNames.unshift({value: null, text: 'Name 선택'});
                })
                .catch(function(error) {
                    console.log(error);
                });
    },
    computed: {
        ...mapState({
            graph: state => state.graph,
            paper: state => state.paper,
            selectedSearchType: state => state.selectedSearchType,
            selectedName: state => state.selectedName,
            selectedRole: state => state.selectedRole,
        })
    },
    data() {
        return {
            isText: true,
            searchType: searchType,
            searchTypeOptions: [
                {value: searchType.DEVICE, text: 'Device'},
                {value: searchType.FLOW, text: 'Flow'},
                {value: searchType.LINK, text: 'Link'}  
            ],
            searchNames: [
                {value: null, text: 'Name 선택'},
            ],
            searchRoles: [
                {value: null, text: 'Role 선택'},
                {value: roleType.SPINE, text: roleType.SPINE},
                {value: roleType.LEAF, text: roleType.LEAF},
                {value: roleType.CONTROLLER, text: roleType.CONTROLLER}
            ],
            timeOutOptions: [
                {value: 6000, text: 'Last 1 mins'},                
                {value: 30000, text: 'Last 5 mins'},                
                {value: 60000, text: 'Last 10 mins'},
            ],
            selectedTimeOut: 6000,
            deviceFields: [
                {key:'id', label: 'ID'}, 
                {key:'name', label: 'Name'}, 
                {key:'role', label: 'Role'}, 
                {key:'rx', label: 'Rx'}, 
                {key:'tx', label: 'Tx'},
                {key:'dropped', label: 'Dropped'},
                {key:'detail', label: 'Detail'}
            ],
            flowFields: [
                {key:'srcIp', label:'Source IP'}, 
                {key:'srcPort', label: 'Source Port'}, 
                {key:'dstIp', label: 'Destination IP'}, 
                {key:'dstPort', label: 'Destination Port'},
                {key:'protocol', label: 'Protocol'},
                {key:'detail', label: 'Detail'}
            ],
            items: [
            ],
            detailFlowFields: [
                {key: 'srcDeviceId', label: 'Source Device ID'},
                {key: 'srcPortId', label: 'Source Port ID'},
                {key: 'dstDeviceId', label: 'Destination Device ID'},
                {key: 'dstPortId', label: 'Destination Port ID'}
            ],
            clickRow: null
        }
    },
    methods: {
        mainSearch() {
            this.search(this.selectedName, this.selectedRole);
        },
        search(deviceName, role) {
            const vm = this;
            if(deviceName === "null") {
                deviceName = undefined;
            }
            if(role === "" || role === undefined) {
                role = undefined
            }
            var params = {name: deviceName, role: role}
            let url = '/api/searchanddetail?name=' + deviceName + '&role=' + role; 
            if(this.selectedSearchType === this.searchType.FLOW) {
                url = '/api/flowpath';
            }
            axios.get(url)
                .then(function(response) {
                    var result = response.data;
                        vm.items = result;
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        onDetailRowClicked(data) {
            this.graph.removeCells(this.graph.getLinks().filter(l => l.get('type') === 'standard.Link'));
            this.graph.getLinks().forEach(l => {
                l.attr({
                    line: {
                        stroke: 'black'
                    }
                })
            })
            let source = this.graph.getCells().filter(cell => cell.device_id === data.srcDeviceId);
            let target = this.graph.getCells().filter(cell => cell.device_id === data.dstDeviceId);
            let links = this.graph.getLinks();
            if(source.length === 0 || target.length === 0) {
                let randomIndex = Math.floor(Math.random()*10);
                if(randomIndex >= links.length) randomIndex = links.length-1;
                links[randomIndex].attr({
                    line: { 
                        stroke: 'red' 
                    }
                })
                return;
            }
            if(data.srcDeviceId === data.dstDeviceId) {
                let position = source[0].position();
                let size = source[0].size();
                let start = {x: position.x + Math.floor(size.width/2), y : position.y+10};
                let end = {x: position.x + size.width - 20, y: position.y + Math.floor(size.height/2)};
                var link = new joint.shapes.standard.Link();
                link.source(start);
                link.target(end);
                link.connector('smooth');
                link.vertices([
                    { x: start.x + 30, y: start.y - 30 },
                    { x: end.x + 30, y: end.y - 30 }]);
                link.attr({
                    line: {
                        stroke: 'red',
                        strokeWidth: 2,
                    }
                })
                link.addTo(this.graph);
            } else {
                let link = links.filter(l => l.source() === srcDeviceId && l.target() === dstDeviceId);
                var existLink = false;
                if(link.length === 0) {
                    link = links.filter(l => l.target === srcDeviceId && l.source === dstDeviceId);
                    if(link.length > 0) {
                        existLink = true;
                    }
                } else {
                    existLink = true;
                }

                if(existLink) {
                    link[0].attr({
                        line: {
                            stroke: 'red'
                        }
                    })
                }
            }

        },
        changeSearchType(val) {
            this.items = [];
            this.setSelectedSearchType(val);
        },
        openELKWindow: function(device_id) {
            let model = this.graph.getCells().filter(cell => cell.device_id === device_id);
            if(model.length === 0) {
                return;
            }
            model = model[0];
            var params = {
                device_id: device_id,
                from: model.attributes.metrics.from,
                to:model.attributes.metrics.to
            }
            axios.get("api/dashboard/url", {params: params})
                .then(function(response) {
                    window.open(response.data, "_blank");
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        openProtocolWindow(data) {
            var params = {
                src_ip:data.srcIp, 
                src_port: data.srcPort,
                dst_ip:data.dstIp,
                dst_port: data.dstPort,
                protocol: data.protocol}
            axios.get("api/flowpath/dashboard/url", {params:params})
                .then(function(response) {
                    debugger;
                    window.open(response.data, "_blank");
                })
                .catch(function(error) {
                    console.log(error);
                });
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
.chartIcon {
    display: inline-block;
    margin-left: 20px;
    width: 18px;
    height: 18px;
    background: url('../images/chart.svg') no-repeat top left;
    background-size: contain;
}
.result {
    border: 1px solid lightgrey;
    width: 100%;
    min-height: 50rem;
    max-height: 50rem;
}
</style>
