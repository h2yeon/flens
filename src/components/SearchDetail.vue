<template>
    <b-container fluid class="mt-3">
        <b-row class="mb-2">
            <b-col>
                <b-form-select v-model="selectedSearchType" :options="searchTypeOptions">
                </b-form-select>
            </b-col>
            <b-col>
                <b-form-input id="input-srcip" v-model="srcIp" type="text" placeholder="Src Ip"></b-form-input>
            </b-col>
            <b-col>
                <b-form-input id="input-distip" v-model="srcIp" type="text" placeholder="Dist Ip"></b-form-input>
            </b-col>
            <b-col>
                <b-form-input id="input-proto" v-model="protocol" type="text" placeholder="Proto"></b-form-input>
            </b-col>
            <b-col>
                <b-button>Search</b-button>
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
                <b-button>Metric Filter</b-button>
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
import {searchType} from '@/data/type/searchType'
export default {
    name: "SearchDetail",
    data() {
        return {
            selectedSearchType: searchType.FLOW,
            searchTypeOptions: [
                {value: searchType.DEVICE, text: 'Device'},
                {value: searchType.FLOW, text: 'Flow'},
                {value: searchType.LINK, text: 'Link'}  
            ],
            searchRequirements: [
                {value:  this.srcIp, text: "Src IP"},
                {value: this.distIp, text: "Dist IP"},
                {value: this.protocol, text: 'Proto'}  
            ],
            selectedPPS: 'PPS',
            ppsOptions: [
                {value: 'PPS', text: 'PPS'}
            ],
            selectedOrder: 'ascending',
            orderOptions: [
                {value: 'ascending', text: 'Ascending Order'}
            ],
            srcIp:'',
            distIp: '',
            protocol: '',
            timeOut: 1000,
            timeOutOptions: [
                {value: 1, text: 'Last 1 sec'},                
                {value: 60, text: 'Last 1 min'},                
                {value: 6000, text: 'Last 10 mins'},
            ],
            selectedTimeOut: 6000
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
            top: 45rem;
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
