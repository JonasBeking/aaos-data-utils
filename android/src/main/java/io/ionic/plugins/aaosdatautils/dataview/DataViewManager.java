package io.ionic.plugins.aaosdatautils.dataview;
import android.util.Log;

import com.getcapacitor.Bridge;
import com.getcapacitor.JSArray;
import com.getcapacitor.PluginCall;
import java.util.HashMap;

import io.ionic.plugins.aaosdatautils.datacallback.DataCallbackBuilder;
import io.ionic.plugins.aaosdatautils.dataerror.DataViewUnknownException;
import io.ionic.plugins.aaosdatautils.dataevent.DataEvent;

public abstract class DataViewManager<T> {

    public HashMap<String, DataView<T>> dataViewMap = new HashMap<>();
    protected DataCallbackBuilder<T> dataCallbackBuilder;

    public DataView<T> generate(PluginCall pluginCall, String addressableName, Boolean isActive) {
        DataView<T> dataView = isActive ? new ActiveDataView<>(pluginCall, -1) : new PassiveDataView<>(-1);

        T callback = this.dataCallbackBuilder.build(dataView);

        dataView.setCallback(callback);

        if(addressableName == null) {
            throw new IllegalArgumentException("AddressableName for DataView must not be null");
        }
        this.dataViewMap.put(addressableName, dataView);
        return dataView;
    }

    public DataView<T> generate(PluginCall pluginCall, Integer dataId,String addressableName, Boolean isActive) {
        DataView<T> dataView = isActive ? new ActiveDataView<>(pluginCall, dataId) : new PassiveDataView<>(dataId);
        T callback = this.dataCallbackBuilder.build(dataView);
        dataView.setCallback(callback);
        if(addressableName == null) {
            addressableName = String.valueOf(dataId);
        }
        this.dataViewMap.put(addressableName, dataView);
        return dataView;
    }

    public DataView<T> remove(String addressableName, Bridge bridge) {
        DataView<T> dataView = this.dataViewMap.remove(addressableName);
        if(dataView == null) {
            throw new DataViewUnknownException(addressableName);
        }
        //Indicates that the PropertyView is being used for async callback and therefore holds
        //a PluginCall that is attached to a JS callback. This is the only way to "delete" the
        //Call without triggering the callback
        if(dataView instanceof ActiveDataView) {
            PluginCall destroyedPluginCall = ((ActiveDataView<T>) dataView).getPluginCall();
            destroyedPluginCall.setKeepAlive(false);
            destroyedPluginCall.release(bridge);
        }
        return dataView;
    }

    public DataEvent view(String addressableName) {
        DataView<T> desiredDataView = this.dataViewMap.get(addressableName);
        if(desiredDataView == null) {
            throw new DataViewUnknownException(addressableName);
        }
        return desiredDataView.getMostRecentEvent();
    }

    public JSArray viewAll(String addressableName) {
        DataView<T> desiredDataView = this.dataViewMap.get(addressableName);
        if(desiredDataView == null) {
            throw new DataViewUnknownException(addressableName);
        }
        return desiredDataView.getAllEvents();
    }

}
