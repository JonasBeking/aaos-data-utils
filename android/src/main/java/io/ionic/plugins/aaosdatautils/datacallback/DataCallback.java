package io.ionic.plugins.aaosdatautils.datacallback;

import io.ionic.plugins.aaosdatautils.dataevent.DataEvent;
import io.ionic.plugins.aaosdatautils.dataview.ActiveDataView;
import io.ionic.plugins.aaosdatautils.dataview.DataView;

public interface DataCallback<T> {

    DataView<T> getDataView();

    default void passDataToView(DataEvent dataEvent) {
        this.getDataView().insertEvent(dataEvent);
        //Must be separated from setProperty as setProperty might also be used for flushing the value
        //back to the car
        if(this.getDataView() instanceof ActiveDataView) {
            ((ActiveDataView<T>) this.getDataView()).resolvePluginCall();
        }
    }
}
