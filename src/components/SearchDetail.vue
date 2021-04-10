<template>
    <b-container fluid class="mt-3">
        <b-row class="mb-2">
            <b-col>
                <b-form-select v-model="selectedSearchType" :options="searchTypeOptions">
                </b-form-select>
            </b-col>
            <b-col>
                <b-input-group>
                    <template #append>
                        <b-button variant="outline-secondary" @click="isText = !isText">
                            <b-icon icon="arrow-left-right"></b-icon>
                        </b-button>
                    </template>
                    <b-form-input v-if="isText" v-model="name" type="text" placeholder="Name 입력"></b-form-input>
                    <b-form-select v-else v-model="selectedName" :options="searchNames" aria-placeholder="Name" @input="inputName">
                    </b-form-select>
                </b-input-group>
            </b-col>
            <b-col>
                <b-form-select v-model="selectedRole" :options="searchRoles" aria-placeholder="Role">
                </b-form-select>
            </b-col>
            <b-col>
                <b-button style="width: 100%" @click="search">Search</b-button>
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
                    <div>
                        <div class="setTimer">
                            <span class="clock"></span>
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
window.apiHelper = new APIHelper();
export default {
    name: "SearchDetail",
    data() {
        return {
            isText: true,
            selectedSearchType: searchType.DEVICE,
            searchTypeOptions: [
                {value: searchType.DEVICE, text: 'Device'},
                {value: searchType.FLOW, text: 'Flow'},
                {value: searchType.LINK, text: 'Link'}  
            ],
            searchNames: [
                {value: null, text: 'Name 선택'},
            ],
            selectedName: null,
            searchRoles: [
                {value: null, text: 'Role 선택'},
                {value: roleType.SPINE, text: roleType.SPINE},
                {value: roleType.LEAF, text: roleType.LEAF},
                {value: roleType.CONTROLLER, text: roleType.CONTROLLER}
            ],
            selectedRole: null,
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
            selectedTimeOut: 6000
        }
    },
    methods: {
        inputName(val) {
            console.log(val);
        },
        search() {
            
        },
        filter() {

        }
    }
    
}
</script>

<style lang="scss">
.result {
    border: 1px solid lightgrey;
    width: 100%;
    min-height: 50rem;
    div {
        position: relative;
        display: flex;
        justify-content: flex-end;
        .setTimer {
            width: 220px;
            height: 35px;
            right: 10px;
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
                min-width: 180px;
                padding: .375rem .75rem;
                border: none;
                &:focus {
                    outline: 0;
                }
            }
        }
    }
}
</style>
