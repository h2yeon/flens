<template>
    <b-container fluid class="mt-3">
        <b-row class="mb-2">
            <b-col>
                <b-form-select :value="selectedSearchType" @change="setSelectedSearchType" :options="searchTypeOptions">
                </b-form-select>
            </b-col>
            <b-col>
                <b-input-group>
                    <template #append>
                        <b-button variant="outline-secondary" @click="isText = !isText;setSelectedName(null)">
                            <b-icon icon="arrow-left-right"></b-icon>
                        </b-button>
                    </template>
                    <b-form-input v-if="isText" :value="selectedName" @input="setSelectedName" type="text" placeholder="Name 입력"></b-form-input>
                    <b-form-select v-else :value="selectedName" @change="setSelectedName" :options="searchNames" aria-placeholder="Name">
                    </b-form-select>
                </b-input-group>
            </b-col>
            <b-col>
                <b-form-select :value="selectedRole" @change="setSelectedRole" :options="searchRoles" aria-placeholder="Role">
                </b-form-select>
            </b-col>
            <b-col>
                <b-button style="width: 100%" @click="isDetail=false;
                search(selectedName? isText?selectedName + '*' : selectedName : undefined,selectedRole?selectedRole:undefined)">Search</b-button>
            </b-col>
        </b-row>
        <b-row class="mb-2">
            <b-col>
                <b-form-select v-model="selectedPPS" :options="ppsOptions">
                </b-form-select>
            </b-col>
            <b-col>
                <b-form-select v-model="selectedOrder" :options="orderOptions">
                </b-form-select>
            </b-col>
            <b-col>
                <b-form-input class='form-control'  v-model="timeOut" type="number"></b-form-input>
            </b-col>
            <b-col>
                <b-button style="width: 100%" @click="filter">Metric Filter</b-button>
            </b-col>
        </b-row>
        <b-row align-v="stretch" class="mb-2">
            <b-col>
                <div class='result'>
                    <b-container v-if="isDetail" class="mt-3" >
                        <b-card>
                            <b-card-title>Device Info</b-card-title>
                            <b-card-text>ID : {{clickRow.id}}</b-card-text>
                            <b-card-text>Name : {{clickRow.name}}</b-card-text>
                            <b-card-text>Mac : {{clickRow.mac}}</b-card-text>
                            <b-card-text>Role : {{clickRow.role}}</b-card-text>
                            <b-card-text>Rx : {{clickRow.rx}}</b-card-text>
                            <b-card-text>Tx : {{clickRow.tx}}</b-card-text>
                            <b-card-text>Dropped : {{clickRow.dropped}}</b-card-text>
                        </b-card>
                        <b-card class="mt-2">
                            <b-card-title>Metric<div class="chartIcon"></div></b-card-title>

                        </b-card>
                        <b-card class="mt-2">
                            <b-card-title>Active Port</b-card-title>
                            
                        </b-card>
                    </b-container>
                    <b-table 
                    v-else
                    hover 
                    :fields="fields" 
                    :items="items"
                    @row-dblclicked="onRowClicked"
                    selectable
                    ></b-table>
                    
                    <div class="setTimer">
                        <b-icon icon="clock" class="ml-3"></b-icon>
                        <select v-model="selectedTimeOut">
                            <option 
                                v-for="(option,index) in timeOutOptions" 
                                :key="index"
                                :value="option.value">
                                {{option.text}}
                            </option>
                        </select>
                    </div>
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
                    vm.searchNames = response.data;
                    vm.searchNames.unshift({value: null, text: 'Name 선택'});
                })
                .catch(function(error) {
                    console.log(error);
                });
    },
    computed: {
        ...mapState({
            selectedSearchType: state => state.selectedSearchType,
            selectedName: state => state.selectedName,
            selectedRole: state => state.selectedRole,
        })
    },
    data() {
        return {
            isText: true,
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
            selectedPPS: 'PPS',
            ppsOptions: [
                {value: 'PPS', text: 'PPS'}
            ],
            selectedOrder: 'ascending',
            orderOptions: [
                {value: 'ascending', text: 'Ascending Order'}
            ],
            timeOut: 100,
            timeOutOptions: [
                {value: 6000, text: 'Last 1 mins'},                
                {value: 30000, text: 'Last 5 mins'},                
                {value: 60000, text: 'Last 10 mins'},
            ],
            selectedTimeOut: 6000,
            fields: ['id', 'name', 'role', 'rx', 'tx', 'dropped'],
            items: [
            ],
            isDetail: false,
            clickRow: null
        }
    },
    methods: {
        mainSearch() {
            this.isDetail = false;
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
            axios.get('/api/searchanddetail?name=' + deviceName + '&role=' + role)
                .then(function(response) {
                    var result = response.data;
                    if(vm.isDetail) {
                        
                    } else {
                        vm.items = result;
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        filter() {

        },
        onRowClicked(row) {
            this.clickRow = row;
            this.isDetail = true;
            this.items = [];
            this.search(row.name, row.role);
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
    
    .setTimer {
        position: absolute;
        width: 180px;
        height: 35px;
        right: 30px;
        top: 47rem;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1;
        color: black;
        background-color: #fff;
        background-clip: padding-box;
        transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        border: 1px solid #ced4da;
        border-radius: .25rem;
        .clock {
            background: url('../images/clock.png') no-repeat top left;
            background-size: contain;
            width: 25px;
            height: 25px;
            margin-top: 5px;
            margin-right: 5px;
        }
        select {
            min-width: 120px;
            padding: .375rem .75rem;
            border: none;
            &:focus {
                outline: 0;
            }
        }
    }
}
</style>
