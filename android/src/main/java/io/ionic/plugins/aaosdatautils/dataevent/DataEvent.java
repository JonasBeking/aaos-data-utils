package io.ionic.plugins.aaosdatautils.dataevent;

import com.getcapacitor.JSObject;

public class DataEvent extends JSObject {

    protected DataEvent(int eventCode) {
        this.put("timestamp",System.currentTimeMillis());
        this.put("event",eventCode);
    }

}
