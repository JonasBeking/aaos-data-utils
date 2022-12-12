package io.ionic.plugins.aaosdatautils.dataerror;
import com.getcapacitor.PluginCall;

import io.ionic.plugins.aaosdatautils.dataevent.DataErrorEvent;


//TODO properly implement the exceptions as toString should not be the method to get the propert message
public class DataErrorHandler {
    public void handle(Exception e, PluginCall pluginCall) {

        finish(e.toString(),pluginCall);
    }

    protected void finish(String reason, PluginCall pluginCall) {
        DataErrorEvent dataErrorEvent = new DataErrorEvent(reason);
        pluginCall.errorCallback(dataErrorEvent.toString());
    }
}
