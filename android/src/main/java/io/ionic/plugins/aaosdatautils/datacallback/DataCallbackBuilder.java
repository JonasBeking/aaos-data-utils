package io.ionic.plugins.aaosdatautils.datacallback;


import io.ionic.plugins.aaosdatautils.dataview.DataView;


public interface DataCallbackBuilder<T> {
    T build(DataView<T> dataView);
}
