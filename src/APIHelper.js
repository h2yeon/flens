export function APIHelper() {}
APIHelper.prototype.getNodeDef = function(data) {
    let result = [];
    for (let deviceId in data) {
        let value = { 'id': deviceId };
        for (let deviceInfo in data[deviceId]) {
            value[deviceInfo] = data[deviceId][deviceInfo];
        }
        result.push(value);
    }
    return result;
};
APIHelper.prototype.getDeviceMetricParam = function(deviceId) {
    let param = getMetricParam();
    param['query'] = {
        'match': {
            'dev_id': deviceId
        }
    }
    return param;
};
APIHelper.prototype.getPortMetricParam = function(deviceId, portId) {
    let param = getMetricParam();
    param['query'] = {
        'bool': {
            'must': [
                {
                    'match': {
                        'dev_id': deviceId
                    }
                },
                {
                    'match': {
                        'port': portId
                    }
                }
            ]
        }
    }
    return param;
};

APIHelper.prototype.getMetric = function(data) {
    let buckets = data['aggregations']['date_hist']['buckets'][0];
    return {
        'from': buckets['from_as_string'],
        'to': buckets['to_as_string'],
        'dropPacketCount': buckets['dropped_count_avg']['value'],
        'dropBytes': buckets['dropped_bytes_avg']['value'],
        'rxPacketCount': buckets['rx_count_avg']['value'],
        'rxBytes': buckets['rx_bytes_avg']['value'],
        'txPacketCount': buckets['tx_count_avg']['value'],
        'txBytes': buckets['tx_bytes_avg']['value']
    };
};

APIHelper.prototype.getDeviceNameList = function(data) {
    let deviceList = this.getQueryResult(data);
    let result = [];
    for (let i in deviceList) {
        result.push({value:deviceList[i]['id'], text:deviceList[i]['id']});
    }
    return result;
}

APIHelper.prototype.getSearchAndDetailViewParam = function(deviceId, role) {
    if(deviceId === undefined) {
        return {};
    }
    let param = {
        'query':{
            'bool': {
              'must': []
            }
        }
    };   
    let must = {};
    if(deviceId !== undefined) {
        var wildcard = {'wildcard': {'dev_name': deviceId}};
        param['query']["bool"]["must"].push(wildcard);
    }
    if(role !== undefined) {
        var match = {'match': {'dev_role': role}};
        param['query']["bool"]["must"].push(match);
    }

    return param;
}

APIHelper.prototype.getQueryResult = function(data) {
    let result = [];
    for (let i in data['hits']['hits']) {
        let source = data['hits']['hits'][i]['_source'];
        result.push({
            'id': source['dev_id'],
            'mac': source['dev_mac'],
            'name': source['dev_name'],
            'role': source['dev_role'],
            'rx': source['rx_1m'],
            'tx': source['tx_1m'],
            'dropped': source['dropped_1m'],
        });
    }
    return result;
}

function getMetricParam() {
    return {
        'size': 0,
        'aggs': {
            'date_hist': {
                'date_range': {
                    'field': '@timestamp',
                    'ranges': [{ 'to': 'now', 'from': 'now-1m' }]
                },
                'aggs': {
                    'rx_bytes_avg': {
                        'avg': {
                            'field': 'RxBytes'
                        }
                    },
                    'tx_bytes_avg': {
                        'avg': {
                            'field': 'TxBytes'
                        }
                    }, 'dropped_bytes_avg': {
                        'avg': {
                            'field': 'DroppedBytes'
                        }
                    },
                    'rx_count_avg': {
                        'avg': {
                            'field': 'RxPackets'
                        }
                    },
                    'tx_count_avg': {
                        'avg': {
                            'field': 'TxPackets'
                        }
                    },
                    'dropped_count_avg': {
                        'avg': {
                            'field': 'DroppedPackets'
                        }
                    }
                }
            }
        }
    };
}