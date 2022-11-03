package io.ionic.plugins.aaosdatautils.dataview;

import com.getcapacitor.Bridge;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import java.util.HashMap;

import io.ionic.plugins.aaosdatautils.datacallback.DataCallbackBuilder;
import io.ionic.plugins.aaosdatautils.dataerror.DataViewUnknownException;

public abstract class DataViewManager<T> {

    public HashMap<String, DataView<T>> dataViewMap = new HashMap<>();
    protected DataCallbackBuilder<T> dataCallbackBuilder;

    public DataView<T> generate(PluginCall pluginCall, String addressableName, Boolean isActive, Boolean overwriteOldEvents) {
        DataView<T> dataView = isActive ? new ActiveDataView<>(pluginCall, null, overwriteOldEvents) : new PassiveDataView<>(null, overwriteOldEvents);
        T callback = this.dataCallbackBuilder.build(dataView);
        dataView.setCallback(callback);
        if(addressableName == null) {
            throw new IllegalArgumentException("AddressableName for DataView must not be null");
        }
        this.dataViewMap.put(addressableName, dataView);
        return dataView;
    }

    public DataView<T> generate(PluginCall pluginCall, Integer dataId,String addressableName, Boolean isActive, Boolean overwriteOldEvents) {
        DataView<T> dataView = isActive ? new ActiveDataView<>(pluginCall, dataId, overwriteOldEvents) : new PassiveDataView<>(dataId, overwriteOldEvents);
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

    public JSObject view(String addressableName) {
        DataView<T> desiredDataView = this.dataViewMap.get(addressableName);
        if(desiredDataView == null) {
            throw new DataViewUnknownException(addressableName);
        }
        return desiredDataView.getOldestEvent();
    }

    public void setDataViewOverwriteOldEvents(String addressableName,Boolean overwriteOldEvents) throws UnsupportedOperationException {
        DataView<T> desiredDataView = this.dataViewMap.get(addressableName);
        if(desiredDataView == null) {
            throw new DataViewUnknownException(addressableName);
        }
        desiredDataView.setOverwriteOldEvents(overwriteOldEvents);
    }
}
