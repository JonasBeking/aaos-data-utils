package io.ionic.plugins.aaosdatautils.dataview;

import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;

import io.ionic.plugins.aaosdatautils.dataevent.DataErrorEvent;
import io.ionic.plugins.aaosdatautils.dataevent.DataEvent;

public class ActiveDataView<T> extends DataView<T> {

    protected PluginCall pluginCall;

    public ActiveDataView(PluginCall pluginCall, Integer dataId) {
        super(dataId);
        this.pluginCall = pluginCall;
        this.pluginCall.setKeepAlive(true);
    }

    public PluginCall getPluginCall() {
        return this.pluginCall;
    }

    public void resolvePluginCall() {
        DataEvent dataEvent = this.getMostRecentEvent();
        if(dataEvent == null) {
            new DataErrorEvent("No value for dataId: " + this.dataId + "currently available");
            return;
        }
        if(dataEvent instanceof DataErrorEvent) {
            this.pluginCall.errorCallback(dataEvent.toString());
            return;
        }
        this.pluginCall.resolve(dataEvent);
    }
}
