package io.ionic.plugins.aaosdatautils.dataview;

import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;

public class ActiveDataView<T> extends DataView<T> {

    protected PluginCall pluginCall;

    public ActiveDataView(PluginCall pluginCall, Integer dataId, Boolean overwriteOldEvents) {
        super(dataId,overwriteOldEvents);
        this.pluginCall = pluginCall;
        this.pluginCall.setKeepAlive(true);
    }

    public PluginCall getPluginCall() {
        return this.pluginCall;
    }

    public void resolvePluginCall() {
        JSObject property = this.getOldestEvent();
        if(property == null) {
            this.pluginCall.errorCallback("Failed getting value for dataId: " + this.dataId);
        }
        else{
            JSObject ret = new JSObject();
            ret.put("res", this.getOldestEvent());
            this.pluginCall.resolve(ret);
        }
    }

    @Override
    public void setOverwriteOldEvents(boolean overwriteOldEvents) throws UnsupportedOperationException {
        if(!overwriteOldEvents) {
            throw new UnsupportedOperationException("Cannot use 'overwriteOldEvents' flag on ActiveDataView");
        }
        super.setOverwriteOldEvents(true);
    }
}
