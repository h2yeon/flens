<template>
    <div class='container'>
        <div class='row'>
            <div class='col'>
                <select class='form-control' v-model="selectedSearchType">
                        <option 
                            v-for="(option,index) in searchTypeOptions" 
                            :key="index"
                            :value="option.value">
                            {{option.text}}
                        </option>
                </select>
            </div>
            <div class='col'>
                <label class='form-control'>Src Ip</label>
                <input class='form-control'  :v-model="srcIp" type="text">
            </div>
            <div class='col'>
                <label class='form-control'>Dist Ip</label>
                <input class='form-control'  :v-model="distIp" type="text">
            </div>
            <div class='col'>
                <label class='form-control'>Proto</label>
                <input class='form-control'  :v-model="protocol" type="text">
            </div>
            <div class='col'>
                <button>Search</button>
            </div>
        </div>
        <div class='row'>
            <div class='col'></div>
            <div class='col'>
                <select class='form-control' v-model="selectedPPS">
                        <option 
                            v-for="(option,index) in ppsOptions" 
                            :key="index"
                            :value="option.value">
                            {{option.text}}
                        </option>
                </select>
            </div>
            <div class='col'>
                <select class='form-control' v-model="selectedOrder">
                        <option 
                            v-for="(option,index) in orderOptions" 
                            :key="index"
                            :value="option.value">
                            {{option.text}}
                        </option>
                </select>
            </div>
            <div class='col'>
                <input class='form-control'  v-model="timeOut" type="number">
            </div>
            <div class='col'>
                <button>Metric Filter</button>
            </div>
        </div>
        <div class='result'>
            <div>
                <select v-model="selectedSearchType" class='setTimer' >
                    <option 
                        v-for="(option,index) in searchTypeOptions" 
                        :key="index"
                        :value="option.value">
                        {{option.text}}
                    </option>
                </select>
            </div>
        </div>
    </div>
</template>

<script>
import {searchType} from '@/data/type/searchType'
export default {
    name: "SearchDetail",
    data() {
        return {
            selectedSearchType: searchType.FLOW,
            searchTypeOptions: [
                {text: 'Device', value: searchType.DEVICE},
                {text: 'Flow', value: searchType.FLOW},
                {text: 'Link', value: searchType.LINK}  
            ],
            searchRequirements: [
                {label:"Src IP", value: this.srcIp},
                {label: "Dist IP", value: this.distIp},
                {label: "Proto", value: this.protocol},
            ],
            selectedPPS: 'PPS',
            ppsOptions: [
                {text: 'PPS', value: 'PPS'}
            ],
            selectedOrder: 'ascending',
            orderOptions: [
                {text: 'Ascending Order', value: 'ascending'}
            ],
            srcIp:'',
            distIp: '',
            protocol: '',
            timeOut: 100,
        }
    }
}
</script>

<style lang="scss">
.container {
    margin-right: 2em; 
    align-content: stretch;
    height: 100%;
}
.row {
    display: flex;
    flex-wrap: wrap;
    
    .col {
        flex-basis: 0;
        flex-grow: 1;
        max-width: 100%;
        padding-top: .75rem;
        padding-bottom: .75rem;
        display: flex;
        justify-content: space-between;
        .form-control {
            margin-right: 10px;
            display: block;
            width: 100%;
            padding: .375rem .75rem;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            color: #212529;
            background-color: #fff;
            background-clip: padding-box;
            border: 1px solid #ced4da;
            border-radius: .25rem;
            transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        }
        button {
            margin: 0 10px 5px 10px; 
            width: 150px;
            height: 100%;
            display: inline-block;
            color: white;
            font-weight: 400;
            text-align: center;
            vertical-align: middle;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            background-color: #495057;
            border: 1px solid transparent;
            padding: .375rem .75rem;
            font-size: 1rem;
            line-height: 1.5;
            border-radius: .25rem;
            transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        }
    }
}
.result {
    border: 1px solid lightgrey;
    width: 100%;
    height: 80%;
    div {
        position: relative;
        .setTimer {
            position: absolute;
            width: 200px;
            right: 10px;
            top: 50rem;
            padding: .375rem .75rem;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            color: black;
            background-color: #fff;
            background-clip: padding-box;
            border: 1px solid #ced4da;
            border-radius: .25rem;
            transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        }
    }
}
</style>
