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
    return {
        'query': {
            'match': {
                'dev_id': deviceId
            }
        },
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
};
APIHelper.prototype.getDeviceMetric = function(data) {
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
APIHelper.prototype.getPortMetricParam = function(deviceId, portId) {
    return {
        'query': {
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
    };
};
